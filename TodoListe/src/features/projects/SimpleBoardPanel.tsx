import { useMemo, useState } from "react";
import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { isOverdue, isToday, isUpcoming } from "../../utils/dates";
import { getSimpleModeTasksFromIndex } from "../../utils/selectors";
import { useI18n } from "../../i18n/useI18n";
import { Button } from "../../components/ui/Button";
import { CollapsibleSection } from "../../components/ui/CollapsibleSection";
import { EmptyState } from "../../components/ui/EmptyState";
import { SimpleTaskCard } from "../tasks/SimpleTaskCard";
import type { TaskIndex } from "../../utils/taskIndex";

type SimpleBoardPanelProps = {
  tasks: Task[];
  taskIndex: TaskIndex;
  projectMap: Map<string, Project>;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onEdit?: (taskId: string) => void;
  onFocus?: (taskId: string) => void;
  onQuickAdd?: () => void;
};

type BoardSection = "overdue" | "today" | "upcoming" | "later" | "done";

function classifyTask(task: Task): BoardSection {
  if (task.status === "done") return "done";
  if (isOverdue(task.dueDate)) return "overdue";
  if (isToday(task.dueDate)) return "today";
  if (isUpcoming(task.dueDate)) return "upcoming";
  return "later";
}

export function SimpleBoardPanel({
  tasks,
  taskIndex,
  projectMap,
  onStatusChange,
  onEdit,
  onFocus,
  onQuickAdd,
}: SimpleBoardPanelProps) {
  const { t } = useI18n();
  const [doneOpen, setDoneOpen] = useState(false);

  const simpleTasks = useMemo(
    () => getSimpleModeTasksFromIndex(tasks, taskIndex),
    [tasks, taskIndex],
  );

  const sections = useMemo(() => {
    const buckets: Record<BoardSection, Task[]> = {
      overdue: [],
      today: [],
      upcoming: [],
      later: [],
      done: [],
    };
    for (const task of simpleTasks) {
      buckets[classifyTask(task)].push(task);
    }
    return buckets;
  }, [simpleTasks]);

  const openCount =
    sections.overdue.length + sections.today.length + sections.upcoming.length + sections.later.length;

  if (openCount === 0 && sections.done.length === 0) {
    return (
      <EmptyState
        variant="subtle"
        icon="≡"
        title={t("simple.noTasks")}
        description={t("simple.noTasksHint")}
        action={onQuickAdd ? <Button onClick={onQuickAdd}>{t("btn.quickAdd")}</Button> : undefined}
      />
    );
  }

  const sectionConfig: Array<{ id: BoardSection; title: string; subtitle?: string; tasks: Task[] }> = [
    { id: "overdue", title: t("section.overdue"), subtitle: t("section.catchUp"), tasks: sections.overdue },
    { id: "today", title: t("section.today"), subtitle: t("section.todayMomentum"), tasks: sections.today },
    { id: "upcoming", title: t("section.upcoming"), tasks: sections.upcoming },
    { id: "later", title: t("section.later"), tasks: sections.later },
  ];

  return (
    <div className="simple-board">
      <p className="simple-board__intro">{t("simple.boardIntro")}</p>

      {sectionConfig.map((section) =>
        section.tasks.length === 0 ? null : (
          <section
            key={section.id}
            className={`simple-board__section simple-board__section--${section.id}`}
          >
            <div className="simple-board__section-head">
              <h3>{section.title}</h3>
              {section.subtitle ? <span>{section.subtitle}</span> : null}
              <span className="simple-board__count">{section.tasks.length}</span>
            </div>
            <div className="simple-board__cards">
              {section.tasks.map((task) => (
                <SimpleTaskCard
                  key={task.id}
                  task={task}
                  project={projectMap.get(task.projectId)}
                  onStatusChange={onStatusChange}
                  onEdit={onEdit}
                  onFocus={onFocus}
                />
              ))}
            </div>
          </section>
        ),
      )}

      {sections.done.length > 0 ? (
        <CollapsibleSection
          id="simple-done"
          title={t("section.done")}
          meta={`${sections.done.length}`}
          collapsed={!doneOpen}
          onToggle={() => setDoneOpen((open) => !open)}
        >
          <div className="simple-board__cards">
            {sections.done.map((task) => (
              <SimpleTaskCard
                key={task.id}
                task={task}
                project={projectMap.get(task.projectId)}
                onStatusChange={onStatusChange}
                onEdit={onEdit}
                onFocus={onFocus}
              />
            ))}
          </div>
        </CollapsibleSection>
      ) : null}
    </div>
  );
}
