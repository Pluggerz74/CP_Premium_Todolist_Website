# Agent 07 — Prompt Report

**Agent:** Agent 07 (SaaS Migration Roadmap & Backend Architecture)  
**Project:** High Value Todo  
**Project root:** `C:\Users\lucak\Desktop\TodoListe\TodoListe`  
**Git root:** `C:\Users\lucak\Desktop\TodoListe`  
**Prompt executed:** `prompts/07-future-saas-migration.md` (Agent 07 mission)  
**Behavior rules followed:** `prompts/cursor-rule-update-senior-fullstack-behavior.md`  
**Planning source:** `docs/MEGA_TODO_PLANNING.md`  
**Date:** 2026-06-02  
**Status:** Complete — documentation only; no runtime code changed

---

## 1. Reports Read Before Planning

All files in `Agent-Promptreport/` were read completely:

| Report | Present |
|--------|---------|
| AGENT-01-REPORT.md | ✅ |
| AGENT-02-REPORT.md | ✅ |
| AGENT-03-REPORT.md | ✅ |
| AGENT-04-REPORT.md | ✅ |
| AGENT-05-REPORT.md | ✅ |
| AGENT-05B-REPORT.md | ✅ |
| AGENT-06-REPORT.md | ✅ |
| AGENT-08-REPORT.md | ✅ |
| AGENT-08B-REPORT.md | ✅ |
| AGENT-08C-REPORT.md | ✅ |
| AGENT-08D-REPORT.md | ✅ |
| AGENT-09-REPORT.md | ✅ |
| AGENT-09B-REPORT.md | ✅ |
| AGENT-07-REPORT.md | Created by this agent |

No AGENT-07 report existed previously (expected). No conflicts between agent reports; Agent 05B supersedes Agent 05/06 on Vite `base: "/"`.

---

## 2. SaaS Roadmap Summary

Created `docs/SAAS_ROADMAP.md` with:

- Product positioning: simple daily todos + massive project planning
- Target users (solo, indie game dev, SaaS founder, teams)
- Local-first default vs optional cloud SaaS
- Pricing tiers: Free, Pro, Team, Studio/Agency
- What stays local vs cloud-synced vs deferred
- GDPR/security engineering checklist (Part G)
- Phased roadmap Phase 0–6 (Part H)
- Next-agent sequence Agents 10–15 (Part I)

---

## 3. Backend Recommendation

**Primary path: Supabase (PostgreSQL + Auth + Row Level Security) in EU region (Frankfurt).**

| Option | Verdict |
|--------|---------|
| Supabase | ✅ Recommended first SaaS backend |
| Firebase | ❌ Poor fit for hierarchy + GDPR |
| Custom NestJS + Postgres | ⏳ Phase 6+ escape hatch |
| Next.js full-stack rewrite | ❌ Rejected |
| BaaS first, custom later | ✅ Adopted strategy |

Rationale: solo developer capacity, relational hierarchy, existing `StorageProvider` seam, backup/import parity, EU hosting, RLS for workspaces, Stripe via Edge Functions in Phase 5.

Documented in `docs/BACKEND_MIGRATION_PLAN.md` with infrastructure diagram and full API plan (Part F).

---

## 4. Database Schema Planning Summary

Created `docs/DATABASE_SCHEMA_PLAN.md` covering all requested entities:

- users/profiles, workspaces, workspace_members
- projects (+ system inbox flag)
- Full hierarchy: areas → phases → milestones → epics → task_groups
- tasks, checklist_items, task_comments, task_activity, task_dependencies
- tags, task_tags, saved_views, user_settings, workspace_settings
- imports, exports, billing_customers, subscriptions, audit_logs

Each entity includes purpose, key fields, indexes, relationships, deletion behavior, and privacy notes. Maps localStorage collections to Postgres. Preserves Agent 09 inbox and delete semantics.

---

## 5. Auth / Workspace / Billing Planning Summary

Created `docs/AUTH_WORKSPACE_BILLING_PLAN.md`:

- Magic link + OAuth auth (no passwords initially)
- Personal and team workspaces
- Roles: owner, admin, member, viewer
- RLS permission matrix
- Team invites (Phase 4)
- Stripe billing tiers (Phase 5) — plan only, not implemented
- Account deletion, data export, GDPR engineering requirements

---

## 6. Local-First to Cloud Migration Summary

Created `docs/LOCAL_FIRST_TO_CLOUD_MIGRATION.md`:

- Current localStorage keys and `STORAGE_VERSION = 2`
- `StorageProvider` → `HybridStorageProvider` + `SupabaseStorageProvider` plan
- Export/import via `AppDataSnapshot` extension
- Post-login local data detection
- User choices: keep local, upload, merge, replace
- LWW conflict handling + future conflict UI
- Offline queue, sync strategy, rollback, mandatory backup before migration

---

## 7. Security / GDPR Considerations

Documented across `SAAS_ROADMAP.md` (checklist) and `AUTH_WORKSPACE_BILLING_PLAN.md`:

- EU Supabase region + Hetzner DE static hosting
- RLS tenant isolation
- Minimal data collection
- Export before delete
- Audit logs, encryption in transit, secrets management
- Privacy policy / ToS requirements before cloud launch (engineering notes only, not legal advice)

---

## 8. Files Changed

### Created

```txt
docs/SAAS_ROADMAP.md
docs/BACKEND_MIGRATION_PLAN.md
docs/DATABASE_SCHEMA_PLAN.md
docs/AUTH_WORKSPACE_BILLING_PLAN.md
docs/LOCAL_FIRST_TO_CLOUD_MIGRATION.md
Agent-Promptreport/AGENT-07-REPORT.md
```

### Updated

```txt
docs/FUTURE_SAAS_ROADMAP.md   (pointer to new docs)
README.md                     (short SaaS roadmap section)
```

### Not changed

- No `src/` application code
- No `vite.config.ts`, `package.json`, or backend scaffolding
- Vite `base: "/"` unchanged

---

## 9. Runtime Code Changed

**No.** Documentation and README pointer only.

---

## 10. Commands Run

```powershell
# Git commit and push only — no npm install/typecheck/build (docs-only change)
git status
git diff
git log
git add ...
git commit ...
git push
```

---

## 11. Typecheck Result

**Not run** — no TypeScript or application code changed.

---

## 12. Build Result

**Not run** — no application code changed.

---

## 13. Remaining Open Decisions

1. Realtime vs poll for sync (recommend poll first).
2. Soft-delete retention period for tasks (recommend 30 days).
3. Stripe webhook: Supabase Edge Function vs Hetzner receiver.
4. Optional IndexedDB cache before cloud sync (Phase 3 enhancement).
5. Exact Free tier cloud limits (projects/tasks).
6. Production smoke test on live subdomain (manual / Agent 10).
7. Legal pages (Impressum, Datenschutz) content — product/legal owner.
8. Update behavior rule file still references `/todolist/` — docs and Agent 05B use `/`; do not revert production config.

---

## 14. Recommended Next Agent or Manual Action

| Priority | Action |
|----------|--------|
| **Manual** | Deploy `dist/` to Hetzner; smoke test https://todolist.codingplugs.de/ (EN + DE) |
| **Agent 10** | Production smoke test & release checklist |
| **Agent 11** | Supabase POC branch plan (schema + RLS SQL only) |
| **Agent 12** | Auth UI planning (mock flows, no backend wiring yet) |

---

## Pre-Execution Summary (Recorded)

### Agent report files found

13 reports: AGENT-01, 02, 03, 04, 05, 05B, 06, 08, 08B, 08C, 08D, 09, 09B. No prior AGENT-07.

### Agent 01

Built v1: Simple + Complex modes, hierarchy, templates, scoring, localStorage, all views, demo data, `MEGA_TODO_PLANNING.md`. Initial Vite base `/todolist/`.

### Agent 02

Git init at parent folder; initial commit `fd693df`; push to `origin/main`.

### Agent 04

StorageProvider, schema v2, TaskIndex, VirtualList, debounced writes, backup utilities, migrations.

### Agent 03

Premium UI polish, design tokens, ranked lists; preserved Agent 04 performance.

### Agent 06

Metadata UI system (TaskMetadata, ScoreBreakdown), dev-only scale test (~1200 tasks).

### Agent 05 / 05B

05: Hetzner prep, `.htaccess`, deployment docs (`/todolist/`). 05B: subdomain root → Vite `base: "/"`, manifest/htaccess updated for `todolist.codingplugs.de`.

### Agent 08 / 08B / 08C / 08D

08: TaskEditForm, QuickAdd, backup import UI, keyboard shortcuts, clickable ranked items. 08B: i18n EN/DE, SimpleBoardPanel, SelectField. 08C: natural German copy. 08D: placeholders, task types, score labels, aria closure.

### Agent 09 / 09B

09: Simple Mode nav simplification, project/list CRUD, Inbox, delete with move-to-inbox. 09B: impact/urgency/effort labels, mobile menu polish, Simple Mode TopBar calm.

### Current product capabilities

Local-first SPA; Simple board + Complex hierarchy; scoring; templates; inline edit; Quick Add; backup import/export; project management; EN/DE i18n; VirtualList; TaskIndex; production config for subdomain root.

### Current technical limitations

localStorage quota; no cloud sync/auth/billing; no automated tests; checklist/dependency UI partial; behavior rule file outdated on Vite base.

### Agent 07 scope

Documentation-only SaaS roadmap and architecture — no backend, auth, DB, billing, or deploy changes.

### Risks before SaaS migration

Data loss on sync; GDPR compliance; solo dev capacity; forced login backlash; hierarchy merge complexity; billing before stable sync.

---

## Agent Compliance Checklist

- [x] Read behavior rules and all Agent reports
- [x] Read `MEGA_TODO_PLANNING.md`
- [x] Pre-execution summary before documentation
- [x] Created all 5 SaaS planning documents
- [x] Backend comparison with clear Supabase recommendation
- [x] Database schema for full hierarchy + workspace model
- [x] Auth/workspace/billing plan (no implementation)
- [x] Local-first migration plan with conflict/rollback
- [x] API plan in BACKEND_MIGRATION_PLAN.md
- [x] GDPR/security checklist
- [x] Phased roadmap + next-agent sequence
- [x] README pointer updated
- [x] No runtime code, dependencies, or Vite base changes
- [x] No typecheck/build (docs only)
- [x] Commit and push from Git root

---

*End of Agent 07 report.*
