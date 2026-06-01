import type { Project } from "../../types/project";
import type { Task } from "../../types/task";
import { ProjectCard } from "./ProjectCard";

type ProjectListProps = {
  projects: Project[];
  tasks: Task[];
};

export function ProjectList({ projects, tasks }: ProjectListProps) {
  return (
    <section className="grid grid--projects">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} tasks={tasks} />
      ))}
    </section>
  );
}
