import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import type { ViewDensity } from "../../types/appSettings";
import { useI18n } from "../../i18n/useI18n";
import { EmptyState } from "../../components/ui/EmptyState";
import { TaskList } from "../tasks/TaskList";
import { CompactTaskTable } from "./CompactTaskTable";

type SearchPanelProps = {
  projects: Project[];
  tasks: Task[];
  projectMap?: Map<string, Project>;
  query: string;
  viewDensity: ViewDensity;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
};

export function SearchPanel({
  projects,
  tasks,
  projectMap,
  query,
  viewDensity,
  onStatusChange,
  onDelete,
  onFocus,
  onEdit,
}: SearchPanelProps) {
  const { t } = useI18n();

  if (!query.trim()) {
    return (
      <EmptyState
        title={t("search.emptyTitle")}
        description={t("search.emptyHint")}
      />
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title={t("search.noMatchTitle")}
        description={t("search.noMatchHint", { query })}
      />
    );
  }

  if (viewDensity === "compact") {
    return (
      <CompactTaskTable
        tasks={tasks}
        projects={projects}
        projectMap={projectMap}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
        onFocus={onFocus}
        onEdit={onEdit}
      />
    );
  }

  return (
    <TaskList
      tasks={tasks}
      projects={projects}
      projectMap={projectMap}
      onStatusChange={onStatusChange}
      onDelete={onDelete}
      onFocus={onFocus}
      onEdit={onEdit}
    />
  );
}
