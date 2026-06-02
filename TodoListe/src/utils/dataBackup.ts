import { storageKeys } from "../constants/storageKeys";
import { demoHierarchy } from "../data/demoHierarchy";
import { demoProjects } from "../data/demoProjects";
import { demoTasks } from "../data/demoTasks";
import type { TaskFilterState } from "../types/appSettings";
import type { ProjectHierarchyStore } from "../types/hierarchy";
import type { Project } from "../types/project";
import type { Task } from "../types/task";
import { defaultTaskFilters } from "./selectors";
import { readStorage, writeStorage } from "./storage";
import { migrateAppSettings, migrateHierarchy, migrateProjects, migrateTasks } from "./migration";
import { recordStorageSuccess, writeStorageMeta } from "./storageMigration";

export type AppDataSnapshot = {
  version: number;
  exportedAt: string;
  projects: Project[];
  tasks: Task[];
  hierarchy: ProjectHierarchyStore;
};

export function exportAppData(): AppDataSnapshot {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    projects: readStorage(storageKeys.projects, demoProjects, migrateProjects),
    tasks: readStorage(storageKeys.tasks, demoTasks, migrateTasks),
    hierarchy: readStorage(storageKeys.hierarchy, demoHierarchy, migrateHierarchy),
  };
}

export function validateBackupSnapshot(snapshot: unknown): { ok: true; data: AppDataSnapshot } | { ok: false; error: string } {
  if (!snapshot || typeof snapshot !== "object") {
    return { ok: false, error: "Invalid backup format" };
  }

  const data = snapshot as Partial<AppDataSnapshot>;
  if (!Array.isArray(data.projects) || !Array.isArray(data.tasks) || !data.hierarchy) {
    return { ok: false, error: "Backup is missing required collections" };
  }

  if (typeof data.hierarchy !== "object" || !Array.isArray((data.hierarchy as ProjectHierarchyStore).areas)) {
    return { ok: false, error: "Backup hierarchy is invalid" };
  }

  return {
    ok: true,
    data: {
      version: typeof data.version === "number" ? data.version : 1,
      exportedAt: typeof data.exportedAt === "string" ? data.exportedAt : new Date().toISOString(),
      projects: data.projects,
      tasks: data.tasks,
      hierarchy: data.hierarchy as ProjectHierarchyStore,
    },
  };
}

export function parseBackupFile(content: string): { ok: true; snapshot: AppDataSnapshot } | { ok: false; error: string } {
  try {
    const parsed: unknown = JSON.parse(content);
    const validated = validateBackupSnapshot(parsed);
    if (!validated.ok) return validated;
    return { ok: true, snapshot: validated.data };
  } catch {
    return { ok: false, error: "Invalid JSON file" };
  }
}

export function importAppData(snapshot: unknown): { ok: true } | { ok: false; error: string } {
  const validated = validateBackupSnapshot(snapshot);
  if (!validated.ok) return validated;

  const data = validated.data;
  writeStorage(storageKeys.projects, migrateProjects(data.projects));
  writeStorage(storageKeys.tasks, migrateTasks(data.tasks));
  writeStorage(storageKeys.hierarchy, migrateHierarchy(data.hierarchy));
  recordStorageSuccess();

  return { ok: true };
}

export function resetToDemoData(): void {
  writeStorage(storageKeys.projects, demoProjects);
  writeStorage(storageKeys.tasks, demoTasks);
  writeStorage(storageKeys.hierarchy, demoHierarchy);
  writeStorage(storageKeys.taskFilters, defaultTaskFilters);
  writeStorage(
    storageKeys.appSettings,
    migrateAppSettings({ complexityMode: "simple", viewDensity: "comfortable", language: "en", collapsedSections: {} }),
  );
  writeStorageMeta({ lastRecoveryAt: new Date().toISOString(), lastError: null });
  recordStorageSuccess();
}

export function downloadAppBackup(): void {
  const snapshot = exportAppData();
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `high-value-todo-backup-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export type DemoResetPayload = {
  projects: Project[];
  tasks: Task[];
  hierarchy: ProjectHierarchyStore;
  filters: TaskFilterState;
};

export function getDemoResetPayload(): DemoResetPayload {
  return {
    projects: demoProjects,
    tasks: demoTasks,
    hierarchy: demoHierarchy,
    filters: defaultTaskFilters,
  };
}
