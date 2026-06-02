import type { ThemeMode } from "../../types/theme";
import { useI18n } from "../../i18n/useI18n";
import { Button } from "./Button";

type ThemeToggleProps = {
  theme: ThemeMode;
  onToggle: () => void;
};

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const { t } = useI18n();

  return (
    <Button variant="secondary" onClick={onToggle} aria-label={t("theme.toggle")}>
      {theme === "dark" ? t("theme.light") : t("theme.dark")}
    </Button>
  );
}
