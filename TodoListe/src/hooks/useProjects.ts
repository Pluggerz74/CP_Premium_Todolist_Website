import { ensureInboxInProjects, isInboxProject } from "../constants/inboxProject";
import { storageKeys } from "../constants/storageKeys";
import { demoProjects } from "../data/demoProjects";
import type { Project, ProjectInput } from "../types/project";
import type { ProjectTemplateId } from "../types/template";
import { createId } from "../utils/ids";
import { migrateProjects } from "../utils/migration";
import { createProjectFromTemplate } from "../utils/templates";
import { useLocalStorage } from "./useLocalStorage";

function migrateProjectsWithInbox(value: unknown): Project[] {
  return ensureInboxInProjects(migrateProjects(value));
}

export function useProjects() {
  const [projects, setProjects] = useLocalStorage<Project[]>(
    storageKeys.projects,
    demoProjects,
    migrateProjectsWithInbox,
  );

  function createProject(input: ProjectInput) {
    const now = new Date().toISOString();
    const project: Project = {
      ...input,
      id: createId("project"),
      createdAt: now,
      updatedAt: now,
    };
    setProjects((current) => [project, ...current]);
    return project;
  }

  function createProjectWithTemplate(
    name: string,
    description: string,
    goal: string,
    templateId: ProjectTemplateId,
    addHierarchy: (hierarchy: ReturnType<typeof createProjectFromTemplate>["hierarchy"]) => void,
  ) {
    const { project, hierarchy } = createProjectFromTemplate(name, description, goal, templateId);
    setProjects((current) => [project, ...current]);
    if (project.complexityMode === "complex") {
      addHierarchy(hierarchy);
    }
    return project;
  }

  function updateProject(projectId: string, input: Partial<ProjectInput>) {
    if (isInboxProject(projectId) && input.name !== undefined) {
      return;
    }
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? { ...project, ...input, updatedAt: new Date().toISOString() }
          : project,
      ),
    );
  }

  function deleteProject(projectId: string) {
    if (isInboxProject(projectId)) return;
    setProjects((current) => current.filter((project) => project.id !== projectId));
  }

  return {
    projects,
    setProjects,
    createProject,
    createProjectWithTemplate,
    updateProject,
    deleteProject,
  };
}
