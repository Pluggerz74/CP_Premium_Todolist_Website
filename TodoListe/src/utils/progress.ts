import type { Task } from "../types/task";

export function calculateProjectProgress(projectId: string, tasks: Task[]): number {
  const projectTasks = tasks.filter((task) => task.projectId === projectId);
  if (projectTasks.length === 0) return 0;
  const completed = projectTasks.filter((task) => task.status === "done").length;
  return Math.round((completed / projectTasks.length) * 100);
}

export function countOpenTasks(projectId: string, tasks: Task[]): number {
  return tasks.filter((task) => task.projectId === projectId && task.status !== "done").length;
}
