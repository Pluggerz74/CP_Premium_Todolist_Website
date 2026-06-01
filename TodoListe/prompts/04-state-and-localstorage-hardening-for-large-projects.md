# Prompt 04: State And LocalStorage Hardening For Large Projects

```txt
You are a Senior Frontend Architect specializing in local-first apps, large client-side datasets, and future SaaS migrations.

Review and improve the localStorage and state architecture for the High Value Todo app.

Local project path:
C:\Users\lucak\Desktop\TodoListe

Preserve this structure:
- src/hooks/useLocalStorage.ts
- src/hooks/useProjects.ts
- src/hooks/useTasks.ts
- src/hooks/useTheme.ts
- src/hooks/useViewState.ts
- src/utils/storage.ts
- src/constants/storageKeys.ts
- src/data/demoProjects.ts
- src/data/demoTasks.ts
- src/types/
- src/utils/

Product context:
The app supports Simple Mode and Complex Project Mode. Complex projects, especially game development projects, can eventually contain hundreds or thousands of todos. Version 1 still uses localStorage, but the architecture must be ready for IndexedDB or a backend later.

Goals:
1. Make browser persistence reliable.
2. Keep localStorage implementation isolated so it can later be replaced by IndexedDB or an API.
3. Prevent crashes from malformed localStorage data.
4. Keep demo data as first-run seed data.
5. Keep project, area, milestone, epic, task group, task, and checklist types strict.
6. Make reset, export, import, backup, and migration architecture easy to add later.
7. Avoid unnecessary re-renders with large task sets.
8. Keep derived views separate from raw storage.

Architecture requirements:
- Keep storage keys centralized in src/constants/storageKeys.ts.
- Keep parsing and validation defensive.
- Use normalized state where practical.
- Keep relationships stable through ids, not nested mutable objects everywhere.
- Keep selectors or utility functions for derived views, such as:
  - tasks by project
  - tasks by area
  - tasks by milestone
  - high-value tasks
  - today tasks
  - upcoming tasks
  - blocked tasks
  - child tasks
  - progress by area
  - progress by project
- Keep view state separate from persisted business data where practical.
- Store collapsed UI sections separately from tasks if persistence is needed.
- Do not store secrets.
- Do not introduce backend code yet.
- Do not add IndexedDB yet unless explicitly approved.

Large data precautions:
- localStorage has practical size limits, so keep the implementation modular and ready to migrate.
- Avoid duplicating large derived datasets in storage.
- Avoid storing rendered UI state inside task records unless necessary.
- Avoid expensive calculations directly inside render loops.
- Prepare for list virtualization later.

Tasks:
- Inspect the current storage utilities and hooks.
- Improve error handling if needed.
- Add or update utility functions for filtering, grouping, and scoring large project task data.
- Ensure Simple Mode and Complex Project Mode can use the same underlying data safely.
- Keep the current UI behavior intact unless a small adjustment is needed for correctness.

After changes:
1. Run npm run typecheck.
2. Run npm run build.
3. Commit with a clear message, for example:
   Harden state architecture for large project planning
```

---
