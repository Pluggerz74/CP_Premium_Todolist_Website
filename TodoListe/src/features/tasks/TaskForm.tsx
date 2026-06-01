import { FormEvent, useState } from "react";
import type { Project } from "../../types/project";
import type { TaskInput, TaskPrioritySignal, TaskStatus } from "../../types/task";
import { getTodayIsoDate } from "../../utils/dates";
import { Button } from "../../components/ui/Button";

type TaskFormProps = {
  projects: Project[];
  defaultProjectId: string | null;
  onSubmit: (input: TaskInput) => void;
  onCancel: () => void;
};

const signals: TaskPrioritySignal[] = [1, 2, 3, 4, 5];

export function TaskForm({ projects, defaultProjectId, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState(defaultProjectId ?? projects[0]?.id ?? "");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [dueDate, setDueDate] = useState(getTodayIsoDate());
  const [impact, setImpact] = useState<TaskPrioritySignal>(5);
  const [urgency, setUrgency] = useState<TaskPrioritySignal>(4);
  const [effort, setEffort] = useState<TaskPrioritySignal>(2);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !projectId) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || "A high-value task that deserves focused execution.",
      projectId,
      status,
      dueDate,
      impact,
      urgency,
      effort,
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Task title
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ship the dashboard" />
      </label>
      <label>
        Description
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What needs to happen?" />
      </label>
      <label>
        Project
        <select value={projectId} onChange={(event) => setProjectId(event.target.value)}>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </label>
      <div className="form__grid">
        <label>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>
            <option value="todo">Todo</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>
        <label>
          Due date
          <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        </label>
      </div>
      <div className="form__grid form__grid--three">
        <label>
          Impact
          <select value={impact} onChange={(event) => setImpact(Number(event.target.value) as TaskPrioritySignal)}>
            {signals.map((signal) => <option key={signal} value={signal}>{signal}</option>)}
          </select>
        </label>
        <label>
          Urgency
          <select value={urgency} onChange={(event) => setUrgency(Number(event.target.value) as TaskPrioritySignal)}>
            {signals.map((signal) => <option key={signal} value={signal}>{signal}</option>)}
          </select>
        </label>
        <label>
          Effort
          <select value={effort} onChange={(event) => setEffort(Number(event.target.value) as TaskPrioritySignal)}>
            {signals.map((signal) => <option key={signal} value={signal}>{signal}</option>)}
          </select>
        </label>
      </div>
      <div className="form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Create Task</Button>
      </div>
    </form>
  );
}
