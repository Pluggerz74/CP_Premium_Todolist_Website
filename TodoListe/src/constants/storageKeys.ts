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
} as const;

export const STORAGE_VERSION = 2;
