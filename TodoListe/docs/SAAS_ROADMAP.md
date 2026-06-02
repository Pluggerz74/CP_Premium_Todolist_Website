# High Value Todo — SaaS Roadmap

**Status:** Planning document (Agent 07)  
**Product:** High Value Todo — premium Apple-like project command center  
**Current state:** Local-first SPA; production target [https://todolist.codingplugs.de/](https://todolist.codingplugs.de/) (domain offline until Hetzner billing/DNS is active — local release QA complete per Agent 10A)  
**Vite base:** `/` (subdomain root — do not revert to `/todolist/`)

This document is the product and phased roadmap source of truth for evolving from a private local-first tool into an optional cloud SaaS without abandoning offline-first value.

Related docs:

- [Backend Migration Plan](./BACKEND_MIGRATION_PLAN.md)
- [Database Schema Plan](./DATABASE_SCHEMA_PLAN.md)
- [Auth, Workspace & Billing Plan](./AUTH_WORKSPACE_BILLING_PLAN.md)
- [Local-First to Cloud Migration](./LOCAL_FIRST_TO_CLOUD_MIGRATION.md)
- [Architecture](./ARCHITECTURE.md)
- [Mega Planning](./MEGA_TODO_PLANNING.md)

---

## Part A — SaaS Product Strategy

### 1. Product positioning

**Simple enough for daily todos. Powerful enough for massive project planning.**

High Value Todo is not another flat checklist. It is a calm, premium **project command center** that helps individuals and small teams identify the highest-value next action across everyday tasks and complex multi-level plans (games, SaaS products, websites, content pipelines).

Core differentiator:

```txt
highValueScore = impact + urgency - effort
```

The product should always feel:

- Apple-like, minimal, spacious, calm
- Local-first by default (privacy, speed, no account required)
- SaaS-ready when the user chooses sync, backup, or collaboration

### 2. Target users

| Segment | Need | Mode |
|---------|------|------|
| Solo knowledge workers | Daily todos + occasional projects | Simple |
| Indie game developers | 20+ area game plans, milestones, epics | Complex |
| Solo SaaS founders | Product/engineering/growth breakdown | Complex |
| Freelancers / agencies | Multiple client projects, lists | Simple + Complex |
| Small teams (future) | Shared workspace, comments, roles | Complex + Team tier |

Primary launch geography: **Germany / EU** (German UI already shipped; GDPR sensitivity is a design constraint).

### 3. Initial private / local-first version (now)

What exists today (Phase 0):

- Simple Mode: board sections (Inbox, Overdue, Today, Upcoming, Later, Done)
- Complex Mode: full hierarchy (Project → Area → Phase → Milestone → Epic → Task Group → Task → Checklist)
- localStorage persistence behind `StorageProvider`
- Schema versioning (`STORAGE_VERSION = 2`), migrations, backup export/import
- TaskIndex, VirtualList, inline edit, Quick Add, project/list management, system Inbox
- English / German i18n
- Static deployment on Hetzner subdomain

**No account required.** This remains the default experience indefinitely.

### 4. Future SaaS version

Optional cloud layer added **on top of** local-first architecture:

- User account (email magic link or OAuth)
- Personal workspace with cloud sync
- Team workspaces with roles
- Server-side backup and cross-device continuity
- Billing for Pro / Team / Studio tiers
- Collaboration (comments, activity) in later phases

Cloud is **opt-in**, not a forced migration.

### 5. Solo user use case

- One person, one workspace (default)
- Sync phone + laptop + work machine
- Keep Simple Mode for groceries and errands; Complex Mode for a game or SaaS launch
- Export JSON anytime; delete account with full data export

### 6. Team / workspace use case

- Owner creates workspace (agency, studio, product team)
- Invite members with roles: owner, admin, member, viewer
- Shared projects within workspace; personal projects remain private (future)
- Activity log and comments on tasks (Phase 4+)
- Billing at workspace level for Team / Studio tiers

### 7. Game development project planning use case

- Game Development template: 20 default areas (Game Design, Core Gameplay, … Post Launch)
- Hierarchy mirrors production pipeline: areas → phases → milestones → epics → task groups → tasks
- High Value ranking across entire game scope
- Future: shared workspace for art/design/engineering leads

### 8. Software / SaaS project planning use case

- SaaS Product template: Product, Engineering, Design, Growth areas
- Track launch milestones, epics, backlog
- Score-driven focus for solo founders deciding what to build next
- Future: link tasks to releases, integrations (GitHub, Linear) — not in early SaaS phases

### 9. Pricing model ideas

| Tier | Audience | Price idea (EUR) |
|------|----------|------------------|
| **Free** | Personal local + limited cloud | €0 |
| **Pro** | Power solo user, full sync | €6–9 / month |
| **Team** | Small teams, collaboration | €12–18 / seat / month |
| **Studio / Agency** | Multiple workspaces, admin | €29–49 / month base + seats |

Annual discount (~20%) recommended. EU VAT handled via Stripe Tax.

### 10. Free tier vs paid tier ideas

**Free (always available locally; cloud limits TBD):**

- Unlimited local projects/tasks (browser quota applies)
- Simple + Complex modes
- Export/import JSON
- Demo templates
- Optional account with 1 workspace, 3 projects cloud-synced, 500 tasks

**Pro:**

- Unlimited cloud sync for solo workspace
- Full backup history (30 days)
- Priority support
- Advanced saved views (future)

**Team:**

- Shared workspace
- Comments + activity
- Role-based access
- Invite flow

**Studio / Agency:**

- Multiple workspaces
- Admin audit logs
- Higher API/sync limits
- Custom branding (future)

### 11. What should remain local-first

- Default app load without login
- All task editing UX (optimistic UI)
- High Value Score calculation (client-side; server validates)
- Simple Mode daily workflow
- Export to JSON (always available, even offline)
- Theme, language, density preferences (cached locally)
- Offline read/write queue when sync is enabled later

### 12. What should become cloud-synced (when user opts in)

- Projects, hierarchy nodes, tasks, checklist items
- Tags, saved views, workspace settings
- User profile and workspace membership
- Backup snapshots (server-side)
- Comments and activity (Phase 4+)
- Subscription state (Stripe → DB, not client)

### 13. What should not be built yet

Do **not** build before Phase 2 stabilizes:

- Forced login wall
- Real-time multiplayer cursors
- AI prioritization
- Calendar / GitHub / Notion integrations
- Mobile native apps
- Custom NestJS microservices
- Billing before cloud sync works reliably
- Replacing Vite SPA with Next.js rewrite
- Removing local-only mode

---

## Part G — Security, Privacy & GDPR Checklist

Engineering requirements (not legal advice). See also [Auth, Workspace & Billing Plan](./AUTH_WORKSPACE_BILLING_PLAN.md).

| # | Requirement | Notes |
|---|-------------|-------|
| 1 | **Data ownership** | User owns task data; ToS states license only for hosting/sync |
| 2 | **Data deletion** | Account deletion cascades or anonymizes within 30 days |
| 3 | **Data export** | JSON + CSV export; same shape as current backup format extended |
| 4 | **Account deletion** | Self-service in Settings; confirm email; grace period optional |
| 5 | **Workspace deletion** | Owner-only; export offered first |
| 6 | **Passwordless / OAuth** | Magic link + Google/GitHub OAuth; no custom password storage initially |
| 7 | **Row-level security** | Supabase RLS: `workspace_id` on all tenant tables |
| 8 | **Audit logs** | Admin actions, login, export, delete — retain 90 days |
| 9 | **Backups** | Daily DB backups; EU region; test restore quarterly |
| 10 | **Encryption in transit** | TLS 1.2+ everywhere |
| 11 | **Environment variables** | Secrets in host/Supabase dashboard; never in repo |
| 12 | **Secrets management** | Stripe keys server-side only; anon key in frontend with RLS |
| 13 | **Cookie / session security** | HttpOnly, Secure, SameSite=Lax; short-lived JWT + refresh |
| 14 | **Privacy policy** | Required before cloud launch; list processors (Supabase, Stripe, Hetzner) |
| 15 | **Terms of service** | Required before paid tiers |
| 16 | **EU / German hosting** | Supabase EU (Frankfurt); static app on Hetzner DE; DPA with vendors |
| 17 | **Minimal data collection** | Email, display name, usage metadata only; no analytics until consent |

---

## Part H — Phased Implementation Roadmap

### Phase 0 — Current local-first MVP ✅

| | |
|---|---|
| **Goal** | Shippable private productivity app |
| **Features** | Simple + Complex modes, scoring, templates, i18n, backup import/export, project management, Inbox |
| **Technical** | React/Vite SPA, localStorage, StorageProvider, schema v2, TaskIndex, VirtualList |
| **Risks** | localStorage quota; no cross-device sync |
| **Acceptance** | Production build at `todolist.codingplugs.de`; typecheck/build pass |
| **Complexity** | Done |
| **Do not build** | Auth, billing, backend |

### Phase 1 — Stabilize local product & production deployment

| | |
|---|---|
| **Goal** | Reliable production deployment and smoke-tested UX |
| **Features** | Live subdomain, production smoke checklist, optional lint/test scaffold |
| **Technical** | Hetzner upload, `.htaccess`, monitoring uptime, error boundary |
| **Risks** | Stale dist on server; billing/DNS for subdomain |
| **Acceptance** | EN+DE smoke pass on production; backup round-trip verified |
| **Complexity** | Low |
| **Do not build** | Cloud sync, accounts |

### Phase 2 — Optional account system (no forced cloud sync)

| | |
|---|---|
| **Goal** | Users can sign in to reserve identity; local data stays default |
| **Features** | Auth UI, profile, “link this device” prompt, cloud-off toggle |
| **Technical** | Supabase Auth; `CloudStorageProvider` stub; session in memory + refresh cookie |
| **Risks** | Confusing dual mode; premature sync bugs |
| **Acceptance** | Login/logout works; local data untouched until user uploads |
| **Complexity** | Medium |
| **Do not build** | Team invites, billing, realtime |

### Phase 3 — Cloud workspace sync for solo users

| | |
|---|---|
| **Goal** | Reliable solo sync across devices |
| **Features** | Upload local → cloud, merge wizard, conflict UI, offline queue |
| **Technical** | Postgres schema, RLS, sync adapter implementing `StorageProvider`, version vectors |
| **Risks** | Data loss on merge; conflict complexity |
| **Acceptance** | Two browsers stay consistent; rollback to local backup works |
| **Complexity** | High |
| **Do not build** | Comments, team roles, Stripe |

### Phase 4 — Team collaboration

| | |
|---|---|
| **Goal** | Shared workspaces for small teams |
| **Features** | Invites, roles, task comments, activity feed |
| **Technical** | `workspace_members`, RLS policies per role, realtime optional |
| **Risks** | Permission bugs exposing private tasks |
| **Acceptance** | Viewer cannot edit; member cannot delete workspace |
| **Complexity** | High |
| **Do not build** | AI, integrations |

### Phase 5 — Billing & paid plans

| | |
|---|---|
| **Goal** | Monetize Pro / Team / Studio |
| **Features** | Stripe Checkout, Customer Portal, tier limits enforcement |
| **Technical** | Webhooks → `subscriptions` table; feature flags by tier |
| **Risks** | Webhook failures; EU VAT |
| **Acceptance** | Upgrade/downgrade updates entitlements within 1 minute |
| **Complexity** | Medium |
| **Do not build** | Enterprise SSO (defer) |

### Phase 6 — Public SaaS launch

| | |
|---|---|
| **Goal** | Marketing site, onboarding, support, SLA |
| **Features** | Landing page, docs, status page, GDPR pages, email onboarding |
| **Technical** | Production Supabase EU, Stripe live, backup monitoring |
| **Risks** | Support load; scale costs |
| **Acceptance** | New user → account → sync → pay → team invite E2E |
| **Complexity** | Medium–High |
| **Do not build** | Feature creep before stability |

---

## Part I — Recommended Next-Agent Sequence

| Agent / action | Focus |
|----------------|-------|
| **Agent 10** | Production smoke test & release checklist (`docs/RELEASE_CHECKLIST.md`) |
| **Agent 11** | Supabase proof-of-concept branch plan (schema + RLS only, no UI) |
| **Agent 12** | Auth UI planning & mock flows (login, profile, link device) |
| **Agent 13** | Database migration scripts plan (local snapshot → Postgres rows) |
| **Agent 14** | Cloud sync adapter plan (`CloudStorageProvider` + conflict rules) |
| **Agent 15** | Billing integration planning (Stripe products, webhooks, tier gates) |
| **Manual** | Hetzner production deploy + EN/DE smoke on live subdomain |

Agents 10–15 are **documentation or POC plans only** until Phase 2 is approved.

---

## Decision Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| First backend | **Supabase (Postgres + Auth + RLS)** | Solo dev speed, relational model, EU region, RLS for GDPR |
| Keep Vite SPA | Yes | No Next.js rewrite; static front on Hetzner |
| Local-first default | Yes | Preserves private user value; reduces support risk |
| Vite base | `/` | Agent 05B subdomain root — locked |
| Inbox model | System `project-inbox` | Maps to SaaS default catch-all project per workspace |

---

*Document created by Agent 07. Do not implement backend code from this doc without a dedicated implementation agent.*
