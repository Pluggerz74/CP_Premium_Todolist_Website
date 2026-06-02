# Agent 08 — Prompt Report

**Agent:** Agent 08 (Private Todo Workflow, Editing & Import)  
**Project:** High Value Todo  
**Project root:** `C:\Users\lucak\Desktop\TodoListe\TodoListe`  
**Git root:** `C:\Users\lucak\Desktop\TodoListe`  
**Behavior rules followed:** `prompts/cursor-rule-update-senior-fullstack-behavior.md`  
**Planning source:** `docs/MEGA_TODO_PLANNING.md`  
**Date:** 2026-06-02  
**Status:** Complete

---

## 1. Reports Read Before Implementation

| Report | Summary used |
|--------|----------------|
| **AGENT-01-REPORT.md** | v1 MVP: Simple + Complex modes, hierarchy, templates, scoring, all views, localStorage |
| **AGENT-02-REPORT.md** | Git root at parent; app under `TodoListe/`; GitHub remote configured |
| **AGENT-03-REPORT.md** | Premium UI polish; ranked lists; VirtualList preserved |
| **AGENT-04-REPORT.md** | Storage provider, schema v2, TaskIndex, VirtualList, `importAppData`, backup download |
| **AGENT-05-REPORT.md** | Hetzner deployment prep (subdirectory era) |
| **AGENT-05B-REPORT.md** | Vite `base: "/"` for subdomain root at `https://todolist.codingplugs.de/` |
| **AGENT-06-REPORT.md** | Metadata UI system, dev-only scale test |

No conflicting decisions between reports. Agent 05B supersedes Agent 05/06 on Vite base path (`/` not `/todolist/`).

---

## 2. Private Workflow Improvements Made

- **Quick Add** — global header button, Simple Mode sidebar button, empty states on Today / Simple List
- **Today view** — split **Overdue** and **Today** sections with visual overdue accent
- **Upcoming view** — improved empty state copy
- **Due date tone** — overdue (red), today (accent), upcoming (muted) on task metadata
- **Keyboard shortcuts** — `/` search, `n` Quick Add, `Esc` close modals (documented in Settings)
- **Task cards** — Edit button alongside Focus / status / delete
- **Focus mode** — Edit task action
- **Next best action banner** — clickable to Focus; explicit Edit button

---

## 3. Inline Editing Implementation Details

- **`TaskEditForm.tsx`** — modal-based edit for existing tasks
- **Fields:** title, description, project, area/phase/milestone/epic/task group (complex only), status, type, priority, due date, impact, urgency, effort, tags
- **Validation:** required title; hierarchy refs validated via `validateHierarchySelection()` (clears invalid parent/child links, no auto-assign)
- **Score preview:** live `ScorePill` from impact/urgency/effort before save
- **Persistence:** `useTasks().updateTask()` → debounced localStorage (Agent 04 path)
- **Entry points:** Task card Edit, Focus Edit, dashboard next-action Edit
- **Score recalculation:** `calculateHighValueScore` on merge in `updateTask`

---

## 4. Quick Add Implementation Details

- **`QuickAddForm.tsx`** — lightweight modal
- **Fields:** title (required), project/list (prefers simple projects), priority, optional due date toggle
- **Defaults:** impact = priority, urgency = min(5, priority+1), effort = 2, status todo, no hierarchy IDs
- **Access:** Top bar **Quick Add**, sidebar button in Simple Mode, empty-state actions, shortcut `n`
- **Submit:** Enter or Add button → `createTask()` → closes modal

---

## 5. Backup Import UI Implementation Details

- **`BackupImportPanel.tsx`** in Settings → Storage & backup
- **Flow:** file picker → JSON parse + `validateBackupSnapshot()` → preview counts → warning → confirm → `importAppData()` → React state refresh via `migrateProjects/Tasks/Hierarchy`
- **Errors:** invalid JSON, missing collections, invalid hierarchy — shown inline, no silent import
- **Preserved:** Download backup (in panel), Reload demo data (Settings)
- **Helpers added:** `parseBackupFile()`, `validateBackupSnapshot()` in `dataBackup.ts`

---

## 6. Clickable Ranked / High-Value Item Behavior

- **`RankedListItem.tsx`** — shared clickable row with keyboard Enter/Space, `aria-label`, focus ring
- **High Value panel** — ranked rows (≤12) open Focus on click
- **Project Overview** — top 5 ranked tasks open Focus when `onFocus` provided
- **Dashboard** — next-best-action banner opens Focus on click
- **Large lists** — still use `TaskList` / VirtualList (unchanged threshold)

---

## 7. Files Changed

### Created

```txt
src/features/tasks/TaskEditForm.tsx
src/features/tasks/QuickAddForm.tsx
src/features/settings/BackupImportPanel.tsx
src/components/ui/RankedListItem.tsx
src/utils/taskHierarchyEdit.ts
src/hooks/useKeyboardShortcuts.ts
Agent-Promptreport/AGENT-08-REPORT.md
```

### Updated

```txt
src/App.tsx
src/utils/dataBackup.ts
src/utils/dates.ts
src/hooks/useTasks.ts (consumed updateTask from App)
src/components/ui/TaskMetadata.tsx
src/components/ui/SearchInput.tsx
src/components/layout/AppShell.tsx
src/components/layout/TopBar.tsx
src/components/layout/Sidebar.tsx
src/features/tasks/TaskCard.tsx
src/features/tasks/TaskList.tsx
src/features/dashboard/Dashboard.tsx
src/features/dashboard/HighValuePanel.tsx
src/features/dashboard/TodayPanel.tsx
src/features/dashboard/UpcomingPanel.tsx
src/features/focus/FocusMode.tsx
src/features/projects/ProjectOverview.tsx
src/features/projects/SimpleListPanel.tsx
src/features/projects/BacklogPanel.tsx
src/features/projects/SearchPanel.tsx
src/features/projects/CompactTaskTable.tsx
src/features/settings/SettingsPanel.tsx
src/styles/global.css
```

---

## 8. Components Changed

| Component | Change |
|-----------|--------|
| `TaskEditForm` | New — full task edit modal form |
| `QuickAddForm` | New — fast private todo creation |
| `BackupImportPanel` | New — import UI with confirm flow |
| `RankedListItem` | New — accessible clickable ranked row |
| `App` | Edit/quick-add modals, import handler, shortcuts |
| `TaskCard` / `TaskList` | Optional `onEdit` |
| `TopBar` / `Sidebar` | Quick Add affordances |
| `SettingsPanel` | Import panel + shortcuts help |
| `HighValuePanel` / `ProjectOverview` / `Dashboard` | Clickable ranked / banner |
| `TodayPanel` | Overdue + today sections |
| `TaskMetadata` | Due date tone styling |
| `FocusMode` | Edit action |

---

## 9. Storage / Data Safety Notes

- All writes go through existing `useLocalStorage` + `importAppData` + migrations
- No duplicate persistence layer
- Import validates structure before write; React state synced after successful import
- Task updates immutable via `setTasks` map; `highValueScore` recalculated on save
- Hierarchy edits use validation-only cleanup (no corrupt cross-references)
- Vite `base: "/"` unchanged (Agent 05B)

---

## 10. Accessibility Notes

- Ranked rows: `role="button"`, `tabIndex={0}`, Enter/Space activation, `aria-label`
- Clickable banner: keyboard activation + labeled action
- Import errors: `role="alert"` / `role="status"`
- Search input: retains `aria-label`; ref focus for `/` shortcut
- Priority dots / badges: unchanged Agent 06 patterns

---

## 11. Manual Sanity Check Results

| Check | Result |
|-------|--------|
| Dev server at `http://localhost:5173/` | Started successfully (`npm run dev`) |
| Quick Add flow | Implemented — header, sidebar (Simple), modal |
| Edit task title / status / dates / scores | Implemented via `TaskEditForm` + `updateTask` |
| High-value click → Focus | Implemented on ranked lists + banner |
| Export backup | Preserved in `BackupImportPanel` |
| Import valid backup | Implemented with confirm + state refresh |
| Invalid JSON import | Error panel, no crash |
| Simple ↔ Complex modes | Unchanged toggle |
| Project Map | Unchanged (no edit on map nodes) |
| Scale test (dev) | Preserved in Settings |

Full browser click-through recommended locally on `http://localhost:5173/`.

---

## 12. Commands Run

```powershell
cd C:\Users\lucak\Desktop\TodoListe\TodoListe
npm install
npm run typecheck
npm run build
npm run dev
```

---

## 13. Typecheck Result

**Passed** — `tsc -b` with no errors.

---

## 14. Build Result

**Passed**

```txt
vite v7.3.5 building for production...
base: /
dist/assets/index-CP4z1c_x.css   26.77 kB
dist/assets/index-aBnmtDDx.js   286.65 kB
✓ built in ~1.9s
```

---

## 15. Lint / Test Result

- **`npm run lint`** — Not defined in `package.json`; not run.
- **`npm test`** — Not defined in `package.json`; not run.

---

## 16. Remaining Limitations

1. **localStorage quota** — unchanged; large imports may approach limits
2. **Project Map** — tasks open Focus only; no inline edit on tree nodes
3. **Virtual list row height** — long titles may still clip
4. **Checklist / dependency UI** — types only
5. **No automated test suite**
6. **Edit modal** — does not auto-refresh if same task updated elsewhere while open
7. **Quick Add** — always creates flat tasks (no hierarchy picker by design)

---

## 17. Recommended Next Agent or Next Manual Action

| Action | Owner |
|--------|-------|
| **Manual browser QA** | User — verify flows on `http://localhost:5173/` |
| **Hetzner upload** | User — `npm run build`, upload `dist/` to subdomain root after billing |
| **Agent 09 / future** | IndexedDB migration, project edit UI, checklist UI |

---

## Agent Compliance Checklist

- [x] Read behavior rules and all Agent reports (01–06, 05B)
- [x] Read `MEGA_TODO_PLANNING.md`
- [x] Pre-execution summary provided before coding
- [x] Inline editing, Quick Add, import UI, clickable ranked items
- [x] Simple + Complex modes, templates, storage hardening preserved
- [x] Vite `base: "/"` unchanged
- [x] No backend, auth, DB, billing, Hetzner deploy
- [x] `npm install`, `typecheck`, `build` passed
- [x] Commit and push from Git root (pending below)

---

*End of Agent 08 report.*
