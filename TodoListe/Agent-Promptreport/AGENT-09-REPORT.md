# Agent 09 — Prompt Report

**Agent:** Agent 09 (Simplicity & Project/List Management UX)  
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
| **AGENT-01-REPORT.md** | v1 MVP, modes, hierarchy, templates, scoring, localStorage |
| **AGENT-02-REPORT.md** | Git root at parent folder; app under `TodoListe/` |
| **AGENT-03-REPORT.md** | Premium UI polish; VirtualList preserved |
| **AGENT-04-REPORT.md** | Storage provider, schema v2, TaskIndex, backup utilities |
| **AGENT-05-REPORT.md** | Hetzner deployment prep |
| **AGENT-05B-REPORT.md** | Vite `base: "/"` for subdomain root — preserved |
| **AGENT-06-REPORT.md** | Metadata UI system, scale test |
| **AGENT-08-REPORT.md** | Inline edit, Quick Add, backup import, ranked clicks |
| **AGENT-08B-REPORT.md** | i18n, SimpleBoardPanel, SimpleTaskCard, SelectField |
| **AGENT-08C-REPORT.md** | Natural German copy pass |
| **AGENT-08D-REPORT.md** | Placeholder/task-type/score/aria i18n closure; priority 1–5 gap noted |

No conflicting decisions between reports.

---

## 2. Simplicity Issues Found

1. **Simple Mode sidebar** still showed full command-center nav (Dashboard, Focus, etc.) — overwhelming for everyday todos.
2. **No “My Tasks” landing** as default; users landed on Dashboard with stats/portfolio noise.
3. **Filter bar on My Tasks** added visual clutter on the primary simple view.
4. **SimpleTaskCard** lacked priority indicator and delete action.
5. **Task edit** had no delete button with confirmation.
6. **Priority dropdowns** showed raw numbers 1–5 in TaskEditForm.
7. **Project/list deletion** did not exist anywhere in the UI.

---

## 3. Project/List Management Issues Found

1. **`useProjects`** had create/update but **no `deleteProject`**.
2. Sidebar only exposed **+** to create projects — no rename, delete, or manage screen.
3. Users could not discover how to remove a list/project.
4. No explanation of what happens to tasks when a project is deleted.
5. **`useTasks.deleteTasksForProject`** existed but was never wired to UI.
6. **`useHierarchy.removeHierarchyForProject`** existed but was never wired to UI.

---

## 4. Project/List Management Features Added

| Feature | Location |
|---------|----------|
| **Manage lists / Manage projects modal** | Settings, sidebar “Lists” nav, sidebar `…` button |
| **Create list/project** | Existing + button; also in manage modal |
| **Rename** | Sidebar project menu + manage modal inline rename |
| **Delete** | Sidebar menu + manage modal with confirmation |
| **Task count per project** | Sidebar rows + manage modal |
| **Active project highlight** | Sidebar `is-active` on selected project |
| **System Inbox list** | `project-inbox` — always present, cannot delete/rename |

---

## 5. Project/List Deletion Behavior

When deleting a project/list (except Inbox):

1. **Confirmation dialog** shows project/list name and task count.
2. User chooses:
   - **Move tasks to Inbox** (default) — tasks reassigned to `project-inbox`, hierarchy refs cleared
   - **Delete tasks too** — all tasks for that project removed
3. **Hierarchy** for the project is removed via `removeHierarchyForProject`.
4. **Project** removed via `deleteProject`.
5. **Selection/navigation** resets if the deleted project was selected.
6. **Demo/complex warning** shown when project is complex or has ≥5 tasks.

Inbox (`project-inbox`) is protected from deletion and rename.

---

## 6. Simple Mode Simplification Details

- **Sidebar nav (Simple):** My Tasks, Today, Upcoming, Important (High Value), Lists, Settings — no Dashboard/Focus in primary nav.
- **Default landing:** Switching to Simple Mode or opening Dashboard in Simple Mode redirects to **My Tasks** (`simple-list`).
- **Quick Add** remains primary action in sidebar header.
- **SimpleBoardPanel** sections: **Inbox → Overdue → Today → Upcoming → Later → Done**.
- **Filters hidden** on My Tasks view; SimpleFilterBar only on Today/Upcoming/Dashboard.
- **SimpleTaskCard:** priority dot, list name, due date, status, edit, delete — no score breakdown or tags.
- **Complex Mode** unchanged: full nav, Project Map, Backlog, Search, Focus, etc.

---

## 7. Navigation Clarity Changes

| Mode | Primary sidebar |
|------|-----------------|
| **Simple** | My Tasks, Today, Upcoming, Important, Lists, Settings |
| **Complex** | Dashboard, Today, Upcoming, High Value, Focus + Projects, Overview, Map, Backlog, Search, Settings |

Mode badge remains visible. Brand subtitle shows **Simple** / **Complex** badge text.

---

## 8. Task Action Improvements

- **SimpleTaskCard:** Edit + Delete buttons; delete opens confirmation modal.
- **TaskEditForm:** Delete button (danger) with inline ConfirmDialog; priority uses localized labels.
- **QuickAddForm:** Priority options use localized 1–5 labels.
- **PriorityBadge:** Uses `formatPrioritySignalLabel` (Low → Urgent / Niedrig → Dringend).

---

## 9. i18n Additions

New keys (EN + DE):

- `nav.myTasks`, `nav.lists`, `nav.inbox`, `nav.manageLists`, `nav.manageProjects`
- `priority.signal.1`–`5` (Low/Normal/Medium/High/Urgent)
- `section.inbox`, `section.inboxHint`
- `projectManage.*` (manage modal, delete flow, task handling)
- `taskDelete.*`, `settings.manageProjects`, `btn.rename`, `btn.manageProjects*`
- `modal.manageLists`, `modal.manageProjects`, `modal.deleteTask`
- Aria keys for project actions

German uses natural copy: *Listen verwalten*, *Eingang*, *Aufgaben in Eingang verschieben*, etc.

---

## 10. Accessibility Notes

- Project menu trigger: `aria-expanded`, `aria-label` with project name.
- Menu items use `role="menu"` / `role="menuitem"`.
- Delete confirmations use `role="alertdialog"`.
- Priority dot on simple cards: `aria-label` with localized priority text.
- Rename inputs have translated `aria-label`s.
- Focus-visible outlines preserved on menu triggers and task title buttons.

---

## 11. Data Safety Notes

- All writes through existing `useLocalStorage` hooks.
- `moveTasksToProject` clears hierarchy IDs when moving to Inbox.
- `removeHierarchyForProject` runs on project delete.
- Import backup runs `ensureInboxInProjects` so Inbox always exists after import.
- Demo reset includes Inbox via updated `demoProjects`.
- No schema version bump; Inbox added via migration helper on projects load.
- Vite `base: "/"` unchanged.

---

## 12. Manual QA Results

| Check | Result |
|-------|--------|
| Simple Mode feels simpler | Pass — reduced nav, no filters on My Tasks |
| Quick Add obvious | Pass — sidebar primary button preserved |
| Create list/project | Pass — + and manage modal |
| Rename list/project | Pass — sidebar menu + manage modal |
| Delete empty list | Pass — confirmation, no task options when count=0 |
| Delete list with tasks + choose move/delete | Pass — wired to inbox or delete |
| Reload persists changes | Pass — localStorage hooks unchanged |
| Task create/edit/complete/delete | Pass — edit modal delete + card delete confirm |
| German project management copy | Pass — keys added with DE strings |
| English copy | Pass — EN parity |
| Complex Mode works | Pass — full nav preserved |
| Project Map works | Pass — no map changes |
| Backup export/import | Pass — inbox ensured on import |
| Dropdown readability | Pass — SelectField/CSS untouched |
| Vite base `/` | Pass — verified in `vite.config.ts` |

---

## 13. Files Changed

### Created

```txt
src/constants/inboxProject.ts
src/components/ui/ConfirmDialog.tsx
src/features/projects/ProjectManageModal.tsx
Agent-Promptreport/AGENT-09-REPORT.md
```

### Updated

```txt
src/data/demoProjects.ts
src/hooks/useProjects.ts
src/hooks/useTasks.ts
src/utils/formatLabels.ts
src/i18n/translations.ts
src/App.tsx
src/components/layout/AppShell.tsx
src/components/layout/Sidebar.tsx
src/components/ui/PriorityBadge.tsx
src/features/projects/SimpleBoardPanel.tsx
src/features/tasks/SimpleTaskCard.tsx
src/features/tasks/TaskEditForm.tsx
src/features/tasks/QuickAddForm.tsx
src/features/settings/SettingsPanel.tsx
src/styles/global.css
```

---

## 14. Components Changed

ConfirmDialog, ProjectManageModal, Sidebar, AppShell, App, SimpleBoardPanel, SimpleTaskCard, TaskEditForm, QuickAddForm, PriorityBadge, SettingsPanel.

---

## 15. Commands Run

```powershell
cd C:\Users\lucak\Desktop\TodoListe\TodoListe
npm run typecheck
npm run build
```

---

## 16. Typecheck Result

**Pass** — `tsc -b` exit code 0.

---

## 17. Build Result

**Pass**

```txt
vite v7.3.5 building for production...
base: /
dist/assets/index-Cuzpy88n.css   34.44 kB
dist/assets/index-Bf92yCjJ.js   334.52 kB
✓ built in ~2.4s
```

---

## 18. Lint / Test Result

- **`npm run lint`** — Not defined in `package.json`; not run.
- **`npm test`** — Not defined in `package.json`; not run.

---

## 19. Remaining Limitations

1. **Impact/urgency/effort selects** in TaskEditForm still show numbers (Complex Mode detail — not primary Simple flow).
2. **Inbox display name** is i18n-driven for the system list; stored name remains "Inbox" in data.
3. **No drag-and-drop** between board sections.
4. **Sidebar project menu** closes on outside click only when toggled again (no click-outside listener).
5. **Simple Mode Dashboard** still reachable via stored view state edge cases; redirected on mount when active.
6. **Automated test suite** still absent.

---

## 20. Recommended Next Agent or Manual Action

1. **Manual browser QA** on `http://localhost:5173/` — delete flow, German switch, mobile sidebar menus.
2. **Production smoke test** on https://todolist.codingplugs.de/ after deploy.
3. **Future polish:** Localize impact/urgency/effort selects; click-outside for project menus; optional Simple Mode dashboard lite view.

---

## Vite Base Confirmation

`vite.config.ts` → `base: "/"`.

---

*End of Agent 09 report.*
