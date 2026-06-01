import type { Project } from "../../types/project";
import type { Task } from "../../types/task";
import { calculateProjectProgress, countOpenTasks } from "../../utils/progress";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ModeBadge } from "../../components/ui/ModeBadge";
import { Button } from "../../components/ui/Button";

type ProjectCardProps = {
  project: Project;
  tasks: Task[];
  onSelect?: () => void;
};

export function ProjectCard({ project, tasks, onSelect }: ProjectCardProps) {
  const progress = calculateProjectProgress(project.id, tasks);
  const openTasks = countOpenTasks(project.id, tasks);

  return (
    <Card className="project-card">
      <div className="project-card__top">
        <span className="project-card__color" style={{ background: project.color }} />
        <div className="project-card__badges">
          <Badge tone={project.status === "active" ? "success" : "neutral"}>{project.status}</Badge>
          <ModeBadge mode={project.complexityMode} />
        </div>
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
      {onSelect ? (
        <div className="project-card__actions">
          <Button variant="secondary" onClick={onSelect}>
            Open overview
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
