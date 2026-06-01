import type { ProjectHierarchyStore } from "../types/hierarchy";
import type { Task } from "../types/task";
import { createId } from "../utils/ids";
import { calculateHighValueScore } from "../utils/scoring";
import { GAME_DEV_AREAS } from "./templates";

const BASE_DATE = "2026-06-01T08:00:00.000Z";

function makeTask(
  partial: Omit<Task, "highValueScore" | "createdAt" | "updatedAt" | "completedAt"> & { id?: string },
): Task {
  const now = BASE_DATE;
  const task: Task = {
    id: partial.id ?? createId("task"),
    title: partial.title,
    description: partial.description,
    projectId: partial.projectId,
    areaId: partial.areaId ?? null,
    phaseId: partial.phaseId ?? null,
    milestoneId: partial.milestoneId ?? null,
    epicId: partial.epicId ?? null,
    taskGroupId: partial.taskGroupId ?? null,
    parentTaskId: partial.parentTaskId ?? null,
    status: partial.status,
    type: partial.type,
    priority: partial.priority,
    impact: partial.impact,
    urgency: partial.urgency,
    effort: partial.effort,
    highValueScore: 0,
    dueDate: partial.dueDate,
    startDate: partial.startDate ?? null,
    tags: partial.tags,
    dependencies: partial.dependencies,
    blockedBy: partial.blockedBy,
    acceptanceCriteria: partial.acceptanceCriteria,
    notes: partial.notes,
    order: partial.order,
    createdAt: now,
    updatedAt: now,
    completedAt: partial.status === "done" ? now : null,
  };
  task.highValueScore = calculateHighValueScore(task);
  return task;
}

export function buildGameDevHierarchy(projectId: string): ProjectHierarchyStore {
  const areas = GAME_DEV_AREAS.map((title, index) => ({
    id: `${projectId}-area-${index}`,
    projectId,
    title,
    description: `Production lane for ${title.toLowerCase()}.`,
    order: index,
    createdAt: BASE_DATE,
    updatedAt: BASE_DATE,
  }));

  const phases = areas.map((area, index) => ({
    id: `${area.id}-phase-0`,
    projectId,
    areaId: area.id,
    title: "Production",
    description: `Active production phase for ${area.title}.`,
    order: index,
    createdAt: BASE_DATE,
    updatedAt: BASE_DATE,
  }));

  const milestones = phases.map((phase, index) => ({
    id: `${phase.id}-milestone-0`,
    projectId,
    areaId: phase.areaId,
    phaseId: phase.id,
    title: "Alpha Slice",
    description: "First playable or shippable slice for this lane.",
    order: index,
    createdAt: BASE_DATE,
    updatedAt: BASE_DATE,
  }));

  const epics = milestones.map((milestone, index) => ({
    id: `${milestone.id}-epic-0`,
    projectId,
    areaId: milestone.areaId,
    phaseId: milestone.phaseId,
    milestoneId: milestone.id,
    title: "Core Delivery",
    description: "Primary feature set for this milestone.",
    order: index,
    createdAt: BASE_DATE,
    updatedAt: BASE_DATE,
  }));

  const taskGroups = epics.map((epic, index) => ({
    id: `${epic.id}-group-0`,
    projectId,
    areaId: epic.areaId,
    phaseId: epic.phaseId,
    milestoneId: epic.milestoneId,
    epicId: epic.id,
    title: "Implementation",
    description: "Build and validate the core deliverables.",
    order: index,
    createdAt: BASE_DATE,
    updatedAt: BASE_DATE,
  }));

  return { areas, phases, milestones, epics, taskGroups, checklistItems: [] };
}

export function buildGameDevTasks(projectId: string, hierarchy: ProjectHierarchyStore): Task[] {
  const featuredAreas = hierarchy.areas.slice(0, 8);
  const tasks: Task[] = [];

  const gameTaskSeeds = [
    { title: "Define core loop and player fantasy", impact: 5, urgency: 5, effort: 3, tags: ["design"] },
    { title: "Prototype movement and camera feel", impact: 5, urgency: 4, effort: 4, tags: ["gameplay"] },
    { title: "Implement responsive input mapping", impact: 4, urgency: 4, effort: 3, tags: ["controller"] },
    { title: "Design combat encounter framework", impact: 5, urgency: 3, effort: 4, tags: ["combat"] },
    { title: "Block out vertical slice level", impact: 4, urgency: 4, effort: 3, tags: ["levels"] },
    { title: "Wire HUD and pause menu flow", impact: 4, urgency: 3, effort: 2, tags: ["ui"] },
    { title: "Establish art style guide", impact: 4, urgency: 3, effort: 2, tags: ["art"] },
    { title: "Compose exploration theme loop", impact: 3, urgency: 2, effort: 3, tags: ["audio"] },
  ] as const;

  featuredAreas.forEach((area, index) => {
    const phase = hierarchy.phases.find((item) => item.areaId === area.id);
    const milestone = hierarchy.milestones.find((item) => item.areaId === area.id);
    const epic = hierarchy.epics.find((item) => item.areaId === area.id);
    const group = hierarchy.taskGroups.find((item) => item.areaId === area.id);
    const seed = gameTaskSeeds[index];

    if (!phase || !milestone || !epic || !group || !seed) return;

    tasks.push(
      makeTask({
        id: `${projectId}-task-${index}`,
        title: seed.title,
        description: `High-priority work in ${area.title} to advance the vertical slice.`,
        projectId,
        areaId: area.id,
        phaseId: phase.id,
        milestoneId: milestone.id,
        epicId: epic.id,
        taskGroupId: group.id,
        parentTaskId: null,
        status: index === 0 ? "in-progress" : "todo",
        type: "feature",
        priority: seed.impact as Task["priority"],
        impact: seed.impact as Task["impact"],
        urgency: seed.urgency as Task["urgency"],
        effort: seed.effort as Task["effort"],
        dueDate: `2026-06-${String(5 + index).padStart(2, "0")}`,
        startDate: "2026-06-01",
        tags: [...seed.tags, "vertical-slice"],
        dependencies: [],
        blockedBy: [],
        acceptanceCriteria: "Playtest-ready deliverable with clear success criteria.",
        notes: "",
        order: index,
      }),
    );
  });

  return tasks;
}

export function buildSaasHierarchy(projectId: string): ProjectHierarchyStore {
  const areaTitles = [
    "Product Strategy",
    "Backend",
    "Frontend",
    "UI/UX",
    "Systems",
    "QA",
    "Launch",
    "Marketing",
  ];
  return buildTemplateHierarchy(projectId, areaTitles);
}

export function buildWebsiteHierarchy(projectId: string): ProjectHierarchyStore {
  return buildTemplateHierarchy(projectId, ["Content", "Design", "Frontend", "SEO", "Launch"]);
}

function buildTemplateHierarchy(projectId: string, areaTitles: string[]): ProjectHierarchyStore {
  const areas = areaTitles.map((title, index) => ({
    id: `${projectId}-area-${index}`,
    projectId,
    title,
    description: `${title} workstream.`,
    order: index,
    createdAt: BASE_DATE,
    updatedAt: BASE_DATE,
  }));

  const phases = areas.map((area, index) => ({
    id: `${area.id}-phase-0`,
    projectId,
    areaId: area.id,
    title: "Phase 1",
    description: `Initial ${area.title} phase.`,
    order: index,
    createdAt: BASE_DATE,
    updatedAt: BASE_DATE,
  }));

  const milestones = phases.map((phase, index) => ({
    id: `${phase.id}-milestone-0`,
    projectId,
    areaId: phase.areaId,
    phaseId: phase.id,
    title: "MVP Milestone",
    description: "Minimum viable delivery for this area.",
    order: index,
    createdAt: BASE_DATE,
    updatedAt: BASE_DATE,
  }));

  const epics = milestones.map((milestone, index) => ({
    id: `${milestone.id}-epic-0`,
    projectId,
    areaId: milestone.areaId,
    phaseId: milestone.phaseId,
    milestoneId: milestone.id,
    title: "Foundation",
    description: "Core deliverables for this milestone.",
    order: index,
    createdAt: BASE_DATE,
    updatedAt: BASE_DATE,
  }));

  const taskGroups = epics.map((epic, index) => ({
    id: `${epic.id}-group-0`,
    projectId,
    areaId: epic.areaId,
    phaseId: epic.phaseId,
    milestoneId: epic.milestoneId,
    epicId: epic.id,
    title: "Execution",
    description: "Task group for implementation work.",
    order: index,
    createdAt: BASE_DATE,
    updatedAt: BASE_DATE,
  }));

  return { areas, phases, milestones, epics, taskGroups, checklistItems: [] };
}

export function buildSaasTasks(projectId: string, hierarchy: ProjectHierarchyStore): Task[] {
  const seeds = [
    "Define ICP and core value proposition",
    "Design auth and workspace data model",
    "Build dashboard shell and routing",
    "Create design system tokens",
    "Set up CI/CD pipeline",
    "Write critical path test suite",
    "Prepare launch checklist",
    "Draft onboarding email sequence",
  ];

  return seeds.map((title, index) => {
    const area = hierarchy.areas[index];
    const phase = hierarchy.phases.find((item) => item.areaId === area?.id);
    const milestone = hierarchy.milestones.find((item) => item.areaId === area?.id);
    const epic = hierarchy.epics.find((item) => item.areaId === area?.id);
    const group = hierarchy.taskGroups.find((item) => item.areaId === area?.id);

    return makeTask({
      id: `${projectId}-task-${index}`,
      title,
      description: `SaaS launch work in ${area?.title ?? "project"}.`,
      projectId,
      areaId: area?.id ?? null,
      phaseId: phase?.id ?? null,
      milestoneId: milestone?.id ?? null,
      epicId: epic?.id ?? null,
      taskGroupId: group?.id ?? null,
      parentTaskId: null,
      status: "todo",
      type: "task",
      priority: 4,
      impact: 4,
      urgency: 3,
      effort: 3,
      dueDate: `2026-06-${String(10 + index).padStart(2, "0")}`,
      startDate: null,
      tags: ["saas"],
      dependencies: [],
      blockedBy: [],
      acceptanceCriteria: "",
      notes: "",
      order: index,
    });
  });
}

export const emptyHierarchy: ProjectHierarchyStore = {
  areas: [],
  phases: [],
  milestones: [],
  epics: [],
  taskGroups: [],
  checklistItems: [],
};

export const demoHierarchy: ProjectHierarchyStore = (() => {
  const gameId = "project-game-dev";
  const saasId = "project-saas";
  const websiteId = "project-website";

  const game = buildGameDevHierarchy(gameId);
  const saas = buildSaasHierarchy(saasId);
  const website = buildWebsiteHierarchy(websiteId);

  return {
    areas: [...game.areas, ...saas.areas, ...website.areas],
    phases: [...game.phases, ...saas.phases, ...website.phases],
    milestones: [...game.milestones, ...saas.milestones, ...website.milestones],
    epics: [...game.epics, ...saas.epics, ...website.epics],
    taskGroups: [...game.taskGroups, ...saas.taskGroups, ...website.taskGroups],
    checklistItems: [],
  };
})();

export function getDemoComplexTasks(): Task[] {
  const gameId = "project-game-dev";
  const saasId = "project-saas";
  const gameHierarchy = {
    areas: demoHierarchy.areas.filter((a) => a.projectId === gameId),
    phases: demoHierarchy.phases.filter((p) => p.projectId === gameId),
    milestones: demoHierarchy.milestones.filter((m) => m.projectId === gameId),
    epics: demoHierarchy.epics.filter((e) => e.projectId === gameId),
    taskGroups: demoHierarchy.taskGroups.filter((g) => g.projectId === gameId),
    checklistItems: [],
  };

  return [
    ...buildGameDevTasks(gameId, gameHierarchy),
    ...buildSaasTasks(saasId, {
      areas: demoHierarchy.areas.filter((a) => a.projectId === saasId),
      phases: demoHierarchy.phases.filter((p) => p.projectId === saasId),
      milestones: demoHierarchy.milestones.filter((m) => m.projectId === saasId),
      epics: demoHierarchy.epics.filter((e) => e.projectId === saasId),
      taskGroups: demoHierarchy.taskGroups.filter((g) => g.projectId === saasId),
      checklistItems: [],
    }),
  ];
}
