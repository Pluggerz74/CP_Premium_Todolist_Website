import { storageKeys } from "../constants/storageKeys";
import type { Language } from "../i18n/translations";
import { detectDefaultLanguage } from "../i18n/translations";
import type { AppSettings, TaskFilterState } from "../types/appSettings";
import { defaultTaskFilters } from "../utils/selectors";
import { migrateAppSettings, migrateTaskFilters } from "../utils/migration";
import { readStorage } from "../utils/storage";
import { useLocalStorage } from "./useLocalStorage";

const defaultAppSettings: AppSettings = {
  complexityMode: "simple",
  viewDensity: "comfortable",
  language: detectDefaultLanguage(),
  collapsedSections: {},
};

export function useAppSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    storageKeys.appSettings,
    defaultAppSettings,
    migrateAppSettings,
  );

  const [filters, setFilters] = useLocalStorage<TaskFilterState>(
    storageKeys.taskFilters,
    defaultTaskFilters,
    migrateTaskFilters,
  );

  function setComplexityMode(complexityMode: AppSettings["complexityMode"]) {
    setSettings((current) => ({ ...current, complexityMode }));
  }

  function setViewDensity(viewDensity: AppSettings["viewDensity"]) {
    setSettings((current) => ({ ...current, viewDensity }));
  }

  function setLanguage(language: Language) {
    setSettings((current) => ({ ...current, language }));
  }

  function toggleSectionCollapsed(sectionId: string) {
    setSettings((current) => ({
      ...current,
      collapsedSections: {
        ...current.collapsedSections,
        [sectionId]: !current.collapsedSections[sectionId],
      },
    }));
  }

  function isSectionCollapsed(sectionId: string): boolean {
    return Boolean(settings.collapsedSections[sectionId]);
  }

  function updateFilters(partial: Partial<TaskFilterState>) {
    setFilters((current) => ({ ...current, ...partial }));
  }

  function resetFilters() {
    setFilters(defaultTaskFilters);
  }

  return {
    settings,
    filters,
    setComplexityMode,
    setViewDensity,
    setLanguage,
    toggleSectionCollapsed,
    isSectionCollapsed,
    updateFilters,
    resetFilters,
  };
}

export function readAppSettingsFromStorage(): AppSettings {
  return readStorage(storageKeys.appSettings, defaultAppSettings, migrateAppSettings);
}
