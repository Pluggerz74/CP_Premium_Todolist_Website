# Prompt 00: Planning And Scope Lock

```txt
You are a Senior Full-Stack Web Developer, Senior Product Architect, Senior UX Architect, and Senior Game Production Planner.

We are planning changes for an existing Vite React TypeScript project called High Value Todo.

Local project path:
C:\Users\lucak\Desktop\TodoListe

Important instruction:
Do not implement code yet. Do not modify existing source files yet. This prompt is for planning only.

Current product idea:
A premium Apple-like Project Command Center that helps users manage high-value tasks across projects.

New product direction:
The app must support two usage modes:

1. Simple Mode
   For normal personal and business todos.
   It should be fast, minimal, and easy to understand.

2. Complex Project Mode
   For large projects with massive todo structures, especially game development, software products, websites, SaaS builds, content businesses, and long-term creative projects.
   A full game project may be split into hundreds or thousands of todos, so the information architecture must stay clear, searchable, collapsible, and scalable.

Core UX problem:
Large todo lists become unusable when every task is displayed as a flat list. The app must use hierarchy, progressive disclosure, filters, search, project areas, templates, and different views to keep massive projects manageable.

Planning tasks:
1. Inspect the existing project structure.
2. Read the existing docs and prompts if present.
3. Create or update a planning document at:
   docs/MEGA_TODO_PLANNING.md
4. Do not change app functionality yet.
5. Do not rewrite the app yet.

The planning document must define:

A. Product modes
- Simple Mode
- Complex Project Mode
- How a user switches between them
- Which UI elements are shared
- Which UI elements are mode-specific

B. Complex project hierarchy
Define a scalable hierarchy like:
Project
  Area
    Phase
      Milestone
        Epic or Feature
          Task Group
            Task
              Subtask or Checklist Item

C. Game development project areas
Define suggested default areas for a game project, such as:
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

D. Templates
Plan templates for:
- Simple Todo Project
- Game Development Project
- SaaS Product Project
- Website Project
- Content Project
- Learning Project

Each template should create useful areas and starter sections where todos can be organized.

E. Data model direction
Plan TypeScript contracts for:
- Project
- ProjectArea
- ProjectPhase
- Milestone
- Epic
- TaskGroup
- Task
- ChecklistItem
- ProjectTemplate
- ViewMode
- ProjectComplexityMode

F. Task fields
Plan task fields for both simple and complex usage:
- id
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
- type
- priority
- impact
- urgency
- effort
- highValueScore
- dueDate
- startDate
- tags
- dependencies
- blockedBy
- acceptanceCriteria
- notes
- createdAt
- updatedAt
- completedAt
- order

G. Navigation and views
Plan views for:
- Dashboard
- Today
- Upcoming
- High Value
- Projects
- Project Overview
- Project Map
- Backlog
- Area View
- Milestone View
- Epic View
- Focus Mode
- Search Results
- Simple List View
- Complex Tree View
- Compact Table View

H. Large data usability
Plan how to keep the app usable with massive todo data:
- collapsed sections
- breadcrumbs
- search
- filters
- tags
- status filters
- area filters
- milestone filters
- density switcher
- compact table rows
- task grouping
- quick actions
- empty states
- progressive disclosure
- avoid rendering every task at once
- prepare for list virtualization later

I. Scoring and prioritization
Keep the existing core formula:
highValueScore = impact + urgency - effort

Also plan how the score should work inside complex projects:
- rank within a project
- rank within an area
- rank within a milestone
- rank across all projects
- show next best action
- show blockers and dependencies separately

J. Local-first now, SaaS later
Plan a migration path:
- localStorage for MVP
- storage abstraction now
- normalized data structure now
- export/import later
- IndexedDB or backend later for huge data
- SaaS backend later with users, workspaces, database, billing, and collaboration

K. Implementation phases
Create a practical solo-founder implementation roadmap:
Phase 1: Planning and data model
Phase 2: Simple Mode
Phase 3: Complex Project Mode foundation
Phase 4: Game project template
Phase 5: Massive list UX polish
Phase 6: SaaS migration preparation

At the end, provide:
1. A summary of recommended architecture changes.
2. A list of files that should be created or changed later.
3. Risks and tradeoffs.
4. A clear recommendation for the next implementation prompt.

Do not implement code in this prompt. Only create or update the planning document.
```

---
