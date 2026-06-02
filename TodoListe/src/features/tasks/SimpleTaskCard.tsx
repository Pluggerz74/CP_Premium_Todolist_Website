import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { formatDateLabel, getDueDateTone } from "../../utils/dates";
import { formatPrioritySignalLabel, getProjectDisplayName } from "../../utils/formatLabels";
import { useI18n } from "../../i18n/useI18n";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { SelectField } from "../../components/ui/SelectField";
import { cn } from "../../utils/cn";

type SimpleTaskCardProps = {
  task: Task;
  project?: Project;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onFocus?: (taskId: string) => void;
};

export function SimpleTaskCard({
  task,
  project,
  onStatusChange,
  onEdit,
  onDelete,
  onFocus,
}: SimpleTaskCardProps) {
  const { t, language } = useI18n();
  const dueTone = getDueDateTone(task.dueDate);
  const dueClass = dueTone !== "none" ? `simple-task-card__due--${dueTone}` : "";
  const priorityLabel = formatPrioritySignalLabel(task.priority, language);

  return (
    <Card className="simple-task-card">
      <div className="simple-task-card__main">
        <div className="simple-task-card__title-row">
          <span
            className={cn("simple-task-card__priority", `simple-task-card__priority--${task.priority}`)}
            title={priorityLabel}
            aria-label={`${t("label.priority")}: ${priorityLabel}`}
          />
          <button
            type="button"
            className="simple-task-card__title"
            onClick={() => (onEdit ? onEdit(task.id) : onFocus?.(task.id))}
          >
            {task.title}
          </button>
        </div>
        <div className="simple-task-card__meta">
          {project ? (
            <span className="simple-task-card__project">{getProjectDisplayName(project, language)}</span>
          ) : null}
          {task.dueDate ? (
            <span className={cn("simple-task-card__due", dueClass)}>
              {dueTone === "overdue"
                ? t("due.overdue")
                : dueTone === "today"
                  ? t("due.today")
                  : t("due.due")}{" "}
              {formatDateLabel(task.dueDate)}
            </span>
          ) : null}
        </div>
      </div>
      <div className="simple-task-card__actions">
        <SelectField
          value={task.status}
          onChange={(value) => onStatusChange(task.id, value as TaskStatus)}
          aria-label={t("label.status")}
          options={[
            { value: "todo", label: t("status.todo") },
            { value: "in-progress", label: t("status.inProgress") },
            { value: "done", label: t("status.done") },
          ]}
        />
        {onEdit ? (
          <Button variant="ghost" onClick={() => onEdit(task.id)} aria-label={t("btn.editTask")}>
            {t("btn.edit")}
          </Button>
        ) : null}
        {onDelete ? (
          <Button
            variant="ghost"
            onClick={() => onDelete(task.id)}
            aria-label={t("projectManage.deleteAria", { name: task.title })}
          >
            {t("btn.delete")}
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
