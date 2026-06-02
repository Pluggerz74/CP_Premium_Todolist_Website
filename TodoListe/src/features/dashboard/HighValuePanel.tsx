import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { formatDateLabel } from "../../utils/dates";
import { sortByHighValueScore } from "../../utils/scoring";
import { EmptyState } from "../../components/ui/EmptyState";
import { RankedListItem } from "../../components/ui/RankedListItem";
import { TaskMetadata } from "../../components/ui/TaskMetadata";
import { TaskList } from "../tasks/TaskList";

type HighValuePanelProps = {
  projects: Project[];
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
};

export function HighValuePanel({ projects, tasks, onStatusChange, onDelete, onFocus, onEdit }: HighValuePanelProps) {
  const rankedTasks = sortByHighValueScore(tasks.filter((task) => task.status !== "done"));

  return (
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">High-value score</p>
        <h2>Ranked by impact + urgency - effort</h2>
      </div>
      {rankedTasks.length === 0 ? (
        <EmptyState
          variant="subtle"
          icon="★"
          title="No ranked tasks"
          description="Open tasks with impact and urgency will appear here, sorted by high-value score."
        />
      ) : rankedTasks.length <= 12 ? (
        <div className="ranked-list">
          {rankedTasks.map((task, index) => {
            const project = projects.find((item) => item.id === task.projectId);
            return (
              <RankedListItem
                key={task.id}
                rank={index + 1}
                title={task.title}
                score={task.highValueScore}
                onClick={() => onFocus(task.id)}
              >
                <div className="ranked-list__meta">
                  <TaskMetadata task={task} variant="inline" showDueDate={false} />
                  <span className="task-metadata__due">
                    {project?.name ?? "Project"} · Due {formatDateLabel(task.dueDate)}
                  </span>
                </div>
              </RankedListItem>
            );
          })}
        </div>
      ) : (
        <TaskList
          tasks={rankedTasks}
          projects={projects}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onFocus={onFocus}
          onEdit={onEdit}
        />
      )}
    </section>
  );
}
