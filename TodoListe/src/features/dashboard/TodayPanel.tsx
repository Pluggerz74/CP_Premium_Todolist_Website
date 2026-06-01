import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { isToday } from "../../utils/dates";
import { sortByHighValueScore } from "../../utils/scoring";
import { TaskList } from "../tasks/TaskList";

type TodayPanelProps = {
  projects: Project[];
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
};

export function TodayPanel({ projects, tasks, onStatusChange, onDelete, onFocus }: TodayPanelProps) {
  const todayTasks = sortByHighValueScore(tasks.filter((task) => task.status !== "done" && isToday(task.dueDate)));

  return (
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">Today</p>
        <h2>Tasks that need momentum now</h2>
      </div>
      <TaskList tasks={todayTasks} projects={projects} onStatusChange={onStatusChange} onDelete={onDelete} onFocus={onFocus} />
    </section>
  );
}
