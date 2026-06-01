import type { ProjectHierarchyStore } from "../../types/hierarchy";
import type { Project } from "../../types/project";
import type { Task } from "../../types/task";
import { getProjectAreas, getTasksForProject } from "../../utils/hierarchy";
import { getProjectProgress } from "../../utils/progress";
import { sortByHighValueScore } from "../../utils/scoring";
import { EmptyState } from "../../components/ui/EmptyState";
import { StatCard } from "../../components/ui/StatCard";
import { ModeBadge } from "../../components/ui/ModeBadge";
import { Card } from "../../components/ui/Card";

type ProjectOverviewProps = {
  project: Project | undefined;
  hierarchy: ProjectHierarchyStore;
  tasks: Task[];
};

export function ProjectOverview({ project, hierarchy, tasks }: ProjectOverviewProps) {
  if (!project) {
    return (
      <EmptyState
        title="Select a project"
        description="Choose a project from the sidebar to inspect its overview, areas, and progress."
      />
    );
  }

  const projectTasks = getTasksForProject(tasks, project.id);
  const openTasks = projectTasks.filter((task) => task.status !== "done");
  const areas = getProjectAreas(hierarchy, project.id);
  const progress = getProjectProgress(projectTasks);
  const topTasks = sortByHighValueScore(openTasks).slice(0, 5);

  return (
    <div className="project-overview">
      <Card className="project-overview__hero">
        <div className="project-overview__hero-top">
          <span className="project-card__color" style={{ background: project.color }} />
          <div>
            <ModeBadge mode={project.complexityMode} />
            <h2>{project.name}</h2>
            <p>{project.description}</p>
          </div>
        </div>
        <p className="project-card__goal">{project.goal}</p>
        <div className="progress__meta">
          <span>{progress.completed}/{progress.total} tasks complete</span>
          <span>{progress.percent}%</span>
        </div>
        <div className="progress__track">
          <span style={{ width: `${progress.percent}%` }} />
        </div>
      </Card>

      <section className="stats-grid stats-grid--three">
        <StatCard label="Open tasks" value={openTasks.length} helper="Remaining execution items" />
        <StatCard label="Areas" value={areas.length} helper="Production lanes" />
        <StatCard label="Top score" value={topTasks[0]?.highValueScore ?? 0} helper="Highest open leverage" />
      </section>

      {project.complexityMode === "complex" ? (
        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">Structure</p>
            <h2>Project areas</h2>
          </div>
          <div className="area-grid">
            {areas.map((area) => {
              const areaTasks = projectTasks.filter((task) => task.areaId === area.id);
              const areaOpen = areaTasks.filter((task) => task.status !== "done").length;
              return (
                <Card key={area.id} className="area-card">
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                  <div className="area-card__meta">
                    <span>{areaOpen} open</span>
                    <span>{areaTasks.length} total</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Next actions</p>
          <h2>Highest-value tasks in this project</h2>
        </div>
        {topTasks.length === 0 ? (
          <EmptyState title="No open tasks" description="Add tasks to this project to see ranked next actions." />
        ) : (
          <div className="ranked-list">
            {topTasks.map((task, index) => (
              <div key={task.id} className="ranked-list__item">
                <span className="ranked-list__rank">{index + 1}</span>
                <div>
                  <strong>{task.title}</strong>
                  <p>{task.description}</p>
                </div>
                <span className="ranked-list__score">{task.highValueScore}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
