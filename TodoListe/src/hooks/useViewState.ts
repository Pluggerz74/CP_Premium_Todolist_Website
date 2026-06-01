import { storageKeys } from "../constants/storageKeys";
import type { AppView } from "../types/view";
import { useLocalStorage } from "./useLocalStorage";

export function useViewState() {
  const [activeView, setActiveView] = useLocalStorage<AppView>(storageKeys.activeView, "dashboard");
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage<string | null>(
    storageKeys.selectedProjectId,
    null,
  );

  return { activeView, setActiveView, selectedProjectId, setSelectedProjectId };
}
