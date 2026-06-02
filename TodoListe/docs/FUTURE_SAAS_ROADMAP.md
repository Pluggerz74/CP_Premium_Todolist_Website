# Future SaaS Roadmap (Legacy Summary)

> **This file is superseded by the comprehensive SaaS documentation set created in Agent 07.**

Please use these documents as the source of truth:

| Document | Contents |
|----------|----------|
| [SAAS_ROADMAP.md](./SAAS_ROADMAP.md) | Product strategy, phases, GDPR checklist, next agents |
| [BACKEND_MIGRATION_PLAN.md](./BACKEND_MIGRATION_PLAN.md) | Backend comparison, Supabase recommendation, API plan |
| [DATABASE_SCHEMA_PLAN.md](./DATABASE_SCHEMA_PLAN.md) | Postgres entities, indexes, RLS notes |
| [AUTH_WORKSPACE_BILLING_PLAN.md](./AUTH_WORKSPACE_BILLING_PLAN.md) | Auth, roles, Stripe tiers, account deletion |
| [LOCAL_FIRST_TO_CLOUD_MIGRATION.md](./LOCAL_FIRST_TO_CLOUD_MIGRATION.md) | localStorage → cloud sync, conflicts, rollback |

## Quick phase overview

1. **Phase 0–1** — Local-first MVP + production deploy (current)
2. **Phase 2** — Optional accounts
3. **Phase 3** — Solo cloud sync
4. **Phase 4** — Team collaboration
5. **Phase 5** — Billing
6. **Phase 6** — Public SaaS launch

**Backend recommendation:** Supabase (PostgreSQL + Auth + RLS) in EU region first.
