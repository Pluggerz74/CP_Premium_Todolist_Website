# Prompt 06: Senior Quality Review For Complex Project Scale

```txt
You are a Senior Full-Stack Code Reviewer, Frontend Architect, and Product Quality Engineer.

Review the complete High Value Todo project for correctness, maintainability, scalability, and deployment readiness.

Local project path:
C:\Users\lucak\Desktop\TodoListe

Product context:
The app supports Simple Mode and Complex Project Mode. Complex projects can represent full game development projects broken into many areas, milestones, epics, task groups, tasks, and subtasks. The app must stay usable, stable, and easy to maintain.

Focus areas:
- TypeScript strictness
- Broken imports
- Dead files
- Component size
- Architecture boundaries
- localStorage safety
- Defensive parsing
- Large dataset rendering risks
- Expensive calculations in render loops
- Derived state and selectors
- Task hierarchy correctness
- Simple Mode usability
- Complex Project Mode usability
- Game project template correctness
- Search and filter behavior
- Collapsible section behavior
- Accessibility basics
- Responsive behavior
- Vite production build
- Hetzner subdirectory compatibility
- Git cleanliness

Project structure to preserve:
src/components
src/features
src/hooks
src/types
src/utils
src/styles
src/data
src/config
src/constants
docs
prompts
.cursor/rules

Tasks:
1. Run npm run typecheck.
2. Run npm run build.
3. Fix all errors.
4. Inspect git status.
5. Do not commit generated dist files.
6. Do not commit node_modules or secrets.
7. Improve only what is necessary for quality, reliability, and maintainability.
8. Review whether massive todo lists are handled with hierarchy, filters, and progressive disclosure instead of one giant flat list.
9. Check whether the game development project template creates useful areas and sections.
10. Check whether task scoring still works:
    highValueScore = impact + urgency - effort
11. Check whether project progress calculations still work with nested or grouped tasks.
12. Check whether Simple Mode still feels simple and not overloaded.
13. Check whether Complex Project Mode has enough structure for large projects.
14. Commit with a clear message, for example:
    Quality review for complex project planning scale

Optional manual test data:
If useful, temporarily generate or inspect demo data with many tasks to see whether the UI remains usable. Do not commit temporary test files unless they are intentionally added as reusable fixtures.

Report:
At the end, summarize:
- what was checked
- what was changed
- build status
- any large-list performance risks
- any architecture risks
- remaining recommendations
```

---
