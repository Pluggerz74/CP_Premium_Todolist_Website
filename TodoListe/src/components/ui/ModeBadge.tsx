import type { ProjectComplexityMode } from "../../types/project";
import { useI18n } from "../../i18n/useI18n";
import { Badge } from "./Badge";

type ModeBadgeProps = {
  mode: ProjectComplexityMode;
};

export function ModeBadge({ mode }: ModeBadgeProps) {
  const { t } = useI18n();
  return (
    <Badge tone={mode === "complex" ? "premium" : "neutral"}>
      {mode === "complex" ? t("mode.complex") : t("mode.simple")}
    </Badge>
  );
}
