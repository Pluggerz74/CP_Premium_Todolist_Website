import type { TaskPrioritySignal } from "../../types/task";
import { getPriorityLabel } from "../../utils/formatLabels";
import { cn } from "../../utils/cn";

type PriorityBadgeProps = {
  priority: TaskPrioritySignal | number;
  showLabel?: boolean;
};

export function PriorityBadge({ priority, showLabel = true }: PriorityBadgeProps) {
  return (
    <span className="priority-badge">
      <span
        className={cn("priority-badge__dot", `priority-badge__dot--${priority}`)}
        aria-hidden="true"
      />
      {showLabel ? <span className="priority-badge__label">{getPriorityLabel(priority)}</span> : null}
    </span>
  );
}
