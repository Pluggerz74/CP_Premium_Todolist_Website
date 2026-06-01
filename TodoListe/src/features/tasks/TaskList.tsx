import { useMemo } from "react";
import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { VIRTUAL_LIST_THRESHOLD } from "../../utils/taskIndex";
import { EmptyState } from "../../components/ui/EmptyState";
import { VirtualList } from "../../components/ui/VirtualList";
import { TaskCard } from "./TaskCard";

type TaskListProps = {
  tasks: Task[];
  projects: Project[];
  projectMap?: Map<string, Project>;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
};

const COMFORTABLE_ROW_HEIGHT = 132;

export function TaskList({
  tasks,
  projects,
  projectMap,
  onStatusChange,
  onDelete,
  onFocus,
}: TaskListProps) {
  const resolvedProjectMap = useMemo(() => {
    if (projectMap) return projectMap;
    return new Map(projects.map((project) => [project.id, project]));
  }, [projectMap, projects]);

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks in this view"
        description="Create a task or switch projects to see your next high-value actions."
      />
    );
  }

  if (tasks.length >= VIRTUAL_LIST_THRESHOLD) {
    return (
      <section className="task-list">
        <VirtualList
          items={tasks}
          itemHeight={COMFORTABLE_ROW_HEIGHT}
          maxHeight={720}
          className="task-list__virtual"
          ariaLabel="Task list"
          getItemKey={(task) => task.id}
          renderItem={(task) => (
            <TaskCard
              task={task}
              project={resolvedProjectMap.get(task.projectId)}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              onFocus={onFocus}
            />
          )}
        />
      </section>
    );
  }

  return (
    <section className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          project={resolvedProjectMap.get(task.projectId)}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onFocus={onFocus}
        />
      ))}
    </section>
  );
}
