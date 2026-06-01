import type { ProjectHierarchyStore } from "../types/hierarchy";

export function buildTemplateHierarchyFromAreas(
  projectId: string,
  areaTitles: string[],
  timestamp: string,
): ProjectHierarchyStore {
  const areas = areaTitles.map((title, index) => ({
    id: `${projectId}-area-${index}`,
    projectId,
    title,
    description: `${title} workstream.`,
    order: index,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));

  const phases = areas.map((area, index) => ({
    id: `${area.id}-phase-0`,
    projectId,
    areaId: area.id,
    title: "Phase 1",
    description: `Initial phase for ${area.title}.`,
    order: index,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));

  const milestones = phases.map((phase, index) => ({
    id: `${phase.id}-milestone-0`,
    projectId,
    areaId: phase.areaId,
    phaseId: phase.id,
    title: "MVP Milestone",
    description: "Minimum viable delivery.",
    order: index,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));

  const epics = milestones.map((milestone, index) => ({
    id: `${milestone.id}-epic-0`,
    projectId,
    areaId: milestone.areaId,
    phaseId: milestone.phaseId,
    milestoneId: milestone.id,
    title: "Foundation",
    description: "Core deliverables.",
    order: index,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));

  const taskGroups = epics.map((epic, index) => ({
    id: `${epic.id}-group-0`,
    projectId,
    areaId: epic.areaId,
    phaseId: epic.phaseId,
    milestoneId: epic.milestoneId,
    epicId: epic.id,
    title: "Execution",
    description: "Implementation tasks.",
    order: index,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));

  return { areas, phases, milestones, epics, taskGroups, checklistItems: [] };
}
