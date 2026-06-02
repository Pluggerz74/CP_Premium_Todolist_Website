# Auth, Workspace & Billing Plan

**Status:** Planning only (Agent 07) — no auth or billing code implemented  
**Backend target:** Supabase Auth + Stripe  
**Locale:** English / German UI; EU/German privacy expectations

Related: [SaaS Roadmap](./SAAS_ROADMAP.md), [Database Schema](./DATABASE_SCHEMA_PLAN.md), [Backend Migration](./BACKEND_MIGRATION_PLAN.md)

---

## 1. Authentication

### Recommended methods (Phase 2)

| Method | Priority | Notes |
|--------|----------|-------|
| **Magic link (email OTP)** | Primary | No password storage; GDPR-friendly |
| **Google OAuth** | Secondary | Common for solo devs |
| **GitHub OAuth** | Optional | Fits developer audience |
| Email + password | Defer | Increases security burden |

### Flow

1. User clicks “Sign in” in Settings (optional; app works without).
2. Enter email → Supabase sends magic link.
3. Callback sets session; create `profiles` row on first login.
4. Default personal workspace created: `{name}’s Workspace`.

### Session handling

- JWT in memory; refresh via HttpOnly cookie (Supabase SSR pattern or `@supabase/supabase-js` persistSession).
- Session timeout: 7 days refresh; re-auth for destructive actions (delete workspace, export all).

### Security

- PKCE for OAuth
- Rate limit auth endpoints
- No auth secrets in frontend except anon key (RLS protects data)

---

## 2. User Profiles

| Field | Source | Sync |
|-------|--------|------|
| `display_name` | User input | Cloud + local cache |
| `locale` | `en` / `de` | Merge with local `AppSettings.language` on link |
| `avatar_url` | Optional upload (Supabase Storage) | Cloud |
| `timezone` | Browser default | Cloud |

Profile page in Settings: edit name, language, delete account link.

---

## 3. Workspaces

### Types

| Type | Description |
|------|-------------|
| **Personal** | Auto-created on signup; default for solo sync |
| **Team** | Created explicitly; invites enabled (Phase 4) |
| **Agency / Studio** | Multiple workspaces under one billing account (Phase 5+) |

### Limits by tier (draft)

| Tier | Workspaces | Members | Cloud projects | Cloud tasks |
|------|------------|---------|----------------|-------------|
| Free | 1 | 1 | 3 | 500 |
| Pro | 1 | 1 | Unlimited | Unlimited |
| Team | 1 | 25 | Unlimited | Unlimited |
| Studio | 5 | 100 | Unlimited | Unlimited |

Local-only usage ignores cloud limits.

---

## 4. Workspace Roles

| Role | Projects | Tasks | Settings | Members | Billing |
|------|----------|-------|----------|---------|---------|
| **owner** | CRUD | CRUD | CRUD | CRUD | Yes |
| **admin** | CRUD | CRUD | CRUD | Invite/manage | No |
| **member** | CRUD | CRUD | Read | — | No |
| **viewer** | Read | Read | — | — | No |

Enforced via Supabase RLS policies on `workspace_members.role`.

---

## 5. Permissions Model

```txt
auth.uid() → workspace_members → role → policy
```

Example policies:

- `tasks_select`: member of workspace with any role
- `tasks_insert/update/delete`: role IN (owner, admin, member)
- `workspace_delete`: role = owner
- `billing_*`: role = owner

System inbox project: delete/rename blocked for all roles (matches local `isInboxProject`).

---

## 6. Team Invites (Phase 4)

1. Admin enters email → `workspace_invites` row + email (Resend/Supabase).
2. Token link expires in 7 days.
3. Accept → insert `workspace_members`.
4. Pending invites list in Settings.

Table `workspace_invites`: `id`, `workspace_id`, `email`, `role`, `token_hash`, `expires_at`.

---

## 7. Billing

### Provider

**Stripe** (Checkout + Customer Portal + Webhooks).

### Products (draft)

| Stripe Product | Tier | Billing |
|----------------|------|---------|
| `hvt_pro_monthly` | Pro | Monthly EUR |
| `hvt_pro_yearly` | Pro | Yearly EUR |
| `hvt_team_seat_monthly` | Team | Per seat |
| `hvt_studio_monthly` | Studio | Base + seats |

### Webhook events

- `checkout.session.completed` → create/update `subscriptions`
- `customer.subscription.updated/deleted` → sync `plan_tier`
- `invoice.payment_failed` → email owner; grace period 7 days

### Implementation location

Supabase Edge Function `stripe-webhook` with service role — **not** in Vite bundle.

### Feature gating

```txt
workspace.plan_tier → feature flags in app config
```

Examples: cloud project count, member invites, export frequency.

**Do not implement billing until Phase 5** after sync is stable.

---

## 8. Subscription Tiers Summary

| Tier | For | Highlights |
|------|-----|------------|
| **Free** | Try cloud sync | 1 workspace, limits, community support |
| **Pro** | Power solo | Full sync, backup history, priority email |
| **Team** | Small teams | Invites, comments, activity |
| **Studio / Agency** | Multi-client | Multiple workspaces, audit logs, SLA email |

---

## 9. SaaS Admin Area

Minimal admin (owner-only inside app first; separate admin app deferred):

- Workspace members list
- Usage stats (task count, storage)
- Billing portal link
- Audit log viewer (Studio tier)
- Export all data

Future: internal admin dashboard on separate subdomain with service role (not in Phase 2–3).

---

## 10. Account Deletion

Self-service flow:

1. Settings → Account → Delete account
2. Warning + export offer
3. Type email to confirm
4. Server: delete auth user, cascade profile, remove memberships
5. Owned workspaces: transfer or delete (prompt)
6. Stripe: cancel subscriptions
7. Audit log entry (anonymized user id)

Retention: soft-delete 30 days for recovery (optional); then hard purge.

---

## 11. Data Export (GDPR Art. 20)

| Export type | Format | Scope |
|-------------|--------|-------|
| Workspace export | JSON (extend `AppDataSnapshot`) | All projects, tasks, hierarchy |
| Account export | JSON + CSV tasks | All workspaces user belongs to |
| Billing history | Stripe portal | Invoices |

Export must work **before** account deletion. Same validation as `validateBackupSnapshot()`.

---

## 12. GDPR / Privacy Requirements (Engineering)

Not legal advice — product requirements for engineering and product copy.

| Requirement | Implementation |
|-------------|----------------|
| Lawful basis | Contract for paid; legitimate interest / consent for optional analytics |
| Data minimization | Email, name, task content only; no unnecessary tracking |
| Processor list | Supabase, Stripe, Hetzner, email provider — documented in Privacy Policy |
| DPA | Sign Supabase + Stripe DPAs |
| EU storage | Supabase region `eu-central-1`; static assets Hetzner DE |
| Right to access | Profile + export |
| Right to erasure | Account deletion flow |
| Right to portability | JSON export |
| Breach notification | Process doc for 72h assessment |
| Cookie banner | Only if non-essential cookies added (analytics) |
| Impressum / Datenschutz | Required for German public SaaS (product pages) |

---

## Security Checklist (Auth & Billing)

- [ ] RLS enabled on all public tables
- [ ] Service role key never in frontend
- [ ] Stripe webhook signature verification
- [ ] Idempotent webhook handling
- [ ] CSRF protection on OAuth callback
- [ ] Rate limits on login and export
- [ ] Audit log for admin actions
- [ ] Encrypt exports at rest in Storage bucket
- [ ] Session invalidation on password/email change

---

## Phase Alignment

| Phase | Auth / workspace / billing scope |
|-------|----------------------------------|
| 0–1 | None |
| 2 | Auth + profile + personal workspace shell |
| 3 | Sync tied to workspace |
| 4 | Invites + roles + comments |
| 5 | Stripe tiers |
| 6 | Public launch + legal pages |

---

*Agent 07 — planning only.*
