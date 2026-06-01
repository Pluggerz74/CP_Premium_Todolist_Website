import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { sortByHighValueScore } from "../../utils/scoring";
import { TaskList } from "../tasks/TaskList";

type HighValuePanelProps = {
  projects: Project[];
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
};

export function HighValuePanel({ projects, tasks, onStatusChange, onDelete, onFocus }: HighValuePanelProps) {
  const rankedTasks = sortByHighValueScore(tasks.filter((task) => task.status !== "done"));

  return (
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">High-value score</p>
        <h2>Ranked by impact + urgency - effort</h2>
      </div>
      <TaskList tasks={rankedTasks} projects={projects} onStatusChange={onStatusChange} onDelete={onDelete} onFocus={onFocus} />
    </section>
  );
}
