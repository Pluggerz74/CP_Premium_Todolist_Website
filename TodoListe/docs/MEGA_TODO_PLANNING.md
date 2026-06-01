# High Value Todo — Mega Planning Document

Source of truth for Simple Mode, Complex Project Mode, hierarchy, templates, and SaaS-ready architecture.

## A. Product Modes

### Simple Mode
- Flat task lists scoped by project or workspace-wide
- Views: Dashboard, Today, Upcoming, High Value, Focus, Simple List
- Minimal fields surfaced: title, status, due date, score
- Fast task creation without hierarchy pickers

### Complex Project Mode
- Full hierarchy: Project → Area → Phase → Milestone → Epic → Task Group → Task → Subtask
- Views: Project Overview, Project Map (tree), Backlog, Area/Milestone drill-down, Compact Table
- Collapsible sections, breadcrumbs, filters, search, density switcher

### Mode Switching
- Global `complexityMode` in app settings (`simple` | `complex`)
- Sidebar mode indicator and toggle in Settings
- Simple projects hide hierarchy navigation; complex projects expose full map

### Shared UI
- App shell, sidebar, top bar, theme toggle, task cards, scoring pills, modals, empty states

### Mode-Specific UI
- Simple: flat lists, fewer filters
- Complex: tree map, breadcrumbs, compact table, hierarchy filters

## B. Complex Project Hierarchy

```
Project
  └── Area
        └── Phase
              └── Milestone
                    └── Epic / Feature
                          └── Task Group
                                └── Task
                                      └── Subtask / Checklist Item
```

Each node: `id`, `projectId`, parent ref, `title`, `description`, `order`, timestamps.

## C. Game Development Areas (Default Template)

Game Design, Core Gameplay, Player Controller, Combat System, World and Levels, UI and Menus, Art and Animation, Audio and Music, Story and Quests, AI and NPCs, Inventory and Items, Save System, Multiplayer or Networking, Tools and Pipeline, Performance Optimization, QA and Bug Fixing, Build and Release, Marketing and Community, Documentation, Post Launch and Live Ops.

## D. Templates

| Template | Mode | Creates |
|----------|------|---------|
| Simple Todo | simple | Project + starter flat tasks |
| Game Development | complex | 20 game areas + sample hierarchy |
| SaaS Product | complex | Product, Engineering, Design, Growth areas |
| Website Project | complex | Content, Design, Frontend, Launch areas |
| Content Project | complex | Strategy, Production, Distribution areas |
| Learning Project | simple | Study goals + weekly tasks |

## E. Data Model

Normalized localStorage collections:
- `projects`, `areas`, `phases`, `milestones`, `epics`, `taskGroups`, `tasks`, `checklistItems`
- Types in `src/types/` with strict TypeScript contracts

## F. Task Fields

`id`, `title`, `description`, `projectId`, `areaId`, `phaseId`, `milestoneId`, `epicId`, `taskGroupId`, `parentTaskId`, `status`, `type`, `priority`, `impact`, `urgency`, `effort`, `highValueScore`, `dueDate`, `startDate`, `tags`, `dependencies`, `blockedBy`, `acceptanceCriteria`, `notes`, `order`, `createdAt`, `updatedAt`, `completedAt`

## G. Navigation and Views

Dashboard, Today, Upcoming, High Value, Focus, Projects, Project Overview, Project Map, Backlog, Search, Simple List, Settings

## H. Large Data UX

Collapsed sections, breadcrumbs, search, multi-filter (project, area, milestone, status, tag, score), density switcher, compact table, progressive disclosure, selector-based derived views, virtualization-ready list architecture.

## I. Scoring

`highValueScore = impact + urgency - effort`

Rankings: global, per-project, per-area, per-milestone. Focus mode surfaces top unscored-open task.

## J. Local-First → SaaS

Storage abstraction via `utils/storage.ts` and hooks. Normalized entities ready for IndexedDB/backend migration. No auth/billing in v1.

## K. Implementation Phases

1. Planning and data model ✓
2. Simple Mode ✓ (this build)
3. Complex Mode foundation ✓ (this build)
4. Game template ✓ (this build)
5. Massive list UX polish (partial — virtualization deferred)
6. SaaS migration prep (architecture only)

## Architecture Summary

Feature-based folders under `src/features/`, reusable UI in `src/components/ui/`, pure logic in `src/utils/`, hooks for state, demo data in `src/data/`.

## Risks

- localStorage size limits for thousands of tasks (mitigate with normalization + future IndexedDB)
- Hierarchy complexity for casual users (mitigate with Simple Mode default)

## Next Steps

Agent 02: GitHub setup. Agent 03+: UI polish, storage hardening, deployment.
