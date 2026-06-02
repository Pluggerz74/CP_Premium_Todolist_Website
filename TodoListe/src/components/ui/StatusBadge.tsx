import type { TaskStatus } from "../../types/task";
import { formatStatusLabel, getStatusTone } from "../../utils/formatLabels";
import { Badge } from "./Badge";

type StatusBadgeProps = {
  status: TaskStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge tone={getStatusTone(status)} className={`badge--status-${status}`}>
      {formatStatusLabel(status)}
    </Badge>
  );
}
