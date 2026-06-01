import { appConfig } from "../config/app";

export const storageKeys = {
  projects: `${appConfig.localStorageNamespace}:projects`,
  tasks: `${appConfig.localStorageNamespace}:tasks`,
  theme: `${appConfig.localStorageNamespace}:theme`,
  activeView: `${appConfig.localStorageNamespace}:active-view`,
  selectedProjectId: `${appConfig.localStorageNamespace}:selected-project-id`,
} as const;
