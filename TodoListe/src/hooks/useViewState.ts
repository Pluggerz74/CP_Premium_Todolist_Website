import { storageKeys } from "../constants/storageKeys";
import type { AppView } from "../types/view";
import { useLocalStorage } from "./useLocalStorage";

const validViews = new Set<AppView>([
  "dashboard",
  "today",
  "upcoming",
  "high-value",
  "focus",
  "projects",
  "project-overview",
  "project-map",
  "backlog",
  "search",
  "simple-list",
  "settings",
]);

function migrateActiveView(value: unknown): AppView {
  return typeof value === "string" && validViews.has(value as AppView) ? (value as AppView) : "dashboard";
}

function migrateSelectedProjectId(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export function useViewState() {
  const [activeView, setActiveView] = useLocalStorage<AppView>(
    storageKeys.activeView,
    "dashboard",
    migrateActiveView,
  );
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage<string | null>(
    storageKeys.selectedProjectId,
    null,
    migrateSelectedProjectId,
  );

  return { activeView, setActiveView, selectedProjectId, setSelectedProjectId };
}
