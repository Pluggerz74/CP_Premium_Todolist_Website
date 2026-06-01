import type { Project } from "../../types/project";
import type { Task } from "../../types/task";
import { calculateProjectProgress, countOpenTasks } from "../../utils/progress";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";

type ProjectCardProps = {
  project: Project;
  tasks: Task[];
};

export function ProjectCard({ project, tasks }: ProjectCardProps) {
  const progress = calculateProjectProgress(project.id, tasks);
  const openTasks = countOpenTasks(project.id, tasks);

  return (
    <Card className="project-card">
      <div className="project-card__top">
        <span className="project-card__color" style={{ background: project.color }} />
        <Badge tone={project.status === "active" ? "success" : "neutral"}>{project.status}</Badge>
      </div>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <div className="project-card__goal">{project.goal}</div>
      <div className="progress">
        <div className="progress__meta">
          <span>{progress}% complete</span>
          <span>{openTasks} open tasks</span>
        </div>
        <div className="progress__track">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
    </Card>
  );
}
