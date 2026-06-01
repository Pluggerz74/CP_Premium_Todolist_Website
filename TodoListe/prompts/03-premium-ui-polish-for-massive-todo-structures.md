# Prompt 03: Premium UI Polish For Massive Todo Structures

```txt
You are a Senior Product Designer, Senior Frontend Engineer, and Senior UX Architect specializing in premium Apple-like SaaS interfaces and complex productivity tools.

Improve the existing UI without breaking the current architecture.

Local project path:
C:\Users\lucak\Desktop\TodoListe

Preserve this structure:
- src/components/ui for reusable UI primitives
- src/components/layout for app shell, sidebar, topbar
- src/features/dashboard for dashboard views
- src/features/tasks for task-specific UI
- src/features/projects for project-specific UI
- src/features/focus for focus mode
- src/features/settings for preferences
- src/styles for global styling and design tokens
- src/types for contracts
- src/utils for business logic

Product direction:
The app must feel like a premium Apple-like Project Command Center. It must support both Simple Mode and Complex Project Mode. Complex projects can contain hundreds or thousands of todos, especially game development projects, so the UI must stay organized and calm even with massive data.

Goal:
Make the app feel expensive, calm, minimal, high-end, and Apple-like while improving clarity for very large task structures.

Improve Simple Mode:
- quick task capture
- clear Today and Upcoming lists
- beautiful High Value ranking
- clean task cards
- fast scanning
- minimal friction

Improve Complex Project Mode:
- project hierarchy clarity
- project map or tree view readability
- collapsible areas
- milestone and epic grouping
- clear breadcrumbs
- compact list or table density
- clear area labels
- filters that are easy to understand
- search UI that feels fast
- visual hierarchy for Project, Area, Phase, Milestone, Epic, Task Group, Task, and Subtask
- avoid visual chaos when many tasks exist

Improve game planning experience:
- make game development areas easy to scan
- show progress by area
- show blockers or dependencies clearly if present
- make QA, bugs, build, release, and core gameplay areas easy to distinguish
- make the user understand where a new todo should go

Improve design system:
- typography scale
- spacing system
- card hierarchy
- task card clarity
- project card polish
- sidebar navigation feel
- focus mode impact
- button hover states
- modal design
- empty states
- light mode
- dark mode
- responsive behavior
- microinteractions
- density modes for comfortable and compact planning

Rules:
- Do not remove features.
- Do not flatten the architecture.
- Do not add large UI libraries.
- Keep CSS maintainable.
- Keep accessibility in mind.
- Make components reusable where it makes sense.
- Keep the app static-deployment friendly.
- Do not introduce backend code.

After changes:
1. Run npm run typecheck.
2. Run npm run build.
3. Fix all errors.
4. Commit with a clear message, for example:
   Improve UI for simple and complex project planning
```

---
