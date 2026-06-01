import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import type { ViewDensity } from "../../types/appSettings";
import { sortByHighValueScore } from "../../utils/scoring";
import { EmptyState } from "../../components/ui/EmptyState";
import { TaskList } from "../tasks/TaskList";
import { CompactTaskTable } from "./CompactTaskTable";

type BacklogPanelProps = {
  projects: Project[];
  tasks: Task[];
  viewDensity: ViewDensity;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
};

export function BacklogPanel({
  projects,
  tasks,
  viewDensity,
  onStatusChange,
  onDelete,
  onFocus,
}: BacklogPanelProps) {
  const complexProjectIds = new Set(
    projects.filter((project) => project.complexityMode === "complex").map((project) => project.id),
  );
  const backlogTasks = sortByHighValueScore(
    tasks.filter((task) => complexProjectIds.has(task.projectId) && task.status !== "done"),
  );

  if (backlogTasks.length === 0) {
    return (
      <EmptyState
        title="Backlog is clear"
        description="Complex project tasks that are not done will appear here, ranked by high-value score."
      />
    );
  }

  if (viewDensity === "compact") {
    return (
      <CompactTaskTable
        tasks={backlogTasks}
        projects={projects}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
        onFocus={onFocus}
      />
    );
  }

  return (
    <TaskList
      tasks={backlogTasks}
      projects={projects}
      onStatusChange={onStatusChange}
      onDelete={onDelete}
      onFocus={onFocus}
    />
  );
}
