import type { BreadcrumbItem, Epic, Milestone, ProjectArea, ProjectHierarchyStore, ProjectPhase, TaskGroup } from "../types/hierarchy";
import type { Project } from "../types/project";
import type { Task } from "../types/task";
import type { TaskIndex } from "./taskIndex";

export function getProjectAreas(hierarchy: ProjectHierarchyStore, projectId: string): ProjectArea[] {
  return hierarchy.areas.filter((area) => area.projectId === projectId).sort((a, b) => a.order - b.order);
}

export function getAreaPhases(hierarchy: ProjectHierarchyStore, areaId: string): ProjectPhase[] {
  return hierarchy.phases.filter((phase) => phase.areaId === areaId).sort((a, b) => a.order - b.order);
}

export function getPhaseMilestones(hierarchy: ProjectHierarchyStore, phaseId: string): Milestone[] {
  return hierarchy.milestones.filter((milestone) => milestone.phaseId === phaseId).sort((a, b) => a.order - b.order);
}

export function getMilestoneEpics(hierarchy: ProjectHierarchyStore, milestoneId: string): Epic[] {
  return hierarchy.epics.filter((epic) => epic.milestoneId === milestoneId).sort((a, b) => a.order - b.order);
}

export function getEpicTaskGroups(hierarchy: ProjectHierarchyStore, epicId: string): TaskGroup[] {
  return hierarchy.taskGroups.filter((group) => group.epicId === epicId).sort((a, b) => a.order - b.order);
}

export function getTasksForArea(tasks: Task[], areaId: string): Task[] {
  return tasks.filter((task) => task.areaId === areaId).sort((a, b) => a.order - b.order);
}

export function getTasksForMilestone(tasks: Task[], milestoneId: string): Task[] {
  return tasks.filter((task) => task.milestoneId === milestoneId).sort((a, b) => a.order - b.order);
}

export function getTasksForProject(tasks: Task[], projectId: string): Task[] {
  return tasks.filter((task) => task.projectId === projectId).sort((a, b) => a.order - b.order);
}

export function buildTaskBreadcrumbs(
  task: Task,
  hierarchy: ProjectHierarchyStore,
  project?: Project,
): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [];

  if (project) {
    crumbs.push({ level: "area", id: project.id, label: project.name });
  }

  const area = hierarchy.areas.find((item) => item.id === task.areaId);
  if (area) crumbs.push({ level: "area", id: area.id, label: area.title });

  const phase = hierarchy.phases.find((item) => item.id === task.phaseId);
  if (phase) crumbs.push({ level: "phase", id: phase.id, label: phase.title });

  const milestone = hierarchy.milestones.find((item) => item.id === task.milestoneId);
  if (milestone) crumbs.push({ level: "milestone", id: milestone.id, label: milestone.title });

  const epic = hierarchy.epics.find((item) => item.id === task.epicId);
  if (epic) crumbs.push({ level: "epic", id: epic.id, label: epic.title });

  const group = hierarchy.taskGroups.find((item) => item.id === task.taskGroupId);
  if (group) crumbs.push({ level: "taskGroup", id: group.id, label: group.title });

  crumbs.push({ level: "task", id: task.id, label: task.title });

  return crumbs;
}

export type HierarchyTreeNode = {
  id: string;
  type: "area" | "phase" | "milestone" | "epic" | "taskGroup" | "task";
  label: string;
  description: string;
  taskCount: number;
  openTaskCount: number;
  children: HierarchyTreeNode[];
};

function countTaskStats(tasks: Task[]): { taskCount: number; openTaskCount: number } {
  let openTaskCount = 0;
  for (const task of tasks) {
    if (task.status !== "done") openTaskCount += 1;
  }
  return { taskCount: tasks.length, openTaskCount };
}

export function buildProjectTree(
  projectId: string,
  hierarchy: ProjectHierarchyStore,
  index: TaskIndex,
): HierarchyTreeNode[] {
  return getProjectAreas(hierarchy, projectId).map((area) => {
    const areaTasks = index.byAreaId.get(area.id) ?? [];
    const areaStats = countTaskStats(areaTasks);
    const phases = getAreaPhases(hierarchy, area.id);

    return {
      id: area.id,
      type: "area" as const,
      label: area.title,
      description: area.description,
      taskCount: areaStats.taskCount,
      openTaskCount: areaStats.openTaskCount,
      children: phases.map((phase) => {
        const phaseTasks = areaTasks.filter((task) => task.phaseId === phase.id);
        const phaseStats = countTaskStats(phaseTasks);
        const milestones = getPhaseMilestones(hierarchy, phase.id);

        return {
          id: phase.id,
          type: "phase" as const,
          label: phase.title,
          description: phase.description,
          taskCount: phaseStats.taskCount,
          openTaskCount: phaseStats.openTaskCount,
          children: milestones.map((milestone) => {
            const milestoneTasks = index.byMilestoneId.get(milestone.id) ?? phaseTasks.filter((task) => task.milestoneId === milestone.id);
            const milestoneStats = countTaskStats(milestoneTasks);
            const epics = getMilestoneEpics(hierarchy, milestone.id);

            return {
              id: milestone.id,
              type: "milestone" as const,
              label: milestone.title,
              description: milestone.description,
              taskCount: milestoneStats.taskCount,
              openTaskCount: milestoneStats.openTaskCount,
              children: epics.map((epic) => {
                const epicTasks = index.byEpicId.get(epic.id) ?? milestoneTasks.filter((task) => task.epicId === epic.id);
                const epicStats = countTaskStats(epicTasks);
                const groups = getEpicTaskGroups(hierarchy, epic.id);

                return {
                  id: epic.id,
                  type: "epic" as const,
                  label: epic.title,
                  description: epic.description,
                  taskCount: epicStats.taskCount,
                  openTaskCount: epicStats.openTaskCount,
                  children: groups.map((group) => {
                    const groupTasks = index.byTaskGroupId.get(group.id) ?? epicTasks.filter((task) => task.taskGroupId === group.id);
                    const groupStats = countTaskStats(groupTasks);

                    return {
                      id: group.id,
                      type: "taskGroup" as const,
                      label: group.title,
                      description: group.description,
                      taskCount: groupStats.taskCount,
                      openTaskCount: groupStats.openTaskCount,
                      children: groupTasks.map((task) => ({
                        id: task.id,
                        type: "task" as const,
                        label: task.title,
                        description: task.description,
                        taskCount: 1,
                        openTaskCount: task.status !== "done" ? 1 : 0,
                        children: [],
                      })),
                    };
                  }),
                };
              }),
            };
          }),
        };
      }),
    };
  });
}

export function removeProjectHierarchy(hierarchy: ProjectHierarchyStore, projectId: string): ProjectHierarchyStore {
  return {
    areas: hierarchy.areas.filter((item) => item.projectId !== projectId),
    phases: hierarchy.phases.filter((item) => item.projectId !== projectId),
    milestones: hierarchy.milestones.filter((item) => item.projectId !== projectId),
    epics: hierarchy.epics.filter((item) => item.projectId !== projectId),
    taskGroups: hierarchy.taskGroups.filter((item) => item.projectId !== projectId),
    checklistItems: hierarchy.checklistItems.filter((item) => item.projectId !== projectId),
  };
}
