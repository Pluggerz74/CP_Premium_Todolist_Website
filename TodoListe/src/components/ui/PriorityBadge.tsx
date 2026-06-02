import type { TaskPrioritySignal } from "../../types/task";
import { useI18n } from "../../i18n/useI18n";
import { cn } from "../../utils/cn";

type PriorityBadgeProps = {
  priority: TaskPrioritySignal | number;
  showLabel?: boolean;
};

export function PriorityBadge({ priority, showLabel = true }: PriorityBadgeProps) {
  const { t } = useI18n();
  const label =
    priority >= 5
      ? t("priority.critical")
      : priority >= 4
        ? t("priority.high")
        : priority >= 3
          ? t("priority.medium")
          : priority >= 2
            ? t("priority.low")
            : t("priority.minimal");

  return (
    <span className="priority-badge">
      <span
        className={cn("priority-badge__dot", `priority-badge__dot--${priority}`)}
        aria-hidden="true"
      />
      {showLabel ? <span className="priority-badge__label">{label}</span> : null}
    </span>
  );
}
