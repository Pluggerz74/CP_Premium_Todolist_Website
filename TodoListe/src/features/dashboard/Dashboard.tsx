import type { ProjectComplexityMode } from "../../types/project";
import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { formatDateLabel, isToday, isUpcoming } from "../../utils/dates";
import { getNextBestAction, getOpenTasks } from "../../utils/selectors";
import { useI18n } from "../../i18n/useI18n";
import { StatCard } from "../../components/ui/StatCard";
import { ModeBadge } from "../../components/ui/ModeBadge";
import { ScorePill } from "../../components/ui/ScorePill";
import { ProjectList } from "../projects/ProjectList";
import { TaskList } from "../tasks/TaskList";

type DashboardProps = {
  projects: Project[];
  tasks: Task[];
  allTasks: Task[];
  complexityMode: ProjectComplexityMode;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
  onEdit: (taskId: string) => void;
};

export function Dashboard({
  projects,
  tasks,
  allTasks,
  complexityMode,
  onStatusChange,
  onDelete,
  onFocus,
  onEdit,
}: DashboardProps) {
  const { t } = useI18n();
  const openTasks = getOpenTasks(allTasks);
  const todayTasks = openTasks.filter((task) => isToday(task.dueDate));
  const upcomingTasks = openTasks.filter((task) => isUpcoming(task.dueDate));
  const nextAction = getNextBestAction(allTasks);
  const complexProjects = projects.filter((project) => project.complexityMode === "complex").length;

  return (
    <div className="dashboard-view">
      <div className="dashboard-view__mode">
        <ModeBadge mode={complexityMode} />
        <p>
          {complexityMode === "complex"
            ? "Hierarchy, maps, and backlog views keep massive projects calm."
            : "Fast flat lists for everyday high-value execution."}
        </p>
      </div>

      <section className="stats-grid">
        <StatCard label="Active projects" value={projects.filter((project) => project.status === "active").length} helper="Current execution lanes" />
        <StatCard label="Open tasks" value={openTasks.length} helper="Not completed yet" />
        <StatCard label="Today" value={todayTasks.length} helper="Due today" />
        <StatCard label="Complex projects" value={complexProjects} helper="Full hierarchy enabled" />
      </section>

      {nextAction ? (
        <section
          className="section-block next-action-banner card next-action-banner--clickable"
          role="button"
          tabIndex={0}
          onClick={() => onFocus(nextAction.id)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onFocus(nextAction.id);
            }
          }}
          aria-label={`Focus on ${nextAction.title}`}
        >
          <div>
            <p className="eyebrow">Next best action</p>
            <h2>{nextAction.title}</h2>
            <div className="next-action-banner__meta">
              <ScorePill score={nextAction.highValueScore} />
              <span className="task-metadata__due">Due {formatDateLabel(nextAction.dueDate)}</span>
            </div>
          </div>
          <div className="next-action-banner__actions">
            <button
              type="button"
              className="button button--secondary"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(nextAction.id);
              }}
            >
              {t("btn.edit")}
            </button>
            <button
              type="button"
              className="button button--primary"
              onClick={(event) => {
                event.stopPropagation();
                onFocus(nextAction.id);
              }}
            >
              {t("btn.enterFocus")}
            </button>
          </div>
        </section>
      ) : null}

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Highest leverage</p>
          <h2>Execute these first</h2>
        </div>
        <TaskList
          tasks={tasks}
          projects={projects}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onFocus={onFocus}
          onEdit={onEdit}
        />
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Portfolio</p>
          <h2>Projects</h2>
        </div>
        <ProjectList projects={projects.slice(0, 4)} tasks={allTasks} />
      </section>
    </div>
  );
}
