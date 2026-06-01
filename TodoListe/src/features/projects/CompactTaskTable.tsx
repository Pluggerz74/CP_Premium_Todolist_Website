import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { formatDateLabel } from "../../utils/dates";
import { getScoreLabel } from "../../utils/scoring";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";

type CompactTaskTableProps = {
  tasks: Task[];
  projects: Project[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
};

export function CompactTaskTable({ tasks, projects, onStatusChange, onDelete, onFocus }: CompactTaskTableProps) {
  if (tasks.length === 0) {
    return <EmptyState title="No tasks" description="This section has no tasks yet." />;
  }

  return (
    <div className="compact-table" role="table" aria-label="Tasks">
      <div className="compact-table__head" role="row">
        <span role="columnheader">Task</span>
        <span role="columnheader">Project</span>
        <span role="columnheader">Status</span>
        <span role="columnheader">Score</span>
        <span role="columnheader">Due</span>
        <span role="columnheader">Actions</span>
      </div>
      {tasks.map((task) => {
        const project = projects.find((item) => item.id === task.projectId);
        return (
          <div key={task.id} className="compact-table__row" role="row">
            <div className="compact-table__title" role="cell">
              <strong>{task.title}</strong>
              {task.tags.length > 0 ? (
                <span className="compact-table__tags">{task.tags.join(", ")}</span>
              ) : null}
            </div>
            <span role="cell">{project?.name ?? "—"}</span>
            <span role="cell">
              <select
                value={task.status}
                onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)}
                aria-label={`Status for ${task.title}`}
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </span>
            <span role="cell" title={getScoreLabel(task.highValueScore)}>
              {task.highValueScore}
            </span>
            <span role="cell">{formatDateLabel(task.dueDate)}</span>
            <span className="compact-table__actions" role="cell">
              <Button variant="ghost" onClick={() => onFocus(task.id)}>
                Focus
              </Button>
              <Button variant="danger" onClick={() => onDelete(task.id)}>
                Delete
              </Button>
            </span>
          </div>
        );
      })}
    </div>
  );
}
