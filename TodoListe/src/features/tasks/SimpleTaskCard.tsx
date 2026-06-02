import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { formatDateLabel, getDueDateTone } from "../../utils/dates";
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
  onFocus?: (taskId: string) => void;
};

export function SimpleTaskCard({ task, project, onStatusChange, onEdit, onFocus }: SimpleTaskCardProps) {
  const { t } = useI18n();
  const dueTone = getDueDateTone(task.dueDate);
  const dueClass = dueTone !== "none" ? `simple-task-card__due--${dueTone}` : "";

  return (
    <Card className="simple-task-card">
      <div className="simple-task-card__main">
        <button
          type="button"
          className="simple-task-card__title"
          onClick={() => (onEdit ? onEdit(task.id) : onFocus?.(task.id))}
        >
          {task.title}
        </button>
        <div className="simple-task-card__meta">
          {project ? <span className="simple-task-card__project">{project.name}</span> : null}
          <span className={cn("simple-task-card__due", dueClass)}>
            {dueTone === "overdue"
              ? t("due.overdue")
              : dueTone === "today"
                ? t("due.today")
                : t("due.due")}{" "}
            {formatDateLabel(task.dueDate)}
          </span>
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
          <Button variant="ghost" onClick={() => onEdit(task.id)}>
            {t("btn.edit")}
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
