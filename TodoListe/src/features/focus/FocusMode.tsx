import type { ProjectHierarchyStore } from "../../types/hierarchy";
import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { buildTaskBreadcrumbs } from "../../utils/hierarchy";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { ScorePill } from "../../components/ui/ScorePill";
import { TaskMetadata } from "../../components/ui/TaskMetadata";

type FocusModeProps = {
  task: Task | null;
  project?: Project;
  hierarchy?: ProjectHierarchyStore;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
};

export function FocusMode({ task, project, hierarchy, onStatusChange }: FocusModeProps) {
  if (!task) {
    return (
      <div className="focus-view">
        <EmptyState
          variant="subtle"
          icon="◎"
          title="No focus task selected"
          description="Choose Focus on a task to enter a clean execution view for your highest-value next action."
        />
      </div>
    );
  }

  const breadcrumbs = hierarchy ? buildTaskBreadcrumbs(task, hierarchy, project) : [];

  return (
    <div className="focus-view">
      <Card className="focus-card">
        <div className="focus-card__top">
          <Badge tone="premium">Focus mode</Badge>
          <ScorePill score={task.highValueScore} />
        </div>
        {breadcrumbs.length > 0 ? <Breadcrumbs items={breadcrumbs} /> : null}
        <h2>{task.title}</h2>
        <p>{task.description}</p>
        {project ? <span className="focus-card__project">Project: {project.name}</span> : null}
        {task.acceptanceCriteria ? (
          <div className="focus-card__criteria">
            <strong>Acceptance criteria</strong>
            <p>{task.acceptanceCriteria}</p>
          </div>
        ) : null}
        <TaskMetadata task={task} variant="focus" />
        <div className="focus-card__actions">
          <Button onClick={() => onStatusChange(task.id, "in-progress")}>Start now</Button>
          <Button variant="secondary" onClick={() => onStatusChange(task.id, "done")}>
            Mark done
          </Button>
        </div>
      </Card>
    </div>
  );
}
