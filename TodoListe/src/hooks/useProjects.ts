import { storageKeys } from "../constants/storageKeys";
import { demoProjects } from "../data/demoProjects";
import type { Project, ProjectInput } from "../types/project";
import type { ProjectTemplateId } from "../types/template";
import { createId } from "../utils/ids";
import { migrateProjects } from "../utils/migration";
import { createProjectFromTemplate } from "../utils/templates";
import { useLocalStorage } from "./useLocalStorage";

export function useProjects() {
  const [projects, setProjects] = useLocalStorage<Project[]>(storageKeys.projects, demoProjects, migrateProjects);

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
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? { ...project, ...input, updatedAt: new Date().toISOString() }
          : project,
      ),
    );
  }

  return { projects, setProjects, createProject, createProjectWithTemplate, updateProject };
}
