# Local-First to Cloud Migration

**Status:** Planning only (Agent 07)  
**Goal:** Migrate from browser localStorage to optional Supabase cloud **without data loss** for early private users

Related: [Backend Migration Plan](./BACKEND_MIGRATION_PLAN.md), [Database Schema](./DATABASE_SCHEMA_PLAN.md), [Auth Plan](./AUTH_WORKSPACE_BILLING_PLAN.md)

---

## Principles

1. **Local-first remains default** — no login wall.
2. **User chooses** when and how cloud sync starts.
3. **Backup before every migration step** — automatic download prompt.
4. **Same JSON shape** — extend `AppDataSnapshot`, do not break import/export.
5. **Agent 09 deletion semantics preserved** — inbox move vs delete tasks.

---

## 1. Current localStorage Schema Assumptions

### Storage keys (`src/constants/storageKeys.ts`)

| Key | Content |
|-----|---------|
| `projects` | `Project[]` |
| `tasks` | `Task[]` |
| `hierarchy` | `ProjectHierarchyStore` (areas, phases, milestones, epics, taskGroups, checklistItems) |
| `appSettings` | Mode, density, language, theme, collapsed sections |
| `taskFilters` | Filter state |
| `theme`, `activeView`, `selectedProjectId` | UI state |
| `schemaVersion` | `STORAGE_VERSION = 2` |
| `storageMeta` | Last write, migration flags |

Namespace prefix from `appConfig.localStorageNamespace`.

### Entity shape

Normalized ID-based collections (not nested JSON trees). Tasks reference hierarchy by foreign keys (`areaId`, `phaseId`, …).

### System Inbox

`project-inbox` (`src/constants/inboxProject.ts`) — always present after Agent 09; ensured on import via `ensureInboxInProjects`.

---

## 2. Existing storageProvider Abstraction

```typescript
// src/utils/storageProvider.ts
interface StorageProvider {
  readRaw(key: string): StorageReadResult<string | null>;
  writeRaw(key: string, value: string): StorageWriteResult;
  remove(key: string): void;
  getKeys(prefix: string): string[];
}
```

Today: `LocalStorageProvider` only, swapped via `setStorageProvider()`.

**Planned adapters:**

| Provider | Phase | Role |
|----------|-------|------|
| `LocalStorageProvider` | 0+ | Offline cache, anonymous users |
| `SupabaseStorageProvider` | 3 | Cloud CRUD + sync |
| `HybridStorageProvider` | 3 | Orchestrates local + cloud; conflict resolution |

Hooks (`useLocalStorage`, `useProjects`, `useTasks`, `useHierarchy`) should depend on provider interface, not `window.localStorage` directly (already mostly true via `storage.ts`).

---

## 3. Existing Schema Versioning

- `initializeAppStorage()` on startup (`storageMigration.ts`)
- `STORAGE_VERSION = 2` with entity revalidation in `migration.ts`
- Banner on upgrade in UI

**Cloud extension:**

- Add `cloudSyncMeta` local key: `{ lastSyncAt, workspaceId, syncCursor, pendingOps[] }`
- Do **not** bump `STORAGE_VERSION` until cloud meta shape is stable
- Server tracks `workspace.cloud_schema_version` for Postgres migrations

---

## 4. Existing Export / Import System

### Export (`src/utils/dataBackup.ts`)

```typescript
type AppDataSnapshot = {
  version: number;
  exportedAt: string;
  projects: Project[];
  tasks: Task[];
  hierarchy: ProjectHierarchyStore;
};
```

`exportAppData()` → JSON download in Settings.

### Import

- `validateBackupSnapshot()` — structure check
- `importAppData()` — writes to localStorage + migrations
- UI: `BackupImportPanel` with preview counts + confirm

### Cloud extension (planned)

```typescript
type CloudAppDataSnapshot = AppDataSnapshot & {
  appSettings?: AppSettings;
  savedViews?: SavedView[];
  workspaceMeta?: { name: string; exportedBy: string };
};
```

Backward compatible: cloud export includes `version`; old clients ignore extra fields.

---

## 5. Migrate Local Data to User Account

### Flow (Phase 3)

```txt
User signs in (Phase 2)
    ↓
Prompt: "Local data detected on this device"
    ↓
User chooses migration strategy (see §7)
    ↓
Auto backup download (mandatory step)
    ↓
RPC import_workspace_from_snapshot(snapshot, strategy)
    ↓
Map local UUIDs → cloud UUIDs (or preserve UUIDs if globally unique)
    ↓
Write cloudSyncMeta locally
    ↓
Enable HybridStorageProvider
```

**ID strategy:** Preserve client-generated UUIDs on first upload to avoid breaking local references; server accepts client IDs on import RPC.

---

## 6. Detect Existing Local Data After Login

Detection heuristics (all must be evaluated):

| Signal | Condition |
|--------|-----------|
| Has user content | `projects.length > 1` OR `tasks.length > demo threshold` OR any non-demo project id |
| Not yet linked | `cloudSyncMeta.workspaceId` absent |
| Not fresh device | `storageMeta.hasUserEdits === true` (flag to add in Phase 2) |

UI: modal with counts:

- X projects / lists
- Y tasks
- Last local edit timestamp

Do not auto-upload without explicit consent (GDPR).

---

## 7. User Migration Choices

| Option | Behavior |
|--------|----------|
| **Keep local only** | No cloud write; dismiss prompt; remind later in Settings |
| **Upload local → cloud** | Cloud becomes source of truth; local becomes cache |
| **Merge with cloud** | Union by id; conflicts resolved per §8 |
| **Replace local with cloud** | Download cloud snapshot; overwrite localStorage; backup first |

Default recommendation text: **Upload** for first device; **Merge** for second device.

---

## 8. Conflict Handling

### Entity-level last-write-wins (LWW) — Phase 3 default

Compare `updated_at` timestamps (milliseconds). Winner overwrites loser. Loser copy stored in `sync_conflicts` local log for user review.

### Fields with special rules

| Field | Rule |
|-------|------|
| `high_value_score` | Recompute from impact/urgency/effort; never trust stale score |
| `status` | If one side `done` and newer, keep done |
| `project delete` | Deletion tombstone wins over edit |
| Inbox project | Server inbox id mapped; never duplicate inbox |

### Merge UI (Phase 3)

Settings → Sync → Conflicts (N): side-by-side title/status/updated_at; pick local or remote per task.

### Future: CRDT / version vectors

Defer until collaboration (Phase 4) requires finer merging.

---

## 9. Offline Behavior

| State | Behavior |
|-------|----------|
| Offline + was synced | Read/write local cache; queue ops in `pendingOps` |
| Offline + never synced | Pure localStorage (today’s behavior) |
| Back online | `sync.push(pendingOps)` then `sync.pull(since)` |
| Long offline | Show banner “Sync pending (N changes)” |

Optimistic UI: all edits instant locally; cloud catch-up async.

---

## 10. Sync Strategy

### Phase 3a — Manual sync

- Button: “Sync now”
- Full snapshot diff or cursor-based pull
- Suitable for solo dev MVP

### Phase 3b — Background sync

- Debounced push 5s after idle (mirror localStorage debounce 300ms → batch)
- Pull on focus / interval 60s when tab visible
- No Supabase Realtime initially (cost + complexity)

### Sync payload

```typescript
type SyncOperation =
  | { op: "upsert"; entity: "task" | "project" | ...; id: string; data: object; updatedAt: string }
  | { op: "delete"; entity: string; id: string; deletedAt: string };
```

Server RPC validates workspace membership and hierarchy integrity.

---

## 11. Migration Rollback

If cloud migration fails or user unhappy:

1. Settings → “Disconnect cloud sync”
2. Restore from auto-backup file (import UI already exists)
3. Clear `cloudSyncMeta`
4. Revert to `LocalStorageProvider` only
5. Optional: delete cloud workspace via account settings

**Never delete local backup** until user confirms cloud sync stable (7-day prompt).

---

## 12. Backup Before Migration

Automatic steps before any cloud write:

1. Call `downloadAppBackup()` programmatically
2. Show checkbox: “I saved my backup file”
3. Store backup hash in `imports` table when server import starts

Matches Agent 04/08 backup culture.

---

## 13. Import / Export Compatibility

| Scenario | Supported |
|----------|-----------|
| Local export → local import | ✅ Today |
| Local export → cloud import | ✅ Phase 3 RPC |
| Cloud export → local import | ✅ Extend `validateBackupSnapshot` |
| Old backup without inbox | ✅ `ensureInboxInProjects` on import |
| Cross-language | ✅ User content unchanged; UI locale separate |
| Demo reset | ✅ Local only; does not touch cloud unless connected |

**Version field:** Increment `AppDataSnapshot.version` to `2` when adding `appSettings` to export (future agent; coordinate with migrations).

---

## Migration State Machine

```txt
                    ┌──────────────┐
                    │ LOCAL_ONLY   │ ← default (Phase 0–1)
                    └──────┬───────┘
                           │ sign in
                           ▼
                    ┌──────────────┐
                    │ AUTH_LOCAL   │ logged in, no sync
                    └──────┬───────┘
                           │ user uploads
                           ▼
                    ┌──────────────┐
         ┌─────────│ SYNC_ACTIVE  │─────────┐
         │         └──────────────┘         │
         │ disconnect              merge 2nd device
         ▼                                  ▼
  ┌──────────────┐                   ┌──────────────┐
  │ LOCAL_ONLY   │                   │ MERGE_REVIEW │
  └──────────────┘                   └──────────────┘
```

---

## Implementation Checklist (future agents)

- [ ] Add `hasUserEdits` to `storageMeta`
- [ ] Extend `AppDataSnapshot` with optional settings
- [ ] `CloudStorageProvider` implementing `StorageProvider`
- [ ] `HybridStorageProvider` with pending op queue
- [ ] Post-login detection modal
- [ ] Server RPC `import_workspace_from_snapshot`
- [ ] UUID preservation policy documented in migration SQL
- [ ] Conflict review UI
- [ ] E2E test: local → cloud → second browser → merge

---

## Risks

| Risk | Mitigation |
|------|------------|
| Data loss on merge | Mandatory backup; dry-run preview |
| Duplicate inbox | Server enforces one `is_system_inbox` per workspace |
| localStorage quota during dual write | Hybrid writes single local serialize; cloud async |
| User confusion | Clear copy EN/DE; default “keep local” safe path |
| GDPR | Explicit consent before upload; EU region |

---

*Agent 07 — planning only. Preserves all current local-first features.*
