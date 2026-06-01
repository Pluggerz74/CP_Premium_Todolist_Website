import { useMemo } from "react";
import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import type { ViewDensity } from "../../types/appSettings";
import type { TaskIndex } from "../../utils/taskIndex";
import { sortByHighValueScore } from "../../utils/scoring";
import { EmptyState } from "../../components/ui/EmptyState";
import { TaskList } from "../tasks/TaskList";
import { CompactTaskTable } from "./CompactTaskTable";

type BacklogPanelProps = {
  projects: Project[];
  tasks: Task[];
  taskIndex: TaskIndex;
  projectMap: Map<string, Project>;
  viewDensity: ViewDensity;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
};

export function BacklogPanel({
  tasks,
  taskIndex,
  projectMap,
  viewDensity,
  onStatusChange,
  onDelete,
  onFocus,
}: BacklogPanelProps) {
  const backlogTasks = useMemo(
    () =>
      sortByHighValueScore(
        tasks.filter((task) => taskIndex.complexProjectIds.has(task.projectId) && task.status !== "done"),
      ),
    [tasks, taskIndex],
  );

  if (backlogTasks.length === 0) {
    return (
      <EmptyState
        title="Backlog is clear"
        description="Complex project tasks that are not done will appear here, ranked by high-value score."
      />
    );
  }

  const projects = useMemo(() => [...projectMap.values()], [projectMap]);

  if (viewDensity === "compact") {
    return (
      <CompactTaskTable
        tasks={backlogTasks}
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
      tasks={backlogTasks}
      projects={projects}
      projectMap={projectMap}
      onStatusChange={onStatusChange}
      onDelete={onDelete}
      onFocus={onFocus}
    />
  );
}
