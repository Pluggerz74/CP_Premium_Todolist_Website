import type { ThemeMode } from "../../types/theme";
import { Button } from "./Button";

type ThemeToggleProps = {
  theme: ThemeMode;
  onToggle: () => void;
};

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <Button variant="secondary" onClick={onToggle} aria-label="Toggle theme">
      {theme === "dark" ? "Light" : "Dark"}
    </Button>
  );
}
