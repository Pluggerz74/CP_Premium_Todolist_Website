import { appConfig } from "../config/app";

export const storageKeys = {
  projects: `${appConfig.localStorageNamespace}:projects`,
  tasks: `${appConfig.localStorageNamespace}:tasks`,
  hierarchy: `${appConfig.localStorageNamespace}:hierarchy`,
  theme: `${appConfig.localStorageNamespace}:theme`,
  activeView: `${appConfig.localStorageNamespace}:active-view`,
  selectedProjectId: `${appConfig.localStorageNamespace}:selected-project-id`,
  appSettings: `${appConfig.localStorageNamespace}:app-settings`,
  taskFilters: `${appConfig.localStorageNamespace}:task-filters`,
  schemaVersion: `${appConfig.localStorageNamespace}:schema-version`,
  storageMeta: `${appConfig.localStorageNamespace}:storage-meta`,
} as const;

/** Current persisted schema version — bump when storage shape changes. */
export const STORAGE_VERSION = 2;

export const storageKeyPrefix = `${appConfig.localStorageNamespace}:`;
