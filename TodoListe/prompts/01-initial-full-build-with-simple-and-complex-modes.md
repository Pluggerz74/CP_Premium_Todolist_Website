# Prompt 01: Initial Full Build With Simple And Complex Modes

```txt
You are a Senior Full-Stack Web Developer, Senior Frontend Architect, Senior Product Designer, and Senior Game Production Tooling Expert.

We are building a premium Apple-like SaaS-ready project command center called High Value Todo.

Local project path:
C:\Users\lucak\Desktop\TodoListe

Hosting target:
Hetzner Webhosting path: Home/public_html/todolist

Important:
The app will be hosted in a subdirectory called /todolist, so keep the Vite production base path set to:
base: "/todolist/"

Before implementation:
1. Inspect the current folder structure.
2. Read docs/MEGA_TODO_PLANNING.md if it exists.
3. Preserve the existing project structure.
4. Use the planning document as the source of truth for Simple Mode, Complex Project Mode, game planning areas, and scalable task hierarchy.
5. If the planning document does not exist, create it first and then continue only with a conservative implementation based on the requirements in this prompt.

Use and preserve this folder structure:

src/
  assets/
  components/
    layout/
    ui/
  config/
  constants/
  data/
  features/
    auth/
    billing/
    dashboard/
    focus/
    projects/
    settings/
    tasks/
    workspaces/
  hooks/
  styles/
  types/
  utils/
  services/
  api/
  lib/
  tests/

docs/
prompts/
.cursor/rules/

Current version requirements:
- React
- Vite
- TypeScript
- localStorage persistence for MVP
- No backend yet
- No authentication yet
- No database yet
- No payments yet
- Static deployment-ready build
- SaaS-ready architecture for later migration

Product USP:
This is not a basic todo list. It is a Project Command Center that helps the user find and execute the highest-value next action across simple todos and massive complex projects.

Core scoring logic:
highValueScore = impact + urgency - effort

New core product requirement:
The app must support two modes:

1. Simple Mode
For everyday todos.
Must feel fast, minimal, clean, and easy.
Use flat task lists, Today, Upcoming, High Value, and Focus Mode.

2. Complex Project Mode
For large projects such as game development, SaaS builds, websites, content systems, and long-term creative projects.
Must prevent massive todo lists from becoming chaotic.
Use hierarchy, areas, phases, milestones, epics, task groups, filters, search, compact views, and collapsible sections.

Complex hierarchy:
Project
  Area
    Phase
      Milestone
        Epic or Feature
          Task Group
            Task
              Subtask or Checklist Item

Create or update TypeScript types for:
- Project
- ProjectArea
- ProjectPhase
- Milestone
- Epic
- TaskGroup
- Task
- ChecklistItem
- ProjectTemplate
- ProjectComplexityMode
- ViewMode
- TaskStatus
- TaskType

Task data should support:
- title
- description
- projectId
- areaId
- phaseId
- milestoneId
- epicId
- taskGroupId
- parentTaskId
- status
- task type
- due date
- start date
- impact
- urgency
- effort
- high-value score
- priority
- tags
- dependencies
- blockedBy
- acceptance criteria
- notes
- order
- createdAt
- updatedAt
- completedAt

Project templates:
Create template logic and demo data for at least:
1. Simple Todo Project
2. Game Development Project
3. SaaS Product Project
4. Website Project

Game Development Project template must create useful default areas, such as:
- Game Design
- Core Gameplay
- Player Controller
- Combat System
- World and Levels
- UI and Menus
- Art and Animation
- Audio and Music
- Story and Quests
- AI and NPCs
- Inventory and Items
- Save System
- Multiplayer or Networking
- Tools and Pipeline
- Performance Optimization
- QA and Bug Fixing
- Build and Release
- Marketing and Community
- Documentation
- Post Launch and Live Ops

Core features to implement:
1. Premium Apple-like dashboard
2. Sidebar with app navigation, projects, and mode indicator
3. Simple Mode task list
4. Complex Project Mode project map or tree view
5. Project cards with progress
6. Task cards with score, status, due date, and project context
7. Today view
8. Upcoming view
9. High-value ranking view
10. Focus mode for the selected next action
11. Task creation modal
12. Project creation modal with template selection
13. Edit-ready architecture for tasks and projects
14. Delete tasks
15. Status updates
16. Light and dark mode
17. localStorage persistence
18. Responsive layout
19. Search and filters for large task sets
20. Collapsible sections for complex projects
21. Compact table or compact list view for large todo lists
22. Empty states that explain how to structure large projects

Large data UX requirements:
- Never rely only on one giant flat list.
- Use progressive disclosure.
- Add filtering by project, area, milestone, status, tag, and score.
- Add quick search architecture.
- Keep list rendering efficient and avoid unnecessary re-renders.
- Prepare architecture for virtualization later, even if no virtualization library is added now.
- Use normalized state where practical.
- Keep derived views in selectors or utilities where practical.

Implementation rules:
- Keep reusable UI in src/components/ui.
- Keep layout components in src/components/layout.
- Keep product modules in src/features.
- Keep pure business logic in src/utils.
- Keep reusable React state logic in src/hooks.
- Keep shared contracts in src/types.
- Keep demo data in src/data.
- Keep app-level configuration in src/config.
- Keep localStorage keys in src/constants.
- Do not move files into a flat structure.
- Do not add unnecessary dependencies.
- Keep TypeScript strict and clean.
- No broken imports.
- No unfinished components.
- Do not implement backend code yet.
- Do not add authentication yet.
- Do not add payments yet.

Design direction:
- Apple-like
- Premium SaaS
- Calm
- High-end
- Minimal
- Spacious
- Smooth hover states
- Soft shadows
- Subtle glassmorphism
- Large typography
- Clear hierarchy
- Beautiful empty states
- Great usability for massive projects
- Dense mode for complex planning
- Clear visual separation between project levels

Quality checks:
1. Run npm install if needed.
2. Run npm run typecheck.
3. Run npm run build.
4. Fix all errors.
5. Show final status.

Commit message suggestion:
Build simple and complex project command center foundation
```

---
