import { storageKeys } from "../constants/storageKeys";
import { demoHierarchy } from "../data/demoHierarchy";
import type { ProjectHierarchyStore } from "../types/hierarchy";
import { removeProjectHierarchy } from "../utils/hierarchy";
import { readStorage } from "../utils/storage";
import { useLocalStorage } from "./useLocalStorage";

export function useHierarchy() {
  const [hierarchy, setHierarchy] = useLocalStorage<ProjectHierarchyStore>(
    storageKeys.hierarchy,
    demoHierarchy,
  );

  function addHierarchy(addition: ProjectHierarchyStore) {
    setHierarchy((current) => ({
      areas: [...current.areas, ...addition.areas],
      phases: [...current.phases, ...addition.phases],
      milestones: [...current.milestones, ...addition.milestones],
      epics: [...current.epics, ...addition.epics],
      taskGroups: [...current.taskGroups, ...addition.taskGroups],
      checklistItems: [...current.checklistItems, ...addition.checklistItems],
    }));
  }

  function removeHierarchyForProject(projectId: string) {
    setHierarchy((current) => removeProjectHierarchy(current, projectId));
  }

  return { hierarchy, setHierarchy, addHierarchy, removeHierarchyForProject };
}

export function readHierarchyFromStorage(): ProjectHierarchyStore {
  return readStorage(storageKeys.hierarchy, demoHierarchy);
}
