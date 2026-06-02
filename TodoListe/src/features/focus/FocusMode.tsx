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
import { useI18n } from "../../i18n/useI18n";
import { TaskMetadata } from "../../components/ui/TaskMetadata";

type FocusModeProps = {
  task: Task | null;
  project?: Project;
  hierarchy?: ProjectHierarchyStore;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onEdit?: (taskId: string) => void;
};

export function FocusMode({ task, project, hierarchy, onStatusChange, onEdit }: FocusModeProps) {
  const { t } = useI18n();

  if (!task) {
    return (
      <div className="focus-view">
        <EmptyState
          variant="subtle"
          icon="◎"
          title={t("focus.empty")}
          description={t("focus.emptyHint")}
        />
      </div>
    );
  }

  const breadcrumbs = hierarchy ? buildTaskBreadcrumbs(task, hierarchy, project) : [];

  return (
    <div className="focus-view">
      <Card className="focus-card">
        <div className="focus-card__top">
          <Badge tone="premium">{t("focus.badge")}</Badge>
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
          {onEdit ? (
            <Button variant="secondary" onClick={() => onEdit(task.id)}>
              {t("btn.editTask")}
            </Button>
          ) : null}
          <Button onClick={() => onStatusChange(task.id, "in-progress")}>{t("btn.startNow")}</Button>
          <Button variant="secondary" onClick={() => onStatusChange(task.id, "done")}>
            {t("btn.markDone")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
