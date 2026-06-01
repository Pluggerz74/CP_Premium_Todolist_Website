import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { formatDateLabel } from "../../utils/dates";
import {
  formatStatusLabel,
  formatTaskTypeLabel,
  getPriorityLabel,
  getStatusTone,
} from "../../utils/formatLabels";
import { cn } from "../../utils/cn";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ScorePill } from "../../components/ui/ScorePill";

type TaskCardProps = {
  task: Task;
  project?: Project;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
};

export function TaskCard({ task, project, onStatusChange, onDelete, onFocus }: TaskCardProps) {
  const statusTone = getStatusTone(task.status);

  return (
    <Card className="task-card">
      <div className="task-card__header">
        <div>
          <Badge tone={statusTone} className={`badge--status-${task.status}`}>
            {formatStatusLabel(task.status)}
          </Badge>
          <Badge tone="neutral">{formatTaskTypeLabel(task.type)}</Badge>
          {project ? <span className="task-card__project">{project.name}</span> : null}
        </div>
        <ScorePill score={task.highValueScore} />
      </div>

      <h3>{task.title}</h3>
      <p>{task.description}</p>

      {task.tags.length > 0 ? (
        <div className="task-card__tags">
          {task.tags.map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="task-card__meta">
        <span className="task-card__priority">
          <span
            className={cn("task-card__priority-dot", `task-card__priority-dot--${task.priority}`)}
            aria-hidden="true"
          />
          {getPriorityLabel(task.priority)}
        </span>
        <span>Due {formatDateLabel(task.dueDate)}</span>
        <span>Impact {task.impact}</span>
        <span>Urgency {task.urgency}</span>
        <span>Effort {task.effort}</span>
      </div>

      <div className="task-card__actions">
        <Button variant="secondary" onClick={() => onFocus(task.id)}>
          Focus
        </Button>
        <select
          value={task.status}
          onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)}
          aria-label="Task status"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
        <Button variant="danger" onClick={() => onDelete(task.id)}>
          Delete
        </Button>
      </div>
    </Card>
  );
}
