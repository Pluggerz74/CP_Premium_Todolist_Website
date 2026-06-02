import { useMemo } from "react";
import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { formatDateLabel } from "../../utils/dates";
import { getScoreLabel } from "../../utils/scoring";
import { VIRTUAL_LIST_THRESHOLD } from "../../utils/taskIndex";
import { useI18n } from "../../i18n/useI18n";
import { Button } from "../../components/ui/Button";
import { SelectField } from "../../components/ui/SelectField";
import { EmptyState } from "../../components/ui/EmptyState";
import { ScorePill } from "../../components/ui/ScorePill";
import { TagChips } from "../../components/ui/TagChips";
import { VirtualList } from "../../components/ui/VirtualList";

type CompactTaskTableProps = {
  tasks: Task[];
  projects: Project[];
  projectMap?: Map<string, Project>;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
};

const COMPACT_ROW_HEIGHT = 56;

function CompactTaskRow({
  task,
  project,
  onStatusChange,
  onDelete,
  onFocus,
  onEdit,
}: {
  task: Task;
  project: Project | undefined;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
}) {
  const { t } = useI18n();

  return (
    <div className="compact-table__row" role="row">
      <div className="compact-table__title" role="cell">
        <strong>{task.title}</strong>
        {task.tags.length > 0 ? (
          <TagChips tags={task.tags} prefix maxVisible={2} className="compact-table__tags" />
        ) : null}
      </div>
      <span role="cell">{project?.name ?? "—"}</span>
      <span role="cell">
        <SelectField
          value={task.status}
          onChange={(value) => onStatusChange(task.id, value as TaskStatus)}
          aria-label={`${t("label.status")} — ${task.title}`}
          options={[
            { value: "todo", label: t("status.todo") },
            { value: "in-progress", label: t("status.inProgress") },
            { value: "done", label: t("status.done") },
          ]}
        />
      </span>
      <span role="cell" title={getScoreLabel(task.highValueScore)}>
        <ScorePill score={task.highValueScore} compact />
      </span>
      <span role="cell">{formatDateLabel(task.dueDate)}</span>
      <span className="compact-table__actions" role="cell">
        {onEdit ? (
          <Button variant="ghost" onClick={() => onEdit(task.id)}>
            {t("btn.edit")}
          </Button>
        ) : null}
        <Button variant="ghost" onClick={() => onFocus(task.id)}>
          {t("btn.focus")}
        </Button>
        <Button variant="danger" onClick={() => onDelete(task.id)}>
          {t("btn.delete")}
        </Button>
      </span>
    </div>
  );
}

export function CompactTaskTable({
  tasks,
  projects,
  projectMap,
  onStatusChange,
  onDelete,
  onFocus,
  onEdit,
}: CompactTaskTableProps) {
  const resolvedProjectMap = useMemo(() => {
    if (projectMap) return projectMap;
    return new Map(projects.map((project) => [project.id, project]));
  }, [projectMap, projects]);

  if (tasks.length === 0) {
    return <EmptyState title="No tasks" description="This section has no tasks yet." />;
  }

  const useVirtual = tasks.length >= VIRTUAL_LIST_THRESHOLD;

  return (
    <div className="compact-table" role="table" aria-label="Tasks">
      <div className="compact-table__head" role="row">
        <span role="columnheader">Task</span>
        <span role="columnheader">Project</span>
        <span role="columnheader">Status</span>
        <span role="columnheader">Score</span>
        <span role="columnheader">Due</span>
        <span role="columnheader">Actions</span>
      </div>
      {useVirtual ? (
        <VirtualList
          items={tasks}
          itemHeight={COMPACT_ROW_HEIGHT}
          maxHeight={640}
          className="compact-table__virtual"
          ariaLabel="Task rows"
          getItemKey={(task) => task.id}
          renderItem={(task) => (
            <CompactTaskRow
              task={task}
              project={resolvedProjectMap.get(task.projectId)}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              onFocus={onFocus}
              onEdit={onEdit}
            />
          )}
        />
      ) : (
        tasks.map((task) => (
          <CompactTaskRow
            key={task.id}
            task={task}
            project={resolvedProjectMap.get(task.projectId)}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            onFocus={onFocus}
            onEdit={onEdit}
          />
        ))
      )}
    </div>
  );
}
