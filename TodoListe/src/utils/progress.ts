import type { ProjectHierarchyStore } from "../types/hierarchy";
import type { Task } from "../types/task";
import type { TaskIndex } from "./taskIndex";

export type ProjectProgress = {
  total: number;
  completed: number;
  percent: number;
};

export type AreaProgress = ProjectProgress & {
  areaId: string;
};

export function getProjectProgress(tasks: Task[]): ProjectProgress {
  const total = tasks.length;
  if (total === 0) return { total: 0, completed: 0, percent: 0 };
  let completed = 0;
  for (const task of tasks) {
    if (task.status === "done") completed += 1;
  }
  return {
    total,
    completed,
    percent: Math.round((completed / total) * 100),
  };
}

export function calculateProjectProgress(projectId: string, tasks: Task[]): number {
  return getProjectProgress(tasks.filter((task) => task.projectId === projectId)).percent;
}

export function calculateProjectProgressFromIndex(index: TaskIndex, projectId: string): number {
  return getProjectProgress(index.byProjectId.get(projectId) ?? []).percent;
}

export function countOpenTasks(projectId: string, tasks: Task[]): number {
  return tasks.filter((task) => task.projectId === projectId && task.status !== "done").length;
}

export function getProgressByArea(
  hierarchy: ProjectHierarchyStore,
  projectId: string,
  index: TaskIndex,
): AreaProgress[] {
  return hierarchy.areas
    .filter((area) => area.projectId === projectId)
    .sort((a, b) => a.order - b.order)
    .map((area) => {
      const areaTasks = index.byAreaId.get(area.id) ?? [];
      return {
        areaId: area.id,
        ...getProjectProgress(areaTasks),
      };
    });
}
