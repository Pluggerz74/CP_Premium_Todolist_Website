import type { Task } from "../../types/task";
import { formatDateLabel, getDueDateTone } from "../../utils/dates";
import { useI18n } from "../../i18n/useI18n";
import { cn } from "../../utils/cn";
import { PriorityBadge } from "./PriorityBadge";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { StatusBadge } from "./StatusBadge";
import { TagChips } from "./TagChips";

type TaskMetadataFields = Pick<
  Task,
  "status" | "priority" | "impact" | "urgency" | "effort" | "tags" | "dueDate"
>;

type TaskMetadataProps = {
  task: TaskMetadataFields;
  variant?: "focus" | "card" | "inline";
  showDueDate?: boolean;
  className?: string;
};

export function TaskMetadata({
  task,
  variant = "card",
  showDueDate = true,
  className,
}: TaskMetadataProps) {
  const { t } = useI18n();
  const dueTone = getDueDateTone(task.dueDate);
  const dueClass = dueTone !== "none" ? `task-metadata__due--${dueTone}` : "";

  if (variant === "focus") {
    return (
      <div className={cn("task-metadata", "task-metadata--focus", className)}>
        <div className="task-metadata__group task-metadata__group--status">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
        <ScoreBreakdown impact={task.impact} urgency={task.urgency} effort={task.effort} />
        <TagChips tags={task.tags} prefix className="task-metadata__tags" />
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("task-metadata", "task-metadata--inline", className)}>
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
        {showDueDate ? (
          <span className={cn("task-metadata__due", dueClass)}>
            {dueTone === "overdue" ? t("due.overdue") : dueTone === "today" ? t("due.today") : t("due.due")}{" "}
            {formatDateLabel(task.dueDate)}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("task-metadata", "task-metadata--card", className)}>
      <PriorityBadge priority={task.priority} />
      {showDueDate ? (
        <span className={cn("task-metadata__due", dueClass)}>
          {dueTone === "overdue" ? "Overdue" : dueTone === "today" ? "Today" : "Due"}{" "}
          {formatDateLabel(task.dueDate)}
        </span>
      ) : null}
      <ScoreBreakdown impact={task.impact} urgency={task.urgency} effort={task.effort} />
    </div>
  );
}
