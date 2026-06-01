import type { TaskFilterState } from "../types/appSettings";
import type { Project } from "../types/project";
import type { Task, TaskStatus } from "../types/task";
import { isToday, isUpcoming } from "./dates";
import { calculateHighValueScore, sortByHighValueScore } from "./scoring";

export const defaultTaskFilters: TaskFilterState = {
  searchQuery: "",
  projectId: null,
  areaId: null,
  milestoneId: null,
  status: "all",
  tag: null,
  minScore: null,
};

export function normalizeTask(task: Partial<Task> & Pick<Task, "id" | "title" | "projectId">): Task {
  const impact = (task.impact ?? 3) as Task["impact"];
  const urgency = (task.urgency ?? 3) as Task["urgency"];
  const effort = (task.effort ?? 2) as Task["effort"];
  const now = task.updatedAt ?? task.createdAt ?? new Date().toISOString();

  const normalized: Task = {
    id: task.id,
    title: task.title,
    description: task.description ?? "",
    projectId: task.projectId,
    areaId: task.areaId ?? null,
    phaseId: task.phaseId ?? null,
    milestoneId: task.milestoneId ?? null,
    epicId: task.epicId ?? null,
    taskGroupId: task.taskGroupId ?? null,
    parentTaskId: task.parentTaskId ?? null,
    status: task.status ?? "todo",
    type: task.type ?? "task",
    priority: task.priority ?? impact,
    impact,
    urgency,
    effort,
    highValueScore: task.highValueScore ?? calculateHighValueScore({ impact, urgency, effort }),
    dueDate: task.dueDate ?? new Date().toISOString().slice(0, 10),
    startDate: task.startDate ?? null,
    tags: task.tags ?? [],
    dependencies: task.dependencies ?? [],
    blockedBy: task.blockedBy ?? [],
    acceptanceCriteria: task.acceptanceCriteria ?? "",
    notes: task.notes ?? "",
    order: task.order ?? 0,
    createdAt: task.createdAt ?? now,
    updatedAt: task.updatedAt ?? now,
    completedAt: task.completedAt ?? null,
  };

  normalized.highValueScore = calculateHighValueScore(normalized);
  return normalized;
}

export function filterTasks(tasks: Task[], filters: TaskFilterState): Task[] {
  const query = filters.searchQuery.trim().toLowerCase();

  return tasks.filter((task) => {
    if (filters.projectId && task.projectId !== filters.projectId) return false;
    if (filters.areaId && task.areaId !== filters.areaId) return false;
    if (filters.milestoneId && task.milestoneId !== filters.milestoneId) return false;
    if (filters.status !== "all" && task.status !== filters.status) return false;
    if (filters.tag && !task.tags.includes(filters.tag)) return false;
    if (filters.minScore !== null && task.highValueScore < filters.minScore) return false;

    if (!query) return true;

    return (
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      task.notes.toLowerCase().includes(query)
    );
  });
}

export function getOpenTasks(tasks: Task[]): Task[] {
  return tasks.filter((task) => task.status !== "done");
}

export function getTodayTasks(tasks: Task[]): Task[] {
  return getOpenTasks(tasks).filter((task) => isToday(task.dueDate));
}

export function getUpcomingTasks(tasks: Task[]): Task[] {
  return getOpenTasks(tasks).filter((task) => isUpcoming(task.dueDate));
}

export function getHighValueTasks(tasks: Task[], limit?: number): Task[] {
  const ranked = sortByHighValueScore(getOpenTasks(tasks));
  return limit ? ranked.slice(0, limit) : ranked;
}

export function getSimpleModeTasks(tasks: Task[], projects: Project[]): Task[] {
  const simpleProjectIds = new Set(
    projects.filter((project) => project.complexityMode === "simple").map((project) => project.id),
  );
  return tasks.filter((task) => simpleProjectIds.has(task.projectId));
}

export function getComplexModeTasks(tasks: Task[], projects: Project[]): Task[] {
  const complexProjectIds = new Set(
    projects.filter((project) => project.complexityMode === "complex").map((project) => project.id),
  );
  return tasks.filter((task) => complexProjectIds.has(task.projectId));
}

export function getAllTags(tasks: Task[]): string[] {
  const tags = new Set<string>();
  tasks.forEach((task) => task.tags.forEach((tag) => tags.add(tag)));
  return [...tags].sort();
}

export function getNextBestAction(tasks: Task[]): Task | null {
  const unblocked = getOpenTasks(tasks).filter((task) => task.blockedBy.length === 0);
  return sortByHighValueScore(unblocked)[0] ?? null;
}

export function applyStatusUpdate(task: Task, status: TaskStatus): Partial<Task> {
  const now = new Date().toISOString();
  return {
    status,
    updatedAt: now,
    completedAt: status === "done" ? now : null,
    highValueScore: calculateHighValueScore(task),
  };
}

export function scopeTasksByProject(tasks: Task[], projectId: string | null): Task[] {
  if (!projectId) return tasks;
  return tasks.filter((task) => task.projectId === projectId);
}

export function scopeTasksByMode(
  tasks: Task[],
  projects: Project[],
  mode: "simple" | "complex" | "all",
): Task[] {
  if (mode === "all") return tasks;
  if (mode === "simple") return getSimpleModeTasks(tasks, projects);
  return getComplexModeTasks(tasks, projects);
}
