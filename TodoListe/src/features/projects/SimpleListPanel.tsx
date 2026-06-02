import { useMemo } from "react";
import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import type { ViewDensity } from "../../types/appSettings";
import type { TaskIndex } from "../../utils/taskIndex";
import { getSimpleModeTasksFromIndex } from "../../utils/selectors";
import { sortByHighValueScore } from "../../utils/scoring";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { TaskList } from "../tasks/TaskList";
import { CompactTaskTable } from "./CompactTaskTable";

type SimpleListPanelProps = {
  projects: Project[];
  tasks: Task[];
  taskIndex: TaskIndex;
  projectMap: Map<string, Project>;
  viewDensity: ViewDensity;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
  onQuickAdd?: () => void;
};

export function SimpleListPanel({
  tasks,
  taskIndex,
  projectMap,
  viewDensity,
  onStatusChange,
  onDelete,
  onFocus,
  onEdit,
  onQuickAdd,
}: SimpleListPanelProps) {
  const simpleTasks = useMemo(
    () => sortByHighValueScore(getSimpleModeTasksFromIndex(tasks, taskIndex)),
    [tasks, taskIndex],
  );

  const projects = useMemo(() => [...projectMap.values()], [projectMap]);

  if (simpleTasks.length === 0) {
    return (
      <EmptyState
        variant="subtle"
        icon="≡"
        title="No simple tasks yet"
        description="Use Quick Add for a fast personal todo, or create a simple project to get started."
        action={onQuickAdd ? <Button onClick={onQuickAdd}>Quick Add</Button> : undefined}
      />
    );
  }

  if (viewDensity === "compact") {
    return (
      <CompactTaskTable
        tasks={simpleTasks}
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
      tasks={simpleTasks}
      projects={projects}
      projectMap={projectMap}
      onStatusChange={onStatusChange}
      onDelete={onDelete}
      onFocus={onFocus}
      onEdit={onEdit}
    />
  );
}
