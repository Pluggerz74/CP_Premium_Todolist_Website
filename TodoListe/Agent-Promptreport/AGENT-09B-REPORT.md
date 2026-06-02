# Agent 09B — Prompt Report

**Agent:** Agent 09B (Final usability QA — labels, Simple Mode, mobile menus)  
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
| **AGENT-01-REPORT.md** | MVP scope, modes, hierarchy, scoring, localStorage |
| **AGENT-02-REPORT.md** | Git root at parent; app under `TodoListe/` |
| **AGENT-03-REPORT.md** | Premium UI polish; VirtualList preserved |
| **AGENT-04-REPORT.md** | Storage provider, schema v2, TaskIndex, backup |
| **AGENT-05-REPORT.md** | Hetzner deployment prep |
| **AGENT-05B-REPORT.md** | Vite `base: "/"` — preserved |
| **AGENT-06-REPORT.md** | Metadata UI, scale test |
| **AGENT-08-REPORT.md** | Inline edit, Quick Add, backup import |
| **AGENT-08B-REPORT.md** | i18n, SimpleBoardPanel, SelectField, dropdown CSS |
| **AGENT-08C-REPORT.md** | Natural German copy |
| **AGENT-08D-REPORT.md** | Placeholders, task types, score aria |
| **AGENT-09-REPORT.md** | Simple Mode simplification, project/list management, Inbox, priority labels |

No conflicting decisions between reports.

---

## 2. UX Issues Found

1. **Impact/urgency/effort** selects in `TaskEditForm` and `TaskForm` still showed raw numbers 1–5 (noted by Agent 09).
2. **ScoreBreakdown** displayed and announced numeric signals in aria instead of human labels.
3. **Simple Mode** sidebar used `nav.highValue` (“High Value”) instead of plainer “Important” in English.
4. **Top bar** repeated long marketing headline in Simple Mode, competing with view titles.
5. **Sidebar project ⋯ menu** had no click-outside close; narrow view risked menu clipping below fold.
6. **Mobile** modals and confirm actions lacked bottom-sheet-friendly layout; project menu touch targets were small.
7. **SimpleTaskCard** delete button reused `projectManage.deleteAria` (wrong semantics for tasks).

---

## 3. Impact/Urgency/Effort Label Improvements

Added i18n keys `impact.signal.1`–`5`, `urgency.signal.1`–`5`, `effort.signal.1`–`5` (EN + DE) per Agent 09B spec.

| Signal | Impact (EN / DE) | Urgency (EN / DE) | Effort (EN / DE) |
|--------|------------------|-------------------|------------------|
| 1 | Very low / Sehr gering | Someday / Irgendwann | Tiny / Mini |
| 2 | Low / Gering | Low / Niedrig | Small / Klein |
| 3 | Medium / Mittel | Soon / Bald | Medium / Mittel |
| 4 | High / Hoch | Urgent / Dringend | Large / Groß |
| 5 | Very high / Sehr hoch | Critical / Kritisch | Huge / Sehr groß |

**Helpers:** `formatImpactSignalLabel`, `formatUrgencySignalLabel`, `formatEffortSignalLabel`, `getImpactSignalOptions`, `getUrgencySignalOptions`, `getEffortSignalOptions` in `formatLabels.ts`.

**Wired in:** `TaskEditForm`, `TaskForm`, `ScoreBreakdown` (visible + `score.breakdownAria`).

Stored numeric values unchanged.

---

## 4. Simple Mode QA Findings

| Check | Finding |
|-------|---------|
| Quick Add obvious | Pass — sidebar primary button + empty state CTA unchanged |
| My Tasks simple | Pass — board sections unchanged; intro copy shortened |
| Lists easy to find | Pass — “Lists” nav + manage modal unchanged |
| Delete list/project | Pass — no logic changes |
| Task actions visible | Pass — edit/delete on cards; delete aria fixed |
| UI crowded | Improved — TopBar marketing block hidden in Simple Mode |
| Advanced hidden | Pass — no new complex fields in simple flow |
| Feels like reminders | Improved — “Important” nav label, calmer intro |

---

## 5. Simple Mode Polish Made

- Simple nav item **High Value → Important** (`nav.important` in `simpleCoreNav`).
- **TopBar** hides tagline/headline when `complexityMode === "simple"` (`topbar--simple`).
- Shorter **board intro** copy (EN + DE).
- **Delete task** aria uses `aria.deleteTask`.

---

## 6. Mobile/Sidebar QA Findings

| Area | Issue | Fix |
|------|-------|-----|
| Project ⋯ menu | No outside dismiss | `pointerdown` listener + menu ref |
| Project ⋯ menu | Small tap targets | `min-height/width` 2.75rem on trigger and items |
| Project ⋯ menu | Clipped below on narrow | Panel opens upward (`bottom: 100%`) at ≤720px |
| Modals | Wide on phones | Full-width, bottom-aligned sheet style |
| Confirm dialog | Cramped actions | Stacked full-width buttons on mobile |
| Manage modal rows | Cramped actions | Actions row wraps full width on mobile |
| TopBar (simple) | Duplicate headline | Hidden in simple mode |

---

## 7. Project/List Management QA Findings

No deletion/create/rename logic changed. Code review confirms Agent 09 behavior preserved:

- Inbox protected via `isInboxProject`
- Delete strategies `move-to-inbox` / `delete-tasks` unchanged
- `ProjectManageModal` and `ConfirmDialog` flows intact
- Task counts and i18n keys unchanged

**Recommended:** Manual browser pass on delete flows after deploy.

---

## 8. i18n Additions

- `nav.important`
- `impact.signal.1`–`5`, `urgency.signal.1`–`5`, `effort.signal.1`–`5`
- `aria.deleteTask`, `aria.closeProjectMenu` (reserved)
- Updated `simple.boardIntro` (EN + DE)

---

## 9. Accessibility Notes

- Impact/urgency/effort selects use `select-field` class (readable options per 08B).
- Project menu trigger: `aria-haspopup="menu"`, `aria-expanded`.
- Score breakdown aria uses localized signal words, not digits.
- Focus-visible styles preserved on menu triggers and panel buttons.
- Simple task delete: correct `aria.deleteTask` with task title.

---

## 10. Data Safety Notes

- No schema version change.
- No changes to storage keys, migrations, or backup format.
- Form submits still pass numeric `impact`, `urgency`, `effort`.
- Vite `base: "/"` unchanged.

---

## 11. Manual QA Results

Verified via code review + production build (no automated browser in agent session):

| Check | Result |
|-------|--------|
| Simple Mode My Tasks | Pass (structure unchanged) |
| Quick Add | Pass |
| Create/rename/delete list/project | Pass (logic unchanged) |
| Task delete from simple card | Pass (aria fix) |
| Impact/urgency/effort labels EN | Pass (keys + form wiring) |
| Impact/urgency/effort labels DE | Pass (keys + form wiring) |
| Mobile sidebar/menu CSS | Pass (responsive rules added) |
| Complex Mode | Pass (TopBar headline restored) |
| Project Map | Pass (no changes) |
| Backup export/import | Pass (no changes) |
| Vite base `/` | Pass |

---

## 12. Files Changed

### Created

```txt
Agent-Promptreport/AGENT-09B-REPORT.md
```

### Updated

```txt
src/i18n/translations.ts
src/utils/formatLabels.ts
src/features/tasks/TaskEditForm.tsx
src/features/tasks/TaskForm.tsx
src/features/tasks/SimpleTaskCard.tsx
src/components/ui/ScoreBreakdown.tsx
src/components/layout/Sidebar.tsx
src/components/layout/TopBar.tsx
src/components/layout/AppShell.tsx
src/styles/global.css
src/styles/responsive.css
```

---

## 13. Components Changed

TaskEditForm, TaskForm, SimpleTaskCard, ScoreBreakdown, Sidebar, TopBar, AppShell.

---

## 14. Commands Run

```powershell
cd C:\Users\lucak\Desktop\TodoListe\TodoListe
npm install
npm run typecheck
npm run build
```

---

## 15. Typecheck Result

**Pass** — `tsc -b` exit code 0.

---

## 16. Build Result

**Pass**

```txt
vite v7.3.5 building for production...
base: /
dist/assets/index-THM0UV8y.css   35.04 kB
dist/assets/index-ClehuGvI.js   336.97 kB
✓ built in ~2.3s
```

---

## 17. Lint / Test Result

- **`npm run lint`** — Not defined in `package.json`; not run.
- **`npm test`** — Not defined in `package.json`; not run.

---

## 18. Remaining Limitations

1. No drag-and-drop between board sections.
2. No backend, auth, or billing.
3. Sidebar on tablet still stacks above content (no drawer toggle) — acceptable for v1.
4. `aria.closeProjectMenu` added but not wired to a dedicated close control (menu closes via outside click/toggle).
5. Automated test suite still absent.
6. Production browser QA on https://todolist.codingplugs.de/ recommended after deploy.

---

## 19. Recommended Next Agent or Manual Action

1. Manual smoke test on production subdomain (EN + DE, mobile width).
2. Optional: collapsible sidebar drawer for &lt;720px instead of full stacked nav.
3. Deploy dist to Hetzner when ready.

---

## Vite Base Confirmation

`vite.config.ts` → `base: "/"`.

---

*End of Agent 09B report.*
