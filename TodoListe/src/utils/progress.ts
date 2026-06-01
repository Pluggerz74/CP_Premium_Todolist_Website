import type { Task } from "../types/task";

export type ProjectProgress = {
  total: number;
  completed: number;
  percent: number;
};

export function getProjectProgress(tasks: Task[]): ProjectProgress {
  const total = tasks.length;
  if (total === 0) return { total: 0, completed: 0, percent: 0 };
  const completed = tasks.filter((task) => task.status === "done").length;
  return {
    total,
    completed,
    percent: Math.round((completed / total) * 100),
  };
}

export function calculateProjectProgress(projectId: string, tasks: Task[]): number {
  return getProjectProgress(tasks.filter((task) => task.projectId === projectId)).percent;
}

export function countOpenTasks(projectId: string, tasks: Task[]): number {
  return tasks.filter((task) => task.projectId === projectId && task.status !== "done").length;
}
