import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import type { ViewDensity } from "../../types/appSettings";
import { getSimpleModeTasks } from "../../utils/selectors";
import { sortByHighValueScore } from "../../utils/scoring";
import { EmptyState } from "../../components/ui/EmptyState";
import { TaskList } from "../tasks/TaskList";
import { CompactTaskTable } from "./CompactTaskTable";

type SimpleListPanelProps = {
  projects: Project[];
  tasks: Task[];
  viewDensity: ViewDensity;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
};

export function SimpleListPanel({
  projects,
  tasks,
  viewDensity,
  onStatusChange,
  onDelete,
  onFocus,
}: SimpleListPanelProps) {
  const simpleTasks = sortByHighValueScore(getSimpleModeTasks(tasks, projects));

  if (simpleTasks.length === 0) {
    return (
      <EmptyState
        title="No simple tasks yet"
        description="Create a simple project or switch to Simple Mode to manage everyday todos without hierarchy overhead."
      />
    );
  }

  if (viewDensity === "compact") {
    return (
      <CompactTaskTable
        tasks={simpleTasks}
        projects={projects}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
        onFocus={onFocus}
      />
    );
  }

  return (
    <TaskList
      tasks={simpleTasks}
      projects={projects}
      onStatusChange={onStatusChange}
      onDelete={onDelete}
      onFocus={onFocus}
    />
  );
}
