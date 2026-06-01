import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { isToday, isUpcoming } from "../../utils/dates";
import { sortByHighValueScore } from "../../utils/scoring";
import { StatCard } from "../../components/ui/StatCard";
import { ProjectList } from "../projects/ProjectList";
import { TaskList } from "../tasks/TaskList";

type DashboardProps = {
  projects: Project[];
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
};

export function Dashboard({ projects, tasks, onStatusChange, onDelete, onFocus }: DashboardProps) {
  const openTasks = tasks.filter((task) => task.status !== "done");
  const todayTasks = openTasks.filter((task) => isToday(task.dueDate));
  const upcomingTasks = openTasks.filter((task) => isUpcoming(task.dueDate));
  const bestTasks = sortByHighValueScore(openTasks).slice(0, 4);

  return (
    <div className="dashboard-view">
      <section className="stats-grid">
        <StatCard label="Active projects" value={projects.filter((project) => project.status === "active").length} helper="Current execution lanes" />
        <StatCard label="Open tasks" value={openTasks.length} helper="Not completed yet" />
        <StatCard label="Today" value={todayTasks.length} helper="Due today" />
        <StatCard label="Upcoming" value={upcomingTasks.length} helper="Future deadlines" />
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Highest leverage</p>
          <h2>Execute these first</h2>
        </div>
        <TaskList tasks={bestTasks} projects={projects} onStatusChange={onStatusChange} onDelete={onDelete} onFocus={onFocus} />
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Portfolio</p>
          <h2>Projects</h2>
        </div>
        <ProjectList projects={projects} tasks={tasks} />
      </section>
    </div>
  );
}
