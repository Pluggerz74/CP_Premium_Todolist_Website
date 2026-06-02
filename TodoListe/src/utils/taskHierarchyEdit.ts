import type { ProjectHierarchyStore } from "../types/hierarchy";
import { getProjectAreas } from "./hierarchy";

export type HierarchySelection = {
  areaId: string | null;
  phaseId: string | null;
  milestoneId: string | null;
  epicId: string | null;
  taskGroupId: string | null;
};

/** Clears invalid hierarchy references without auto-assigning new parents. */
export function validateHierarchySelection(
  hierarchy: ProjectHierarchyStore,
  projectId: string,
  selection: HierarchySelection,
): HierarchySelection {
  if (!selection.areaId) {
    return { areaId: null, phaseId: null, milestoneId: null, epicId: null, taskGroupId: null };
  }

  const area = getProjectAreas(hierarchy, projectId).find((item) => item.id === selection.areaId);
  if (!area) {
    return { areaId: null, phaseId: null, milestoneId: null, epicId: null, taskGroupId: null };
  }

  const phase = selection.phaseId
    ? hierarchy.phases.find((item) => item.id === selection.phaseId && item.areaId === area.id)
    : undefined;
  if (!phase) {
    return { areaId: area.id, phaseId: null, milestoneId: null, epicId: null, taskGroupId: null };
  }

  const milestone = selection.milestoneId
    ? hierarchy.milestones.find((item) => item.id === selection.milestoneId && item.phaseId === phase.id)
    : undefined;
  if (!milestone) {
    return { areaId: area.id, phaseId: phase.id, milestoneId: null, epicId: null, taskGroupId: null };
  }

  const epic = selection.epicId
    ? hierarchy.epics.find((item) => item.id === selection.epicId && item.milestoneId === milestone.id)
    : undefined;
  if (!epic) {
    return {
      areaId: area.id,
      phaseId: phase.id,
      milestoneId: milestone.id,
      epicId: null,
      taskGroupId: null,
    };
  }

  const taskGroup = selection.taskGroupId
    ? hierarchy.taskGroups.find((item) => item.id === selection.taskGroupId && item.epicId === epic.id)
    : undefined;

  return {
    areaId: area.id,
    phaseId: phase.id,
    milestoneId: milestone.id,
    epicId: epic.id,
    taskGroupId: taskGroup?.id ?? null,
  };
}
