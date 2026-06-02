import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { formatTaskTypeLabel } from "../../utils/formatLabels";
import { useI18n } from "../../i18n/useI18n";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ScorePill } from "../../components/ui/ScorePill";
import { SelectField } from "../../components/ui/SelectField";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TagChips } from "../../components/ui/TagChips";
import { TaskMetadata } from "../../components/ui/TaskMetadata";

type TaskCardProps = {
  task: Task;
  project?: Project;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
};

export function TaskCard({ task, project, onStatusChange, onDelete, onFocus, onEdit }: TaskCardProps) {
  const { t, language } = useI18n();

  return (
    <Card className="task-card">
      <div className="task-card__header">
        <div>
          <StatusBadge status={task.status} />
          <Badge tone="neutral">{formatTaskTypeLabel(task.type, language)}</Badge>
          {project ? <span className="task-card__project">{project.name}</span> : null}
        </div>
        <ScorePill score={task.highValueScore} />
      </div>

      <h3>{task.title}</h3>
      <p>{task.description}</p>

      <TagChips tags={task.tags} className="task-card__tags" />

      <TaskMetadata task={task} variant="card" />

      <div className="task-card__actions">
        {onEdit ? (
          <Button variant="secondary" onClick={() => onEdit(task.id)}>
            {t("btn.edit")}
          </Button>
        ) : null}
        <Button variant="secondary" onClick={() => onFocus(task.id)}>
          {t("btn.focus")}
        </Button>
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
        <Button variant="danger" onClick={() => onDelete(task.id)}>
          {t("btn.delete")}
        </Button>
      </div>
    </Card>
  );
}
