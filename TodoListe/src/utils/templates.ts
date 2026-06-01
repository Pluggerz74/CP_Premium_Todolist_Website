import type { ProjectHierarchyStore } from "../types/hierarchy";
import type { Project } from "../types/project";
import type { ProjectTemplateId } from "../types/template";
import { getTemplateById } from "../data/templates";
import { buildTemplateHierarchyFromAreas } from "./hierarchyBuilder";
import { createId } from "./ids";

export type TemplateInstantiation = {
  project: Project;
  hierarchy: ProjectHierarchyStore;
};

export function createProjectFromTemplate(
  name: string,
  description: string,
  goal: string,
  templateId: ProjectTemplateId,
): TemplateInstantiation {
  const template = getTemplateById(templateId);
  if (!template) {
    throw new Error(`Unknown template: ${templateId}`);
  }

  const projectId = createId("project");
  const now = new Date().toISOString();

  const project: Project = {
    id: projectId,
    name: name.trim(),
    description: description.trim() || template.description,
    goal: goal.trim() || template.defaultGoal,
    status: "active",
    color: template.defaultColor,
    complexityMode: template.complexityMode,
    templateId: template.id,
    createdAt: now,
    updatedAt: now,
  };

  const hierarchy =
    template.complexityMode === "complex"
      ? buildTemplateHierarchyFromAreas(projectId, template.areaTitles, now)
      : { areas: [], phases: [], milestones: [], epics: [], taskGroups: [], checklistItems: [] };

  return { project, hierarchy };
}

export function appendHierarchy(
  current: ProjectHierarchyStore,
  addition: ProjectHierarchyStore,
): ProjectHierarchyStore {
  return {
    areas: [...current.areas, ...addition.areas],
    phases: [...current.phases, ...addition.phases],
    milestones: [...current.milestones, ...addition.milestones],
    epics: [...current.epics, ...addition.epics],
    taskGroups: [...current.taskGroups, ...addition.taskGroups],
    checklistItems: [...current.checklistItems, ...addition.checklistItems],
  };
}
