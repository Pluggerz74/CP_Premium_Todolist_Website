import { useMemo } from "react";
import type { Project } from "../types/project";
import type { Task } from "../types/task";
import { buildTaskIndex, type TaskIndex } from "../utils/taskIndex";

export function useTaskIndex(tasks: Task[], projects: Project[]): TaskIndex {
  return useMemo(() => buildTaskIndex(tasks, projects), [tasks, projects]);
}

export function useProjectMap(projects: Project[]): Map<string, Project> {
  return useMemo(() => new Map(projects.map((project) => [project.id, project])), [projects]);
}
