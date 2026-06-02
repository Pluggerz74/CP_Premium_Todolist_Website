import { FormEvent, useMemo, useState } from "react";
import type { Project } from "../../types/project";
import type { TaskInput, TaskPrioritySignal } from "../../types/task";
import { getTodayIsoDate } from "../../utils/dates";
import { useI18n } from "../../i18n/useI18n";
import { Button } from "../../components/ui/Button";
import { SelectField } from "../../components/ui/SelectField";

type QuickAddFormProps = {
  projects: Project[];
  defaultProjectId: string | null;
  onSubmit: (input: TaskInput) => void;
  onCancel: () => void;
};

const priorities: TaskPrioritySignal[] = [1, 2, 3, 4, 5];

export function QuickAddForm({ projects, defaultProjectId, onSubmit, onCancel }: QuickAddFormProps) {
  const { t } = useI18n();
  const simpleProjects = useMemo(
    () => projects.filter((project) => project.complexityMode === "simple"),
    [projects],
  );
  const projectOptions = simpleProjects.length > 0 ? simpleProjects : projects;
  const initialProjectId =
    defaultProjectId && projectOptions.some((p) => p.id === defaultProjectId)
      ? defaultProjectId
      : (projectOptions[0]?.id ?? "");

  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState(initialProjectId);
  const [dueDate, setDueDate] = useState(getTodayIsoDate());
  const [useDueDate, setUseDueDate] = useState(true);
  const [priority, setPriority] = useState<TaskPrioritySignal>(4);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !projectId) return;

    const impact = priority;
    const urgency = Math.min(5, priority + 1) as TaskPrioritySignal;
    const effort = 2;

    onSubmit({
      title: title.trim(),
      description: "",
      projectId,
      areaId: null,
      phaseId: null,
      milestoneId: null,
      epicId: null,
      taskGroupId: null,
      parentTaskId: null,
      status: "todo",
      type: "task",
      priority,
      dueDate: useDueDate ? dueDate : getTodayIsoDate(),
      startDate: null,
      impact,
      urgency,
      effort,
      tags: [],
      dependencies: [],
      blockedBy: [],
      acceptanceCriteria: "",
      notes: "",
      order: 0,
    });

    setTitle("");
  }

  const priorityOptions = priorities.map((value) => ({
    value: String(value),
    label: `${value} — ${
      value >= 4 ? t("priority.high") : value >= 3 ? t("priority.medium") : t("priority.low")
    }`,
  }));

  return (
    <form className="form form--quick" onSubmit={handleSubmit}>
      <p className="form__hint">{t("quickAdd.hint")}</p>
      <label>
        {t("form.taskTitle")}
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={t("quickAdd.titlePlaceholder")}
          autoFocus
        />
      </label>
      <div className="form__grid">
        <label>
          {t("label.list")}
          <SelectField
            value={projectId}
            onChange={setProjectId}
            options={projectOptions.map((project) => ({ value: project.id, label: project.name }))}
          />
        </label>
        <label>
          {t("label.priority")}
          <SelectField
            value={String(priority)}
            onChange={(value) => setPriority(Number(value) as TaskPrioritySignal)}
            options={priorityOptions}
          />
        </label>
      </div>
      <label className="form__checkbox">
        <input type="checkbox" checked={useDueDate} onChange={(event) => setUseDueDate(event.target.checked)} />
        {t("quickAdd.setDueDate")}
      </label>
      {useDueDate ? (
        <label>
          {t("label.dueDate")}
          <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        </label>
      ) : null}
      <div className="form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t("btn.cancel")}
        </Button>
        <Button type="submit" disabled={!title.trim()}>
          {t("btn.addTask")}
        </Button>
      </div>
    </form>
  );
}
