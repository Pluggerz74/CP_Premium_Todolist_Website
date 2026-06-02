# Agent 08B — Prompt Report

**Agent:** Agent 08B (Simple Mode UX, Dropdown Readability, i18n)  
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
| **AGENT-01** through **AGENT-06** | Full project history, modes, storage, UI metadata |
| **AGENT-05B** | Vite `base: "/"` for subdomain deployment |
| **AGENT-08** | Inline edit, Quick Add, backup import, clickable ranked items |

No conflicting decisions. Agent 08B builds on Agent 08 without removing its features.

---

## 2. Dropdown / Readability Issues Found

1. **Native `<option>` elements** inherited browser/OS popup styling — often white background with low-contrast text in dark-themed apps.
2. **`<select>` used `background: var(--surface)`** — semi-transparent surface did not force readable option list colors.
3. **No `color-scheme`** on selects — browser assumed light popup in dark mode.
4. **Issue reported on Simple List project filter** — same root cause as all filter bars and forms (TaskFilterBar, Quick Add, Task Edit, TaskCard status).

---

## 3. Dropdown / Readability Fixes Made

### Global CSS (`global.css`)

- Selects use `background-color: var(--background-elevated)` and `color: var(--text)`.
- `color-scheme: light dark` with theme-specific `[data-theme="dark|light"]` overrides.
- Explicit `option { background-color; color; }` for readable menus in both themes.
- Disabled option styling, focus-visible outlines, custom chevron indicator.
- Compact width rules for inline status selects on cards.

### `SelectField` component

- Shared wrapper class `select-field` applied across forms and filters.
- Replaced raw `<select>` in: TaskFilterBar, SimpleFilterBar, QuickAddForm, TaskCard, CompactTaskTable, SimpleTaskCard.

Task Edit / Task Create forms still use native `<select class="select-field">` via global rules (same styling).

---

## 4. Language Switch Implementation Details

- **`language: "en" | "de"`** added to `AppSettings` with safe migration in `migrateAppSettings`.
- Persisted via existing `useLocalStorage` / `storageKeys.appSettings`.
- **`I18nProvider`** + **`useI18n()`** + typed **`translations.ts`** dictionary (~120 keys).
- **`LanguageSwitch`** segmented control in Settings and sidebar footer.
- **`document.documentElement.lang`** updated on language change.
- Default: browser locale (`de` if `navigator.language` starts with `de`), else `en`.

---

## 5. English / German Translation Coverage

Translated primary UI:

- Sidebar navigation and mode labels
- View titles and eyebrows (via translation keys)
- Top bar actions and search placeholder
- Settings cards (appearance, mode, density, storage, shortcuts, language)
- Status, priority, due-date labels
- Buttons (New Task, Quick Add, Edit, Save, Cancel, Delete, Focus, etc.)
- Simple board sections and empty states
- Focus mode and dashboard next-action actions
- Filter bar labels (complex + simple)
- Mode badges

**Not translated:** Stored task titles, project names, hierarchy node titles, user tags, template descriptions in project form (content data).

---

## 6. Simple Mode Simplification Details

### Structure: section-based board (Option B)

- **`SimpleBoardPanel`** replaces flat virtualized list on **My tasks** (`simple-list` view).
- Sections: **Overdue → Today → Upcoming → Later → Done** (done collapsible).
- **`SimpleTaskCard`**: title (click to edit), list name, due date, compact status select — no score breakdown, tags, or heavy metadata.

### Filters

- **`SimpleFilterBar`**: search + project/list only by default.
- **More filters** toggle reveals status filter + reset (no area/milestone/score grid).
- Shown on simple-mode views: My tasks, Today, Upcoming, Dashboard.
- Full **`TaskFilterBar`** remains for Complex Mode and complex views (backlog, search, high-value).

### Navigation

- Simple nav label changed to **My tasks** / **Meine Aufgaben** (less “admin panel” than “Simple List”).
- Quick Add remains primary in sidebar and header.

---

## 7. Files Changed

### Created

```txt
src/i18n/translations.ts
src/i18n/I18nProvider.tsx
src/i18n/useI18n.ts
src/components/ui/SelectField.tsx
src/components/ui/LanguageSwitch.tsx
src/features/tasks/SimpleFilterBar.tsx
src/features/tasks/SimpleTaskCard.tsx
src/features/projects/SimpleBoardPanel.tsx
Agent-Promptreport/AGENT-08B-REPORT.md
```

### Updated

```txt
src/types/appSettings.ts
src/utils/migration.ts
src/hooks/useAppSettings.ts
src/utils/dataBackup.ts
src/utils/formatLabels.ts
src/styles/global.css
src/styles/responsive.css
src/App.tsx
src/components/layout/Sidebar.tsx
src/components/layout/TopBar.tsx
src/components/ui/ModeBadge.tsx
src/components/ui/StatusBadge.tsx
src/components/ui/PriorityBadge.tsx
src/components/ui/TaskMetadata.tsx
src/features/tasks/TaskFilters.tsx
src/features/tasks/TaskFilterBar.tsx
src/features/tasks/TaskCard.tsx
src/features/tasks/QuickAddForm.tsx
src/features/settings/SettingsPanel.tsx
src/features/dashboard/Dashboard.tsx
src/features/focus/FocusMode.tsx
src/features/projects/CompactTaskTable.tsx
```

---

## 8. Components Changed

| Component | Change |
|-----------|--------|
| `SelectField` | New shared select with readable styling |
| `LanguageSwitch` | EN/DE toggle |
| `SimpleBoardPanel` | Trello-like sections for Simple Mode |
| `SimpleTaskCard` | Minimal personal task card |
| `SimpleFilterBar` | Lightweight filters + collapsible advanced |
| `I18nProvider` | App-wide translations |
| `Sidebar` / `TopBar` / `SettingsPanel` | i18n + language switch |
| `TaskFilterBar` | SelectField + i18n |
| `ModeBadge` / `StatusBadge` / `PriorityBadge` | i18n labels |

---

## 9. Storage / Settings Changes

- `AppSettings.language` added; migrated safely (`en` default, `de` if stored).
- No schema version bump required — optional field via existing migration pattern.
- Existing tasks, imports, exports unchanged.
- Demo reset sets `language: "en"` explicitly.

---

## 10. Accessibility Notes

- Language switch: `role="group"`, `aria-pressed` on active language.
- Selects: visible focus ring, readable contrast in light/dark.
- Simple task title: keyboard-focusable button with focus outline.
- Status communicated via badge + select, not color alone.
- `document.documentElement.lang` reflects active locale.

---

## 11. Manual Sanity Check Results

| Check | Result |
|-------|--------|
| Dev/build at `http://localhost:5173/` | Build passed; dev server compatible with `base: /` |
| Simple Mode board sections | Implemented |
| Project/list dropdown readability | Fixed via global select + option CSS + SelectField |
| Dark/light select contrast | Theme `color-scheme` + option colors |
| Language EN ↔ DE | Settings + sidebar switch |
| Language persistence | `appSettings.language` in localStorage |
| Complex Mode / Project Map | Unchanged routing and views |
| Agent 08 features | Edit, Quick Add, import, ranked clicks preserved |
| Vite `base: "/"` | Unchanged |

Recommend local click-through for dropdown popups on Windows Chrome/Edge in both themes.

---

## 12. Commands Run

```powershell
cd C:\Users\lucak\Desktop\TodoListe\TodoListe
npm run typecheck
npm run build
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
dist/assets/index-t2BjBxLq.css   30.30 kB
dist/assets/index-Bm_PJ73V.js   302.81 kB
✓ built in ~2s
```

---

## 15. Lint / Test Result

- **`npm run lint`** — Not defined; not run.
- **`npm test`** — Not defined; not run.

---

## 16. Remaining Limitations

1. **Task Edit / Create forms** — still many fields; complex hierarchy visible when editing complex-project tasks (by design in edit modal).
2. **Partial i18n** — some secondary strings (backup panel messages, scale test, project form) remain English.
3. **Native select popups** — OS may still vary slightly; `color-scheme` + option CSS mitigates most cases.
4. **No drag-and-drop board** — sections are static lists (safer for current architecture).
5. **Dashboard in Simple Mode** — still shows stats/portfolio (lighter filter only).

---

## 17. Recommended Next Agent or Next Manual Action

| Action | Owner |
|--------|-------|
| **Manual QA** | User — dropdowns in dark/light on Simple List + Quick Add |
| **Extend i18n** | Future agent — backup panel, modals, project form, empty states in complex views |
| **Hetzner deploy** | User — `npm run build`, upload `dist/` when domain live |

---

*End of Agent 08B report.*
