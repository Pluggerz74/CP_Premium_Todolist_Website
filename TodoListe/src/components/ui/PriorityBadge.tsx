import type { TaskPrioritySignal } from "../../types/task";
import { useI18n } from "../../i18n/useI18n";
import { formatPrioritySignalLabel } from "../../utils/formatLabels";
import { cn } from "../../utils/cn";

type PriorityBadgeProps = {
  priority: TaskPrioritySignal | number;
  showLabel?: boolean;
};

export function PriorityBadge({ priority, showLabel = true }: PriorityBadgeProps) {
  const { language } = useI18n();
  const signal = Math.min(5, Math.max(1, Math.round(priority))) as TaskPrioritySignal;
  const label = formatPrioritySignalLabel(signal, language);

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
