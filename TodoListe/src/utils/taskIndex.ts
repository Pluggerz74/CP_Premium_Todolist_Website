import type { Project } from "../types/project";
import type { Task } from "../types/task";

export type TaskIndex = {
  byId: Map<string, Task>;
  byProjectId: Map<string, Task[]>;
  byAreaId: Map<string, Task[]>;
  byPhaseId: Map<string, Task[]>;
  byMilestoneId: Map<string, Task[]>;
  byEpicId: Map<string, Task[]>;
  byTaskGroupId: Map<string, Task[]>;
  byParentTaskId: Map<string, Task[]>;
  allTags: string[];
  simpleProjectIds: Set<string>;
  complexProjectIds: Set<string>;
};

function pushToMap(map: Map<string, Task[]>, key: string, task: Task): void {
  const bucket = map.get(key);
  if (bucket) {
    bucket.push(task);
  } else {
    map.set(key, [task]);
  }
}

export function buildTaskIndex(tasks: Task[], projects: Project[]): TaskIndex {
  const byId = new Map<string, Task>();
  const byProjectId = new Map<string, Task[]>();
  const byAreaId = new Map<string, Task[]>();
  const byPhaseId = new Map<string, Task[]>();
  const byMilestoneId = new Map<string, Task[]>();
  const byEpicId = new Map<string, Task[]>();
  const byTaskGroupId = new Map<string, Task[]>();
  const byParentTaskId = new Map<string, Task[]>();
  const tagSet = new Set<string>();

  for (const task of tasks) {
    byId.set(task.id, task);
    pushToMap(byProjectId, task.projectId, task);

    if (task.areaId) pushToMap(byAreaId, task.areaId, task);
    if (task.phaseId) pushToMap(byPhaseId, task.phaseId, task);
    if (task.milestoneId) pushToMap(byMilestoneId, task.milestoneId, task);
    if (task.epicId) pushToMap(byEpicId, task.epicId, task);
    if (task.taskGroupId) pushToMap(byTaskGroupId, task.taskGroupId, task);
    if (task.parentTaskId) pushToMap(byParentTaskId, task.parentTaskId, task);

    for (const tag of task.tags) tagSet.add(tag);
  }

  const simpleProjectIds = new Set<string>();
  const complexProjectIds = new Set<string>();
  for (const project of projects) {
    if (project.complexityMode === "simple") {
      simpleProjectIds.add(project.id);
    } else {
      complexProjectIds.add(project.id);
    }
  }

  return {
    byId,
    byProjectId,
    byAreaId,
    byPhaseId,
    byMilestoneId,
    byEpicId,
    byTaskGroupId,
    byParentTaskId,
    allTags: [...tagSet].sort(),
    simpleProjectIds,
    complexProjectIds,
  };
}

export function getTasksFromIndex(index: TaskIndex, bucket: Map<string, Task[]>, key: string): Task[] {
  return bucket.get(key) ?? [];
}

export function buildProjectMap(projects: Project[]): Map<string, Project> {
  return new Map(projects.map((project) => [project.id, project]));
}

/** Minimum task count before virtual scrolling activates. */
export const VIRTUAL_LIST_THRESHOLD = 40;
