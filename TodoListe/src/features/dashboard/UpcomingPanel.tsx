import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { isUpcoming } from "../../utils/dates";
import { sortByHighValueScore } from "../../utils/scoring";
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
  const upcomingTasks = sortByHighValueScore(
    tasks.filter((task) => task.status !== "done" && isUpcoming(task.dueDate)),
  );

  if (upcomingTasks.length === 0) {
    return (
      <EmptyState
        variant="subtle"
        icon="→"
        title="No upcoming deadlines"
        description="Future-dated open tasks will appear here so you can plan ahead without losing focus."
      />
    );
  }

  return (
    <section className="section-block upcoming-view">
      <div className="section-heading">
        <p className="eyebrow">Upcoming</p>
        <h2>Plan ahead without losing focus</h2>
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
