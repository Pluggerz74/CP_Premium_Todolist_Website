import type { AppSettings } from "../types/appSettings";
import type { Project } from "../types/project";
import type { Task } from "../types/task";
import { calculateHighValueScore } from "./scoring";
import { normalizeTask } from "./selectors";

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
  return {
    complexityMode: value?.complexityMode ?? "simple",
    viewDensity: value?.viewDensity ?? "comfortable",
    collapsedSections: value?.collapsedSections ?? {},
  };
}
