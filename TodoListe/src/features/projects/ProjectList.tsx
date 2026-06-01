import type { Project } from "../../types/project";
import type { Task } from "../../types/task";
import { ProjectCard } from "./ProjectCard";

type ProjectListProps = {
  projects: Project[];
  tasks: Task[];
  onSelectProject?: (projectId: string) => void;
};

export function ProjectList({ projects, tasks, onSelectProject }: ProjectListProps) {
  return (
    <section className="grid grid--projects">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          tasks={tasks}
          onSelect={onSelectProject ? () => onSelectProject(project.id) : undefined}
        />
      ))}
    </section>
  );
}
