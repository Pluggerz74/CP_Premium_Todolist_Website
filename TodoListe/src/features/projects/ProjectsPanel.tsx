import type { Project } from "../../types/project";
import type { Task } from "../../types/task";
import { useI18n } from "../../i18n/useI18n";
import { EmptyState } from "../../components/ui/EmptyState";
import { ProjectList } from "./ProjectList";

type ProjectsPanelProps = {
  projects: Project[];
  tasks: Task[];
  complexityMode: "simple" | "complex";
  onSelectProject: (projectId: string) => void;
};

export function ProjectsPanel({ projects, tasks, complexityMode, onSelectProject }: ProjectsPanelProps) {
  const { t } = useI18n();
  const filtered = projects.filter((project) => project.complexityMode === complexityMode);
  const visibleProjects = filtered.length > 0 ? filtered : projects;

  if (visibleProjects.length === 0) {
    return (
      <EmptyState
        title={t("projects.emptyTitle")}
        description={t("projects.emptyHint")}
      />
    );
  }

  return (
    <div className="projects-panel">
      <ProjectList
        projects={visibleProjects}
        tasks={tasks}
        onSelectProject={onSelectProject}
      />
    </div>
  );
}
