import { storageKeys, STORAGE_VERSION } from "../constants/storageKeys";
import { demoHierarchy } from "../data/demoHierarchy";
import { demoProjects } from "../data/demoProjects";
import { demoTasks } from "../data/demoTasks";
import {
  migrateAppSettings,
  migrateHierarchy,
  migrateProjects,
  migrateTaskFilters,
  migrateTasks,
} from "./migration";
import { readStorage, removeStorage, writeStorage } from "./storage";

export type StorageMeta = {
  version: number;
  lastWriteAt: string | null;
  lastError: string | null;
  lastRecoveryAt: string | null;
};

export type StorageInitResult = {
  migrated: boolean;
  fromVersion: number;
  toVersion: number;
  warnings: string[];
};

const defaultStorageMeta: StorageMeta = {
  version: STORAGE_VERSION,
  lastWriteAt: null,
  lastError: null,
  lastRecoveryAt: null,
};

export function getStoredSchemaVersion(): number {
  const version = readStorage<number>(storageKeys.schemaVersion, 0);
  return typeof version === "number" && version >= 0 ? version : 0;
}

export function readStorageMeta(): StorageMeta {
  return readStorage(storageKeys.storageMeta, defaultStorageMeta, (value) => {
    const meta = value as Partial<StorageMeta>;
    return {
      version: typeof meta.version === "number" ? meta.version : STORAGE_VERSION,
      lastWriteAt: typeof meta.lastWriteAt === "string" ? meta.lastWriteAt : null,
      lastError: typeof meta.lastError === "string" ? meta.lastError : null,
      lastRecoveryAt: typeof meta.lastRecoveryAt === "string" ? meta.lastRecoveryAt : null,
    };
  });
}

export function writeStorageMeta(partial: Partial<StorageMeta>): void {
  const current = readStorageMeta();
  writeStorage(storageKeys.storageMeta, { ...current, ...partial });
}

export function recordStorageError(message: string): void {
  writeStorageMeta({ lastError: message, lastWriteAt: new Date().toISOString() });
}

export function recordStorageSuccess(): void {
  writeStorageMeta({
    lastError: null,
    lastWriteAt: new Date().toISOString(),
    version: STORAGE_VERSION,
  });
}

function revalidateEntityStores(): string[] {
  const warnings: string[] = [];

  const projects = readStorage(storageKeys.projects, demoProjects, migrateProjects);
  const tasks = readStorage(storageKeys.tasks, demoTasks, migrateTasks);
  const hierarchy = readStorage(storageKeys.hierarchy, demoHierarchy, migrateHierarchy);
  const settings = readStorage(storageKeys.appSettings, migrateAppSettings({}), migrateAppSettings);
  const filters = readStorage(storageKeys.taskFilters, migrateTaskFilters({}), migrateTaskFilters);

  writeStorage(storageKeys.projects, projects);
  writeStorage(storageKeys.tasks, tasks);
  writeStorage(storageKeys.hierarchy, hierarchy);
  writeStorage(storageKeys.appSettings, settings);
  writeStorage(storageKeys.taskFilters, filters);

  if (projects.length === 0) warnings.push("Projects store was empty after migration — demo seed may apply on next load.");
  if (tasks.length === 0) warnings.push("Tasks store was empty after migration.");

  return warnings;
}

export function initializeAppStorage(): StorageInitResult {
  const fromVersion = getStoredSchemaVersion();
  const warnings: string[] = [];

  if (fromVersion < STORAGE_VERSION) {
    warnings.push(...revalidateEntityStores());
    writeStorage(storageKeys.schemaVersion, STORAGE_VERSION);
    writeStorageMeta({
      version: STORAGE_VERSION,
      lastRecoveryAt: fromVersion === 0 ? null : new Date().toISOString(),
    });
  }

  recordStorageSuccess();

  return {
    migrated: fromVersion < STORAGE_VERSION,
    fromVersion,
    toVersion: STORAGE_VERSION,
    warnings,
  };
}

export function clearAppStorage(): void {
  Object.values(storageKeys).forEach((key) => removeStorage(key));
}

export function getDemoDataSnapshot() {
  return {
    projects: demoProjects,
    tasks: demoTasks,
    hierarchy: demoHierarchy,
  };
}
