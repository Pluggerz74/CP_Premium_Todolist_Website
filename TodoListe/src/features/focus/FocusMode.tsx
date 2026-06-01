import type { ProjectHierarchyStore } from "../../types/hierarchy";
import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { buildTaskBreadcrumbs } from "../../utils/hierarchy";
import { calculateHighValueScore } from "../../utils/scoring";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { ScorePill } from "../../components/ui/ScorePill";

type FocusModeProps = {
  task: Task | null;
  project?: Project;
  hierarchy?: ProjectHierarchyStore;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
};

export function FocusMode({ task, project, hierarchy, onStatusChange }: FocusModeProps) {
  if (!task) {
    return (
      <EmptyState
        title="No focus task selected"
        description="Choose Focus on a task to enter a clean execution view for your highest-value next action."
      />
    );
  }

  const score = calculateHighValueScore(task);
  const breadcrumbs = hierarchy ? buildTaskBreadcrumbs(task, hierarchy, project) : [];

  return (
    <Card className="focus-card">
      <div className="focus-card__top">
        <Badge tone="premium">Focus mode</Badge>
        <ScorePill score={score} />
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
      <div className="focus-card__signals">
        <span>Impact {task.impact}</span>
        <span>Urgency {task.urgency}</span>
        <span>Effort {task.effort}</span>
        {task.tags.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>
      <div className="focus-card__actions">
        <Button onClick={() => onStatusChange(task.id, "in-progress")}>Start now</Button>
        <Button variant="secondary" onClick={() => onStatusChange(task.id, "done")}>
          Mark done
        </Button>
      </div>
    </Card>
  );
}
