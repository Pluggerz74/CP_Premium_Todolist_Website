import type { TaskStatus } from "../../types/task";
import { getStatusTone } from "../../utils/formatLabels";
import { useI18n } from "../../i18n/useI18n";
import { Badge } from "./Badge";

type StatusBadgeProps = {
  status: TaskStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useI18n();
  const label =
    status === "in-progress"
      ? t("status.inProgress")
      : status === "done"
        ? t("status.done")
        : t("status.todo");

  return (
    <Badge tone={getStatusTone(status)} className={`badge--status-${status}`}>
      {label}
    </Badge>
  );
}
