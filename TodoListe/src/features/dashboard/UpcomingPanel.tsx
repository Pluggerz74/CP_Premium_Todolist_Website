import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { isUpcoming } from "../../utils/dates";
import { sortByHighValueScore } from "../../utils/scoring";
import { useI18n } from "../../i18n/useI18n";
import { EmptyState } from "../../components/ui/EmptyState";
import { TaskList } from "../tasks/TaskList";

type UpcomingPanelProps = {
  projects: Project[];
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
};

export function UpcomingPanel({
  projects,
  tasks,
  onStatusChange,
  onDelete,
  onFocus,
  onEdit,
}: UpcomingPanelProps) {
  const { t } = useI18n();
  const upcomingTasks = sortByHighValueScore(
    tasks.filter((task) => task.status !== "done" && isUpcoming(task.dueDate)),
  );

  if (upcomingTasks.length === 0) {
    return (
      <EmptyState variant="subtle" icon="→" title={t("upcoming.empty")} description={t("upcoming.emptyHint")} />
    );
  }

  return (
    <section className="section-block upcoming-view">
      <div className="section-heading">
        <p className="eyebrow">{t("section.upcoming")}</p>
        <h2>{t("view.upcoming")}</h2>
      </div>
      <TaskList
        tasks={upcomingTasks}
        projects={projects}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
        onFocus={onFocus}
        onEdit={onEdit}
      />
    </section>
  );
}
