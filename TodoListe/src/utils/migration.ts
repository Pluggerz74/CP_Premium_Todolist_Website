import type { AppSettings, TaskFilterState } from "../types/appSettings";
import type {
  ChecklistItem,
  Epic,
  Milestone,
  ProjectArea,
  ProjectHierarchyStore,
  ProjectPhase,
  TaskGroup,
} from "../types/hierarchy";
import type { Project } from "../types/project";
import type { Task } from "../types/task";
import { calculateHighValueScore } from "./scoring";
import { defaultTaskFilters, normalizeTask } from "./selectors";

export const emptyHierarchy: ProjectHierarchyStore = {
  areas: [],
  phases: [],
  milestones: [],
  epics: [],
  taskGroups: [],
  checklistItems: [],
};

function migrateArea(item: unknown): ProjectArea | null {
  const area = item as Partial<ProjectArea>;
  if (!area.id || !area.projectId) return null;
  const now = new Date().toISOString();
  return {
    id: area.id,
    projectId: area.projectId,
    title: area.title ?? "Untitled Area",
    description: area.description ?? "",
    order: area.order ?? 0,
    createdAt: area.createdAt ?? now,
    updatedAt: area.updatedAt ?? now,
  };
}

function migratePhase(item: unknown): ProjectPhase | null {
  const phase = item as Partial<ProjectPhase>;
  if (!phase.id || !phase.projectId || !phase.areaId) return null;
  const now = new Date().toISOString();
  return {
    id: phase.id,
    projectId: phase.projectId,
    areaId: phase.areaId,
    title: phase.title ?? "Untitled Phase",
    description: phase.description ?? "",
    order: phase.order ?? 0,
    createdAt: phase.createdAt ?? now,
    updatedAt: phase.updatedAt ?? now,
  };
}

function migrateMilestone(item: unknown): Milestone | null {
  const milestone = item as Partial<Milestone>;
  if (!milestone.id || !milestone.projectId || !milestone.areaId || !milestone.phaseId) return null;
  const now = new Date().toISOString();
  return {
    id: milestone.id,
    projectId: milestone.projectId,
    areaId: milestone.areaId,
    phaseId: milestone.phaseId,
    title: milestone.title ?? "Untitled Milestone",
    description: milestone.description ?? "",
    order: milestone.order ?? 0,
    createdAt: milestone.createdAt ?? now,
    updatedAt: milestone.updatedAt ?? now,
  };
}

function migrateEpic(item: unknown): Epic | null {
  const epic = item as Partial<Epic>;
  if (!epic.id || !epic.projectId || !epic.areaId || !epic.phaseId || !epic.milestoneId) return null;
  const now = new Date().toISOString();
  return {
    id: epic.id,
    projectId: epic.projectId,
    areaId: epic.areaId,
    phaseId: epic.phaseId,
    milestoneId: epic.milestoneId,
    title: epic.title ?? "Untitled Epic",
    description: epic.description ?? "",
    order: epic.order ?? 0,
    createdAt: epic.createdAt ?? now,
    updatedAt: epic.updatedAt ?? now,
  };
}

function migrateTaskGroup(item: unknown): TaskGroup | null {
  const group = item as Partial<TaskGroup>;
  if (!group.id || !group.projectId || !group.epicId) return null;
  const now = new Date().toISOString();
  return {
    id: group.id,
    projectId: group.projectId,
    areaId: group.areaId ?? "",
    phaseId: group.phaseId ?? "",
    milestoneId: group.milestoneId ?? "",
    epicId: group.epicId,
    title: group.title ?? "Untitled Group",
    description: group.description ?? "",
    order: group.order ?? 0,
    createdAt: group.createdAt ?? now,
    updatedAt: group.updatedAt ?? now,
  };
}

function migrateChecklistItem(item: unknown): ChecklistItem | null {
  const checklistItem = item as Partial<ChecklistItem>;
  if (!checklistItem.id || !checklistItem.taskId || !checklistItem.projectId) return null;
  const now = new Date().toISOString();
  return {
    id: checklistItem.id,
    taskId: checklistItem.taskId,
    projectId: checklistItem.projectId,
    title: checklistItem.title ?? "Checklist item",
    completed: checklistItem.completed ?? false,
    order: checklistItem.order ?? 0,
    createdAt: checklistItem.createdAt ?? now,
    updatedAt: checklistItem.updatedAt ?? now,
  };
}

function filterValid<T>(items: unknown[], migrate: (item: unknown) => T | null): T[] {
  if (!Array.isArray(items)) return [];
  return items.map(migrate).filter((item): item is T => item !== null);
}

export function migrateProjects(projects: unknown): Project[] {
  if (!Array.isArray(projects)) return [];

  return projects.map((item) => {
    const project = item as Partial<Project>;
    const now = project.createdAt ?? new Date().toISOString();
    return {
      id: project.id ?? "",
      name: project.name ?? "Untitled Project",
      description: project.description ?? "",
      status: project.status ?? "active",
      color: project.color ?? "#7c3aed",
      goal: project.goal ?? "",
      complexityMode: project.complexityMode ?? "simple",
      templateId: project.templateId,
      createdAt: now,
      updatedAt: project.updatedAt ?? now,
    };
  });
}

export function migrateTasks(tasks: unknown): Task[] {
  if (!Array.isArray(tasks)) return [];

  return tasks.map((item) => {
    const task = item as Partial<Task>;
    return normalizeTask({
      ...task,
      id: task.id ?? "",
      title: task.title ?? "Untitled Task",
      projectId: task.projectId ?? "",
      highValueScore: task.highValueScore ?? calculateHighValueScore({
        impact: (task.impact ?? 3) as Task["impact"],
        urgency: (task.urgency ?? 3) as Task["urgency"],
        effort: (task.effort ?? 2) as Task["effort"],
      }),
    });
  });
}

export function migrateAppSettings(settings: unknown): AppSettings {
  const value = settings as Partial<AppSettings> | null;
  const complexityMode = value?.complexityMode;
  const viewDensity = value?.viewDensity;
  const language = value?.language;
  return {
    complexityMode: complexityMode === "complex" ? "complex" : "simple",
    viewDensity: viewDensity === "compact" ? "compact" : "comfortable",
    language: language === "de" ? "de" : "en",
    collapsedSections:
      value?.collapsedSections && typeof value.collapsedSections === "object"
        ? value.collapsedSections
        : {},
  };
}

export function migrateTaskFilters(filters: unknown): TaskFilterState {
  const value = filters as Partial<TaskFilterState> | null;
  const status = value?.status;
  const validStatus =
    status === "todo" || status === "in-progress" || status === "done" ? status : "all";

  return {
    searchQuery: typeof value?.searchQuery === "string" ? value.searchQuery : defaultTaskFilters.searchQuery,
    projectId: typeof value?.projectId === "string" ? value.projectId : null,
    areaId: typeof value?.areaId === "string" ? value.areaId : null,
    milestoneId: typeof value?.milestoneId === "string" ? value.milestoneId : null,
    status: validStatus,
    tag: typeof value?.tag === "string" ? value.tag : null,
    minScore: typeof value?.minScore === "number" ? value.minScore : null,
  };
}

export function migrateHierarchy(hierarchy: unknown): ProjectHierarchyStore {
  if (!hierarchy || typeof hierarchy !== "object") return emptyHierarchy;

  const value = hierarchy as Partial<ProjectHierarchyStore>;
  return {
    areas: filterValid(value.areas ?? [], migrateArea),
    phases: filterValid(value.phases ?? [], migratePhase),
    milestones: filterValid(value.milestones ?? [], migrateMilestone),
    epics: filterValid(value.epics ?? [], migrateEpic),
    taskGroups: filterValid(value.taskGroups ?? [], migrateTaskGroup),
    checklistItems: filterValid(value.checklistItems ?? [], migrateChecklistItem),
  };
}
