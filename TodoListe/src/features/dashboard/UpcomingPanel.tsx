import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { isUpcoming } from "../../utils/dates";
import { sortByHighValueScore } from "../../utils/scoring";
import { TaskList } from "../tasks/TaskList";

type UpcomingPanelProps = {
  projects: Project[];
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
};

export function UpcomingPanel({ projects, tasks, onStatusChange, onDelete, onFocus }: UpcomingPanelProps) {
  const upcomingTasks = sortByHighValueScore(tasks.filter((task) => task.status !== "done" && isUpcoming(task.dueDate)));

  return (
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">Upcoming</p>
        <h2>Plan ahead without losing focus</h2>
      </div>
      <TaskList tasks={upcomingTasks} projects={projects} onStatusChange={onStatusChange} onDelete={onDelete} onFocus={onFocus} />
    </section>
  );
}
