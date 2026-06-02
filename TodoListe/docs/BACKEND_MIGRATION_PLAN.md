# Backend Migration Plan

**Status:** Architecture planning (Agent 07)  
**App:** High Value Todo — React/Vite SPA, local-first  
**Constraint:** Do not rewrite frontend to Next.js for v1 SaaS; keep static deploy on Hetzner with `base: "/"`

Related: [Database Schema Plan](./DATABASE_SCHEMA_PLAN.md), [Local-First to Cloud Migration](./LOCAL_FIRST_TO_CLOUD_MIGRATION.md), [Auth Plan](./AUTH_WORKSPACE_BILLING_PLAN.md)

---

## Executive Summary

**Recommendation: Supabase (PostgreSQL + Auth + Row Level Security) as the first SaaS backend path**, with optional custom Edge Functions or a small Node service later for Stripe webhooks and heavy export jobs.

The existing `StorageProvider` abstraction in `src/utils/storageProvider.ts` is the primary integration seam. Phase 3 adds a `SupabaseStorageProvider` (or hybrid local+cloud provider) without rewriting feature modules.

---

## Current Frontend Persistence Layer

```txt
Features / Hooks
    ↓
useLocalStorage, useProjects, useTasks, useHierarchy
    ↓
storage.ts (read/write/migrate)
    ↓
StorageProvider interface ← setStorageProvider()
    ↓
LocalStorageProvider (today)
```

Future:

```txt
HybridStorageProvider
  ├── LocalStorageProvider (offline cache, default)
  └── SupabaseStorageProvider (sync when authenticated)
```

---

## Option Comparison

### 1. Supabase (PostgreSQL + Auth + RLS + Realtime optional)

| Aspect | Assessment |
|--------|------------|
| **Pros** | Postgres fits hierarchy; Auth built-in; RLS for multi-tenant GDPR; EU (Frankfurt) region; good TS client; solo-friendly; Stripe guides exist |
| **Cons** | Vendor lock-in on Auth/RLS patterns; complex RLS debugging; realtime costs at scale |
| **Cost / complexity** | Free tier for dev; ~€25+/mo at small production; **low ops** |
| **Migration difficulty** | **Medium** — map normalized entities to tables; backup JSON import script |
| **Fit for this project** | **Excellent** — relational hierarchy, workspace model, German/EU hosting |
| **Security / GDPR** | EU region; DPA available; RLS enforces tenant isolation; audit via Postgres triggers |
| **Recommendation** | **Primary choice for Phase 2–5** |

### 2. Firebase (Firestore + Auth)

| Aspect | Assessment |
|--------|------------|
| **Pros** | Fast auth; offline sync SDK; generous free tier |
| **Cons** | Document model fights deep hierarchy; complex queries expensive; Google/US data concerns for DE users; backup/export harder |
| **Cost / complexity** | Low start; unpredictable at query scale |
| **Migration difficulty** | **High** — denormalize or mirror hierarchy awkwardly |
| **Fit** | Poor for Project→Area→…→Task tree |
| **Security / GDPR** | EU locations exist but US parent; less transparent RLS than Postgres |
| **Recommendation** | **Not recommended** for this product |

### 3. Custom Node/Express or NestJS + PostgreSQL

| Aspect | Assessment |
|--------|------------|
| **Pros** | Full control; custom sync logic; any hosting (Hetzner VPS) |
| **Cons** | Solo dev must build auth, RLS equivalent, migrations, monitoring, backups |
| **Cost / complexity** | VPS ~€5–20/mo + **high dev time** |
| **Migration difficulty** | Medium data; **high** infra |
| **Fit** | Good long-term if Supabase limits hit |
| **Security / GDPR** | Full responsibility on developer |
| **Recommendation** | **Phase 6+ escape hatch**, not first path |

### 4. Next.js Full-Stack Migration

| Aspect | Assessment |
|--------|------------|
| **Pros** | SSR, API routes, one repo |
| **Cons** | Rewrites deployment, routing, i18n, static Hetzner setup; massive scope |
| **Cost / complexity** | **Very high** for solo dev |
| **Migration difficulty** | **Very high** |
| **Fit** | Poor — app is already a polished Vite SPA |
| **Recommendation** | **Reject** for SaaS v1 |

### 5. BaaS First, Custom Backend Later

| Aspect | Assessment |
|--------|------------|
| **Pros** | Ship sync + auth fast; extract webhook/billing service when needed |
| **Cons** | Two systems to maintain during transition |
| **Cost / complexity** | Staged |
| **Migration difficulty** | Low now; medium later |
| **Fit** | **Best pragmatic path** for solo developer |
| **Recommendation** | **Adopt** — Supabase now; small Hetzner/Edge worker for Stripe webhooks in Phase 5 |

---

## Clear Recommendation

| Phase | Backend |
|-------|---------|
| 0–1 | None (localStorage only) |
| 2–4 | **Supabase EU** — Auth, Postgres, RLS, optional Realtime for activity |
| 5 | Supabase + **Stripe** via Supabase Edge Function or Hetzner cron webhook receiver |
| 6+ | Evaluate custom API if sync/query limits or compliance require Hetzner-only DB |

**Why not Firebase:** Hierarchy and GDPR favor Postgres.  
**Why not custom first:** Solo capacity; Supabase covers 80% of SaaS plumbing.  
**Why not Next.js:** Unnecessary rewrite; conflicts with current Hetzner static deploy.

---

## Supabase Project Structure (planned)

```txt
supabase/
  migrations/          SQL schema from DATABASE_SCHEMA_PLAN.md
  seed.sql             Dev workspace + demo data
  functions/
    stripe-webhook/    Phase 5
    export-job/        Large JSON export async
```

Frontend env (`.env.example` — never commit secrets):

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Server-only:

```env
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
```

---

## Migration Strategy (high level)

1. **Schema parity** — Postgres tables mirror local entities (see DATABASE_SCHEMA_PLAN.md).
2. **Import script** — Extend `validateBackupSnapshot()` → bulk insert with `workspace_id`.
3. **Dual-write period** — Optional: write local + cloud during beta.
4. **Sync adapter** — `CloudStorageProvider` reads/writes Supabase; local cache for offline.
5. **Cutover** — User chooses “cloud is source of truth”; local becomes cache.

Details: [LOCAL_FIRST_TO_CLOUD_MIGRATION.md](./LOCAL_FIRST_TO_CLOUD_MIGRATION.md)

---

## Part F — API Plan

Supabase primarily uses **PostgREST** (auto REST) + **RPC functions** for complex operations. Below: logical API surface whether implemented as REST, RPC, or Edge Function.

### Auth / session

| Action | Permission | Validation | Rate / security |
|--------|------------|------------|-----------------|
| `auth.signInWithOtp(email)` | Public | Valid email, captcha optional | 5/hour per IP |
| `auth.signInWithOAuth(provider)` | Public | Allowed providers only | Standard OAuth |
| `auth.signOut()` | Authenticated | Valid session | — |
| `auth.getSession()` | Authenticated | JWT not expired | Refresh rotation |
| `profiles.get` / `profiles.update` | Self | Display name length, locale enum | — |

### Workspace CRUD

| Action | Permission | Validation | Rate / security |
|--------|------------|------------|-----------------|
| `workspaces.list` | Member | RLS: member row exists | — |
| `workspaces.create` | Authenticated | Name 1–100 chars; slug unique | 10/day/user |
| `workspaces.get` | Member | `workspace_id` | — |
| `workspaces.update` | Admin+ | Name, settings JSON schema | — |
| `workspaces.delete` | Owner | Confirm token; export flag | Soft-delete 30d |

### Project CRUD

| Action | Permission | Validation | Rate / security |
|--------|------------|------------|-----------------|
| `projects.list(workspace_id)` | Member | Workspace scope | — |
| `projects.create` | Member+ | Tier project limit; template id optional | — |
| `projects.update` | Member+ | Cannot rename system inbox slug | — |
| `projects.delete` | Member+ | Strategy: move_to_inbox \| delete_tasks | Matches Agent 09 UX |

### Hierarchy CRUD

| Action | Permission | Validation | Rate / security |
|--------|------------|------------|-----------------|
| `areas|phases|milestones|epics|task_groups.*` | Member+ | Parent belongs to same project | Batch limit 100 |
| Reorder | Member+ | `order` integer; same parent | Optimistic concurrency via `updated_at` |

### Task CRUD

| Action | Permission | Validation | Rate / security |
|--------|------------|------------|-----------------|
| `tasks.list` | Member | Filters via query params | Paginate 500 max |
| `tasks.create` | Member+ | Title required; score computed server-side | — |
| `tasks.update` | Member+ | Hierarchy refs validated RPC | Version check |
| `tasks.delete` | Member+ | Soft-delete optional | — |
| `tasks.bulkMove` | Member+ | Target project in workspace | Inbox fallback |

### Checklist CRUD

| Action | Permission | Validation | Rate / security |
|--------|------------|------------|-----------------|
| `checklist_items.*` | Member+ | `task_id` in workspace | — |

### Comments / activity

| Action | Permission | Validation | Rate / security |
|--------|------------|------------|-----------------|
| `task_comments.create` | Member+ | Body max 10k | Phase 4 |
| `task_activity.list` | Member | Task scope | Read-only audit |

### Saved views

| Action | Permission | Validation | Rate / security |
|--------|------------|------------|-----------------|
| `saved_views.*` | Member+ | JSON filter schema | Max 20/user |

### Backup / export / import

| Action | Permission | Validation | Rate / security |
|--------|------------|------------|-----------------|
| `export.workspaceJson` | Member | Same shape as `AppDataSnapshot` + meta | 5/day; async if >10MB |
| `import.workspaceJson` | Admin+ | `validateBackupSnapshot` server-side | Dry-run preview RPC |
| `exports.list` | Member | Own exports | Signed URL 1h TTL |

### Subscription / customer portal

| Action | Permission | Validation | Rate / security |
|--------|------------|------------|-----------------|
| `billing.createCheckoutSession` | Owner | Price ID from env | Stripe-hosted |
| `billing.createPortalSession` | Owner | Active customer | Stripe-hosted |
| `billing.webhook` | Stripe signature | Idempotent event ids | Service role only |

### Sync (Phase 3)

| Action | Permission | Validation | Rate / security |
|--------|------------|------------|-----------------|
| `sync.push(changes[])` | Member+ | Entity type enum; LWW or version vector | 1000 ops/request |
| `sync.pull(since)` | Member | Cursor token | — |
| `sync.resolveConflict` | Member+ | User picks local vs remote | Audit log |

---

## Infrastructure Diagram (target)

```txt
┌─────────────────────────────────────────────────────────┐
│  Browser (React/Vite SPA)                               │
│  todolist.codingplugs.de                                │
│  LocalStorageProvider + CloudStorageProvider (future)   │
└───────────────┬─────────────────────┬───────────────────┘
                │ HTTPS               │ HTTPS
                ▼                     ▼
┌───────────────────────┐   ┌─────────────────────────────┐
│  Hetzner Webhosting   │   │  Supabase EU (Frankfurt)    │
│  Static dist/         │   │  Postgres + Auth + RLS      │
│  .htaccess SPA        │   │  Edge Functions (webhooks)  │
└───────────────────────┘   └──────────────┬──────────────┘
                                             │
                                             ▼
                                ┌─────────────────────────────┐
                                │  Stripe (EU customer billing)│
                                └─────────────────────────────┘
```

---

## Open Technical Decisions

1. Realtime vs poll for sync (recommend poll + manual refresh first).
2. Soft-delete vs hard-delete for tasks (recommend soft-delete with 30-day purge).
3. Edge Functions on Supabase vs webhook on Hetzner VPS.
4. IndexedDB local cache before cloud sync (optional Phase 3 enhancement).

---

*Agent 07 — planning only. No backend code implemented.*
