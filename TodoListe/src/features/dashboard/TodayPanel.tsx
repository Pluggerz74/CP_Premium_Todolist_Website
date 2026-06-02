import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { isOverdue, isToday } from "../../utils/dates";
import { sortByHighValueScore } from "../../utils/scoring";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { TaskList } from "../tasks/TaskList";

type TodayPanelProps = {
  projects: Project[];
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
  onQuickAdd?: () => void;
};

export function TodayPanel({
  projects,
  tasks,
  onStatusChange,
  onDelete,
  onFocus,
  onEdit,
  onQuickAdd,
}: TodayPanelProps) {
  const openTasks = tasks.filter((task) => task.status !== "done");
  const overdueTasks = sortByHighValueScore(openTasks.filter((task) => isOverdue(task.dueDate)));
  const todayTasks = sortByHighValueScore(openTasks.filter((task) => isToday(task.dueDate)));

  if (overdueTasks.length === 0 && todayTasks.length === 0) {
    return (
      <EmptyState
        variant="subtle"
        icon="◷"
        title="Nothing due today"
        description="You're clear for today. Add a quick task or plan something in Upcoming."
        action={
          onQuickAdd ? (
            <Button onClick={onQuickAdd}>Quick Add</Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="today-view">
      {overdueTasks.length > 0 ? (
        <section className="section-block today-view__section today-view__section--overdue">
          <div className="section-heading">
            <p className="eyebrow">Overdue</p>
            <h2>Catch up first</h2>
          </div>
          <TaskList
            tasks={overdueTasks}
            projects={projects}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            onFocus={onFocus}
            onEdit={onEdit}
          />
        </section>
      ) : null}

      <section className="section-block today-view__section today-view__section--today">
        <div className="section-heading">
          <p className="eyebrow">Today</p>
          <h2>Tasks that need momentum now</h2>
        </div>
        {todayTasks.length === 0 ? (
          <p className="today-view__empty-note">No tasks scheduled for today — focus on overdue items above.</p>
        ) : (
          <TaskList
            tasks={todayTasks}
            projects={projects}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            onFocus={onFocus}
            onEdit={onEdit}
          />
        )}
      </section>
    </div>
  );
}
