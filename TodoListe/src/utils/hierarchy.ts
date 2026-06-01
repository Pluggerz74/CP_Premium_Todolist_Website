import type { BreadcrumbItem, Epic, Milestone, ProjectArea, ProjectHierarchyStore, ProjectPhase, TaskGroup } from "../types/hierarchy";
import type { Project } from "../types/project";
import type { Task } from "../types/task";

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

export function buildProjectTree(
  projectId: string,
  hierarchy: ProjectHierarchyStore,
  tasks: Task[],
): HierarchyTreeNode[] {
  const projectTasks = getTasksForProject(tasks, projectId);

  return getProjectAreas(hierarchy, projectId).map((area) => {
    const areaTasks = projectTasks.filter((task) => task.areaId === area.id);
    const phases = getAreaPhases(hierarchy, area.id);

    return {
      id: area.id,
      type: "area" as const,
      label: area.title,
      description: area.description,
      taskCount: areaTasks.length,
      openTaskCount: areaTasks.filter((task) => task.status !== "done").length,
      children: phases.map((phase) => {
        const phaseTasks = areaTasks.filter((task) => task.phaseId === phase.id);
        const milestones = getPhaseMilestones(hierarchy, phase.id);

        return {
          id: phase.id,
          type: "phase" as const,
          label: phase.title,
          description: phase.description,
          taskCount: phaseTasks.length,
          openTaskCount: phaseTasks.filter((task) => task.status !== "done").length,
          children: milestones.map((milestone) => {
            const milestoneTasks = phaseTasks.filter((task) => task.milestoneId === milestone.id);
            const epics = getMilestoneEpics(hierarchy, milestone.id);

            return {
              id: milestone.id,
              type: "milestone" as const,
              label: milestone.title,
              description: milestone.description,
              taskCount: milestoneTasks.length,
              openTaskCount: milestoneTasks.filter((task) => task.status !== "done").length,
              children: epics.map((epic) => {
                const epicTasks = milestoneTasks.filter((task) => task.epicId === epic.id);
                const groups = getEpicTaskGroups(hierarchy, epic.id);

                return {
                  id: epic.id,
                  type: "epic" as const,
                  label: epic.title,
                  description: epic.description,
                  taskCount: epicTasks.length,
                  openTaskCount: epicTasks.filter((task) => task.status !== "done").length,
                  children: groups.map((group) => {
                    const groupTasks = epicTasks.filter((task) => task.taskGroupId === group.id);

                    return {
                      id: group.id,
                      type: "taskGroup" as const,
                      label: group.title,
                      description: group.description,
                      taskCount: groupTasks.length,
                      openTaskCount: groupTasks.filter((task) => task.status !== "done").length,
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
