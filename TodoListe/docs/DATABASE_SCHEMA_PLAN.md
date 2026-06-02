# Database Schema Plan

**Status:** SaaS-ready data model (Agent 07)  
**Target DB:** PostgreSQL (Supabase EU)  
**Source model:** Normalized localStorage collections in `src/types/` and `storageKeys`

Hierarchy preserved:

```txt
Workspace
  └── Project
        └── Area
              └── Phase
                    └── Milestone
                          └── Epic
                                └── Task Group
                                      └── Task
                                            └── Checklist Item
```

Simple Mode maps to **projects** (lists) with flat **tasks** (no hierarchy IDs required).  
System **Inbox** maps to `projects.is_system_inbox = true` per workspace (see `project-inbox` in app).

---

## Conventions

| Convention | Value |
|------------|-------|
| Primary keys | `uuid` (`gen_random_uuid()`) |
| Timestamps | `timestamptz` UTC; `created_at`, `updated_at` |
| Soft delete | `deleted_at` nullable on user content tables |
| Tenant key | `workspace_id` on all workspace-scoped rows |
| RLS | Every table filtered by `workspace_id` via membership |
| Score | `high_value_score` computed: `impact + urgency - effort` (CHECK or generated column) |

---

## Entity Reference

### users

| | |
|---|---|
| **Purpose** | Auth identity (Supabase `auth.users`); app profile extension in `profiles` |
| **Key fields** | `id` (uuid, FK auth.users), `email`, `created_at` |
| **Indexes** | PK on `id` |
| **Relationships** | 1:1 `profiles`; 1:N `workspace_members` |
| **Deletion** | Cascade to profile; anonymize email in audit; reassign or delete owned workspaces |
| **Privacy** | Email PII; minimize exposure in logs |

*Note: Use Supabase Auth table; app table `profiles` extends it.*

---

### profiles

| | |
|---|---|
| **Purpose** | Display name, locale, avatar, preferences |
| **Key fields** | `user_id` PK/FK, `display_name`, `locale` (`en`\|`de`), `avatar_url`, `timezone`, `updated_at` |
| **Indexes** | PK `user_id` |
| **Relationships** | FK `user_id` → auth.users |
| **Deletion** | CASCADE with user |
| **Privacy** | Public within workspace member list only |

---

### workspaces

| | |
|---|---|
| **Purpose** | Tenant boundary for sync and billing |
| **Key fields** | `id`, `name`, `slug`, `owner_user_id`, `plan_tier` (`free`\|`pro`\|`team`\|`studio`), `settings` jsonb, `created_at`, `deleted_at` |
| **Indexes** | UNIQUE(`slug`); INDEX(`owner_user_id`) |
| **Relationships** | 1:N projects, members, settings, subscriptions |
| **Deletion** | Soft-delete; hard purge after 30 days; export required UX |
| **Privacy** | Name may contain client names (agency tier) |

---

### workspace_members

| | |
|---|---|
| **Purpose** | Membership and role |
| **Key fields** | `workspace_id`, `user_id`, `role` (`owner`\|`admin`\|`member`\|`viewer`), `invited_at`, `joined_at` |
| **Indexes** | UNIQUE(`workspace_id`, `user_id`); INDEX(`user_id`) |
| **Relationships** | FK workspace, user |
| **Deletion** | CASCADE with workspace or user leave |
| **Privacy** | Role visible to workspace members |

**RLS:** Viewer = SELECT only; Member = CRUD tasks/projects; Admin = + invites/settings; Owner = + billing/delete workspace.

---

### projects

| | |
|---|---|
| **Purpose** | Top-level container (list in Simple Mode, project in Complex) |
| **Key fields** | `id`, `workspace_id`, `title`, `description`, `goal`, `complexity_mode` (`simple`\|`complex`), `template_id`, `color`, `is_archived`, `is_system_inbox`, `order`, `created_at`, `updated_at`, `deleted_at` |
| **Indexes** | INDEX(`workspace_id`, `order`); PARTIAL UNIQUE(`workspace_id`) WHERE `is_system_inbox` |
| **Relationships** | FK workspace; 1:N areas (complex), tasks |
| **Deletion** | Agent 09 parity: move tasks to inbox project OR delete tasks (RPC) |
| **Privacy** | Workspace-scoped |

Maps from local `Project` type + `project-inbox` constant.

---

### project_areas

| | |
|---|---|
| **Purpose** | Game/SaaS area lanes |
| **Key fields** | `id`, `workspace_id`, `project_id`, `title`, `description`, `order`, timestamps |
| **Indexes** | INDEX(`project_id`, `order`) |
| **Relationships** | FK project CASCADE |
| **Deletion** | CASCADE children or block if tasks exist (configurable) |
| **Privacy** | Workspace-scoped |

Local: `hierarchy.areas[]`

---

### phases

| | |
|---|---|
| **Purpose** | Phase under area |
| **Key fields** | `id`, `workspace_id`, `project_id`, `area_id`, `title`, `order`, timestamps |
| **Indexes** | INDEX(`area_id`, `order`) |
| **Relationships** | FK area CASCADE |
| **Deletion** | CASCADE to milestones |

---

### milestones

| | |
|---|---|
| **Purpose** | Milestone under phase |
| **Key fields** | `id`, `workspace_id`, `project_id`, `area_id`, `phase_id`, `title`, `target_date`, `order`, timestamps |
| **Indexes** | INDEX(`phase_id`, `order`); INDEX(`project_id`) |
| **Relationships** | FK phase CASCADE |
| **Deletion** | CASCADE to epics |

---

### epics

| | |
|---|---|
| **Purpose** | Epic / feature under milestone |
| **Key fields** | `id`, `workspace_id`, `project_id`, `area_id`, `phase_id`, `milestone_id`, `title`, `order`, timestamps |
| **Indexes** | INDEX(`milestone_id`, `order`) |
| **Relationships** | FK milestone CASCADE |

---

### task_groups

| | |
|---|---|
| **Purpose** | Group tasks under epic |
| **Key fields** | `id`, `workspace_id`, `project_id`, … hierarchy FKs …, `title`, `order`, timestamps |
| **Indexes** | INDEX(`epic_id`, `order`) |
| **Relationships** | FK epic CASCADE |

---

### tasks

| | |
|---|---|
| **Purpose** | Core work item |
| **Key fields** | `id`, `workspace_id`, `project_id`, `area_id`, `phase_id`, `milestone_id`, `epic_id`, `task_group_id`, `parent_task_id`, `title`, `description`, `status`, `type`, `priority`, `impact`, `urgency`, `effort`, `high_value_score`, `due_date`, `start_date`, `acceptance_criteria`, `notes`, `order`, `completed_at`, timestamps, `deleted_at` |
| **Indexes** | INDEX(`workspace_id`, `project_id`); INDEX(`workspace_id`, `status`); INDEX(`workspace_id`, `high_value_score` DESC); INDEX(`due_date`) WHERE `deleted_at IS NULL`; GIN on `tags` via junction |
| **Relationships** | FK project; optional hierarchy FKs; self FK parent_task |
| **Deletion** | Soft-delete default; hard on “delete tasks too” |
| **Privacy** | Highest volume PII (titles, notes) |

**Server-side score:** `GENERATED ALWAYS AS (impact + urgency - effort) STORED` or trigger on write.

Maps from local `Task` type.

---

### checklist_items

| | |
|---|---|
| **Purpose** | Subtasks / checklist under task |
| **Key fields** | `id`, `workspace_id`, `task_id`, `title`, `is_done`, `order`, timestamps |
| **Indexes** | INDEX(`task_id`, `order`) |
| **Relationships** | FK task CASCADE |
| **Deletion** | CASCADE with task |

Local: `hierarchy.checklistItems[]` or embedded — normalize to table.

---

### task_comments

| | |
|---|---|
| **Purpose** | Collaboration comments (Phase 4) |
| **Key fields** | `id`, `workspace_id`, `task_id`, `user_id`, `body`, `created_at`, `updated_at`, `deleted_at` |
| **Indexes** | INDEX(`task_id`, `created_at`) |
| **Relationships** | FK task, user |
| **Deletion** | Soft-delete |
| **Privacy** | User attribution required |

---

### task_activity

| | |
|---|---|
| **Purpose** | Audit trail of task changes |
| **Key fields** | `id`, `workspace_id`, `task_id`, `actor_user_id`, `action`, `payload` jsonb, `created_at` |
| **Indexes** | INDEX(`task_id`, `created_at` DESC) |
| **Relationships** | FK task |
| **Deletion** | Retain 90 days then archive |
| **Privacy** | No sensitive payload in logs |

---

### task_dependencies

| | |
|---|---|
| **Purpose** | Task blocking relationships |
| **Key fields** | `id`, `workspace_id`, `task_id`, `depends_on_task_id`, `type` (`blocks`\|`relates`) |
| **Indexes** | UNIQUE(`task_id`, `depends_on_task_id`); INDEX(`depends_on_task_id`) |
| **Relationships** | FK tasks; cycle detection in RPC |
| **Deletion** | CASCADE |

Local: `task.dependencies`, `task.blockedBy` arrays → normalized rows.

---

### tags

| | |
|---|---|
| **Purpose** | Workspace-scoped tag dictionary |
| **Key fields** | `id`, `workspace_id`, `name`, `color`, `created_at` |
| **Indexes** | UNIQUE(`workspace_id`, lower(`name`)) |
| **Relationships** | N:M tasks via `task_tags` |
| **Deletion** | CASCADE junction |

---

### task_tags

| | |
|---|---|
| **Purpose** | Join tasks ↔ tags |
| **Key fields** | `task_id`, `tag_id`, `workspace_id` |
| **Indexes** | PK (`task_id`, `tag_id`) |
| **Relationships** | FK both |
| **Deletion** | CASCADE |

---

### saved_views

| | |
|---|---|
| **Purpose** | Stored filter presets (High Value, Backlog custom filters) |
| **Key fields** | `id`, `workspace_id`, `user_id`, `name`, `view_key`, `filters` jsonb, `is_default`, timestamps |
| **Indexes** | INDEX(`workspace_id`, `user_id`) |
| **Relationships** | FK workspace, user |
| **Deletion** | User or workspace delete |

Maps from local `taskFilters` + `activeView` patterns.

---

### user_settings

| | |
|---|---|
| **Purpose** | Per-user app preferences (synced) |
| **Key fields** | `user_id`, `complexity_mode`, `density`, `language`, `theme`, `collapsed_sections` jsonb, `updated_at` |
| **Indexes** | PK `user_id` |
| **Relationships** | FK user |
| **Deletion** | CASCADE |

Maps from `AppSettings` in localStorage.

---

### workspace_settings

| | |
|---|---|
| **Purpose** | Shared workspace defaults |
| **Key fields** | `workspace_id`, `default_complexity_mode`, `default_language`, `features` jsonb, `updated_at` |
| **Indexes** | PK `workspace_id` |
| **Relationships** | FK workspace |
| **Deletion** | CASCADE |

---

### imports

| | |
|---|---|
| **Purpose** | Track JSON import jobs |
| **Key fields** | `id`, `workspace_id`, `user_id`, `status`, `source` (`backup_json`\|`local_migration`), `stats` jsonb, `error`, `created_at`, `completed_at` |
| **Indexes** | INDEX(`workspace_id`, `created_at` DESC) |
| **Relationships** | FK workspace |
| **Deletion** | Retain 30 days |
| **Privacy** | No raw file stored after processing (or encrypted blob) |

---

### exports

| | |
|---|---|
| **Purpose** | Track export jobs / download URLs |
| **Key fields** | `id`, `workspace_id`, `user_id`, `format`, `storage_path`, `expires_at`, `created_at` |
| **Indexes** | INDEX(`workspace_id`); INDEX(`expires_at`) |
| **Relationships** | FK workspace |
| **Deletion** | Auto-expire files after 7 days |
| **Privacy** | Signed URLs; encrypt at rest |

---

### billing_customers

| | |
|---|---|
| **Purpose** | Stripe customer mapping |
| **Key fields** | `id`, `workspace_id`, `stripe_customer_id`, `email`, `created_at` |
| **Indexes** | UNIQUE(`workspace_id`); UNIQUE(`stripe_customer_id`) |
| **Relationships** | FK workspace |
| **Deletion** | Soft-delete; Stripe customer retained per Stripe policy |
| **Privacy** | PCI: no card data in DB |

---

### subscriptions

| | |
|---|---|
| **Purpose** | Active plan state |
| **Key fields** | `id`, `workspace_id`, `stripe_subscription_id`, `status`, `plan_tier`, `seat_count`, `current_period_end`, timestamps |
| **Indexes** | UNIQUE(`workspace_id`) active; INDEX(`stripe_subscription_id`) |
| **Relationships** | FK workspace |
| **Deletion** | Archive on cancel |
| **Privacy** | Webhook-only updates |

---

### audit_logs

| | |
|---|---|
| **Purpose** | Security and admin audit |
| **Key fields** | `id`, `workspace_id`, `user_id`, `action`, `resource_type`, `resource_id`, `ip_hash`, `metadata` jsonb, `created_at` |
| **Indexes** | INDEX(`workspace_id`, `created_at` DESC) |
| **Relationships** | Optional FK user |
| **Deletion** | Retain 90 days (Studio: 1 year) |
| **Privacy** | Hash IPs; no task body content |

---

## ER Diagram (simplified)

```txt
users ── profiles
  │
  └── workspace_members ── workspaces ── projects ── areas ── phases ── milestones ── epics ── task_groups
                                      │                                                      │
                                      └──────────────────────── tasks ── checklist_items
                                                                      ├── task_comments
                                                                      ├── task_activity
                                                                      └── task_dependencies
                                      tags ── task_tags ── tasks

workspaces ── billing_customers ── subscriptions
workspaces ── imports / exports / audit_logs
users ── user_settings
workspaces ── workspace_settings
users ── saved_views
```

---

## Mapping from localStorage

| Local key / entity | SaaS table(s) |
|--------------------|---------------|
| `storageKeys.projects` | `projects` |
| `storageKeys.tasks` | `tasks`, `task_dependencies`, `task_tags` |
| `storageKeys.hierarchy` | `project_areas`, `phases`, `milestones`, `epics`, `task_groups`, `checklist_items` |
| `storageKeys.appSettings` | `user_settings` + local cache |
| `storageKeys.taskFilters` | `saved_views` |
| `project-inbox` | `projects.is_system_inbox = true` |
| `AppDataSnapshot` export | Full workspace export RPC |

**Schema version:** Local `STORAGE_VERSION = 2`; cloud adds `cloud_schema_version` in workspace metadata for future migrations.

---

## High Value Score

- **Client:** `calculateHighValueScore()` in `src/utils/scoring.ts` (unchanged).
- **Server:** Generated column or trigger; reject out-of-range impact/urgency/effort (1–5).
- **Indexes:** `(workspace_id, high_value_score DESC)` for High Value view queries.

---

## Inbox SaaS Equivalent

Each workspace gets exactly one system project:

```sql
INSERT INTO projects (workspace_id, title, is_system_inbox, complexity_mode, "order")
VALUES ($ws, 'Inbox', true, 'simple', 0);
```

UI i18n displays “Eingang” / “Inbox” from `is_system_inbox` flag, not stored title (matches Agent 09).

---

## Project Deletion (Agent 09 parity)

RPC `delete_project(project_id, strategy)`:

1. `move_to_inbox` — UPDATE tasks SET project_id = inbox_id, clear hierarchy FKs.
2. `delete_tasks` — soft-delete tasks + hierarchy subtree.
3. DELETE project row (or soft-delete).

---

## Collaboration-Ready, Not Required Day One

Tables `task_comments`, `task_activity`, `workspace_members` with RLS exist in schema early but UI gated to Phase 4. Avoids painful migrations later.

---

*Agent 07 — schema plan only. Implement via Supabase migrations in a future agent.*
