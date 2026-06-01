import { useEffect } from "react";
import { storageKeys } from "../constants/storageKeys";
import type { ThemeMode } from "../types/theme";
import { useLocalStorage } from "./useLocalStorage";

function migrateTheme(value: unknown): ThemeMode {
  return value === "light" ? "light" : "dark";
}

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<ThemeMode>(storageKeys.theme, "dark", migrateTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  return { theme, setTheme, toggleTheme };
}
