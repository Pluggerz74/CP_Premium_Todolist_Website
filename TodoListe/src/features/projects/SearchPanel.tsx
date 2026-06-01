import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import type { ViewDensity } from "../../types/appSettings";
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
}: SearchPanelProps) {
  if (!query.trim()) {
    return (
      <EmptyState
        title="Search your workspace"
        description="Use the search field above to find tasks by title, description, tags, or notes across all projects."
      />
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No matching tasks"
        description={`Nothing matched "${query}". Try a different keyword or reset your filters.`}
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
    />
  );
}
