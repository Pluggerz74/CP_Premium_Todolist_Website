import { storageKeys } from "../constants/storageKeys";
import { demoProjects } from "../data/demoProjects";
import type { Project, ProjectInput } from "../types/project";
import { createId } from "../utils/ids";
import { useLocalStorage } from "./useLocalStorage";

export function useProjects() {
  const [projects, setProjects] = useLocalStorage<Project[]>(storageKeys.projects, demoProjects);

  function createProject(input: ProjectInput) {
    const project: Project = {
      ...input,
      id: createId("project"),
      createdAt: new Date().toISOString(),
    };
    setProjects((current) => [project, ...current]);
  }

  return { projects, setProjects, createProject };
}
