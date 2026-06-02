import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { formatTaskTypeLabel } from "../../utils/formatLabels";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ScorePill } from "../../components/ui/ScorePill";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TagChips } from "../../components/ui/TagChips";
import { TaskMetadata } from "../../components/ui/TaskMetadata";

type TaskCardProps = {
  task: Task;
  project?: Project;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
};

export function TaskCard({ task, project, onStatusChange, onDelete, onFocus }: TaskCardProps) {
  return (
    <Card className="task-card">
      <div className="task-card__header">
        <div>
          <StatusBadge status={task.status} />
          <Badge tone="neutral">{formatTaskTypeLabel(task.type)}</Badge>
          {project ? <span className="task-card__project">{project.name}</span> : null}
        </div>
        <ScorePill score={task.highValueScore} />
      </div>

      <h3>{task.title}</h3>
      <p>{task.description}</p>

      <TagChips tags={task.tags} className="task-card__tags" />

      <TaskMetadata task={task} variant="card" />

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
