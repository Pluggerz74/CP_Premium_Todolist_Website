import type { Project } from "../../types/project";
import type { Task } from "../../types/task";
import { EmptyState } from "../../components/ui/EmptyState";
import { ProjectList } from "./ProjectList";

type ProjectsPanelProps = {
  projects: Project[];
  tasks: Task[];
  complexityMode: "simple" | "complex";
  onSelectProject: (projectId: string) => void;
};

export function ProjectsPanel({ projects, tasks, complexityMode, onSelectProject }: ProjectsPanelProps) {
  const filtered = projects.filter((project) => project.complexityMode === complexityMode);
  const visibleProjects = filtered.length > 0 ? filtered : projects;

  if (visibleProjects.length === 0) {
    return (
      <EmptyState
        title="No projects yet"
        description="Create your first project from a template to start organizing simple todos or complex production plans."
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
