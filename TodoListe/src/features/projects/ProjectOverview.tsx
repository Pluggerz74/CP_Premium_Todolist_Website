import { useMemo } from "react";
import type { ProjectHierarchyStore } from "../../types/hierarchy";
import type { Project } from "../../types/project";
import type { Task } from "../../types/task";
import type { TaskIndex } from "../../utils/taskIndex";
import { getProjectAreas } from "../../utils/hierarchy";
import { getProgressByArea, getProjectProgress } from "../../utils/progress";
import { sortByHighValueScore } from "../../utils/scoring";
import { EmptyState } from "../../components/ui/EmptyState";
import { RankedListItem } from "../../components/ui/RankedListItem";
import { StatCard } from "../../components/ui/StatCard";
import { TaskMetadata } from "../../components/ui/TaskMetadata";
import { ModeBadge } from "../../components/ui/ModeBadge";
import { useI18n } from "../../i18n/useI18n";
import { Card } from "../../components/ui/Card";

type ProjectOverviewProps = {
  project: Project | undefined;
  hierarchy: ProjectHierarchyStore;
  tasks: Task[];
  taskIndex: TaskIndex;
  onFocus?: (taskId: string) => void;
};

export function ProjectOverview({ project, hierarchy, taskIndex, onFocus }: ProjectOverviewProps) {
  const { t } = useI18n();
  const projectTasks = useMemo(
    () => (project ? taskIndex.byProjectId.get(project.id) ?? [] : []),
    [project, taskIndex],
  );

  const openTasks = useMemo(() => projectTasks.filter((task) => task.status !== "done"), [projectTasks]);
  const areas = useMemo(
    () => (project ? getProjectAreas(hierarchy, project.id) : []),
    [project, hierarchy],
  );
  const progress = useMemo(() => getProjectProgress(projectTasks), [projectTasks]);
  const areaProgress = useMemo(
    () => (project ? getProgressByArea(hierarchy, project.id, taskIndex) : []),
    [project, hierarchy, taskIndex],
  );
  const topTasks = useMemo(() => sortByHighValueScore(openTasks).slice(0, 5), [openTasks]);

  if (!project) {
    return (
      <EmptyState
        title={t("projectOverview.selectTitle")}
        description={t("projectOverview.selectHint")}
      />
    );
  }

  const areaProgressMap = new Map(areaProgress.map((item) => [item.areaId, item]));

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
          <span>
            {t("projectOverview.tasksComplete", {
              completed: progress.completed,
              total: progress.total,
            })}
          </span>
          <span>{progress.percent}%</span>
        </div>
        <div className="progress__track">
          <span style={{ width: `${progress.percent}%` }} />
        </div>
      </Card>

      <section className="stats-grid stats-grid--three">
        <StatCard
          label={t("projectOverview.stat.openTasks")}
          value={openTasks.length}
          helper={t("projectOverview.stat.openTasksHelper")}
        />
        <StatCard
          label={t("projectOverview.stat.areas")}
          value={areas.length}
          helper={t("projectOverview.stat.areasHelper")}
        />
        <StatCard
          label={t("projectOverview.stat.topScore")}
          value={topTasks[0]?.highValueScore ?? 0}
          helper={t("projectOverview.stat.topScoreHelper")}
        />
      </section>

      {project.complexityMode === "complex" ? (
        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">{t("projectOverview.structure")}</p>
            <h2>{t("projectOverview.areasTitle")}</h2>
          </div>
          <div className="area-grid">
            {areas.map((area) => {
              const stats = areaProgressMap.get(area.id) ?? { total: 0, completed: 0, percent: 0, areaId: area.id };
              const areaOpen = stats.total - stats.completed;
              return (
                <Card key={area.id} className="area-card">
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                  <div className="area-card__meta">
                    <span>{t("projectOverview.openCount", { count: areaOpen })}</span>
                    <span>{t("projectOverview.percentDone", { percent: stats.percent })}</span>
                  </div>
                  <div className="area-card__progress">
                    <div className="progress__track">
                      <span style={{ width: `${stats.percent}%` }} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">{t("projectOverview.nextActions")}</p>
          <h2>{t("projectOverview.rankedTitle")}</h2>
        </div>
        {topTasks.length === 0 ? (
          <EmptyState
            title={t("projectOverview.noOpenTasks")}
            description={t("projectOverview.noOpenTasksHint")}
          />
        ) : (
          <div className="ranked-list">
            {topTasks.map((task, index) => (
              <RankedListItem
                key={task.id}
                rank={index + 1}
                title={task.title}
                score={task.highValueScore}
                onClick={onFocus ? () => onFocus(task.id) : undefined}
              >
                <p>{task.description}</p>
                <TaskMetadata task={task} variant="inline" showDueDate={false} />
              </RankedListItem>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
