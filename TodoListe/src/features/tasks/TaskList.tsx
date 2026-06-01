import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { EmptyState } from "../../components/ui/EmptyState";
import { TaskCard } from "./TaskCard";

type TaskListProps = {
  tasks: Task[];
  projects: Project[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
};

export function TaskList({ tasks, projects, onStatusChange, onDelete, onFocus }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks in this view"
        description="Create a task or switch projects to see your next high-value actions."
      />
    );
  }

  return (
    <section className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          project={projects.find((project) => project.id === task.projectId)}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onFocus={onFocus}
        />
      ))}
    </section>
  );
}
