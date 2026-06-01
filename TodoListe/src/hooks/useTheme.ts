import { useEffect } from "react";
import { storageKeys } from "../constants/storageKeys";
import type { ThemeMode } from "../types/theme";
import { useLocalStorage } from "./useLocalStorage";

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<ThemeMode>(storageKeys.theme, "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  return { theme, setTheme, toggleTheme };
}
