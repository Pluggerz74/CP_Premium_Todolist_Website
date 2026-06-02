import { FormEvent, useMemo, useState } from "react";
import type { Project } from "../../types/project";
import type { TaskInput, TaskPrioritySignal } from "../../types/task";
import { getTodayIsoDate } from "../../utils/dates";
import { Button } from "../../components/ui/Button";

type QuickAddFormProps = {
  projects: Project[];
  defaultProjectId: string | null;
  onSubmit: (input: TaskInput) => void;
  onCancel: () => void;
};

const priorities: TaskPrioritySignal[] = [1, 2, 3, 4, 5];

export function QuickAddForm({ projects, defaultProjectId, onSubmit, onCancel }: QuickAddFormProps) {
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

  return (
    <form className="form form--quick" onSubmit={handleSubmit}>
      <p className="form__hint">Add a personal todo in seconds. Press Enter to save.</p>
      <label>
        Task title
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs doing?"
          autoFocus
        />
      </label>
      <div className="form__grid">
        <label>
          Project / list
          <select value={projectId} onChange={(event) => setProjectId(event.target.value)}>
            {projectOptions.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Priority
          <select
            value={priority}
            onChange={(event) => setPriority(Number(event.target.value) as TaskPrioritySignal)}
          >
            {priorities.map((value) => (
              <option key={value} value={value}>
                {value} — {value >= 4 ? "High" : value >= 3 ? "Medium" : "Low"}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="form__checkbox">
        <input type="checkbox" checked={useDueDate} onChange={(event) => setUseDueDate(event.target.checked)} />
        Set due date
      </label>
      {useDueDate ? (
        <label>
          Due date
          <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        </label>
      ) : null}
      <div className="form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!title.trim()}>
          Add task
        </Button>
      </div>
    </form>
  );
}
