import { FormEvent, useState } from "react";
import type { Project } from "../../types/project";
import type { ProjectHierarchyStore } from "../../types/hierarchy";
import type { TaskInput, TaskPrioritySignal, TaskStatus, TaskType } from "../../types/task";
import { getTodayIsoDate } from "../../utils/dates";
import { getProjectAreas } from "../../utils/hierarchy";
import { useI18n } from "../../i18n/useI18n";
import { Button } from "../../components/ui/Button";

type TaskFormProps = {
  projects: Project[];
  hierarchy: ProjectHierarchyStore;
  defaultProjectId: string | null;
  onSubmit: (input: TaskInput) => void;
  onCancel: () => void;
};

const signals: TaskPrioritySignal[] = [1, 2, 3, 4, 5];
const taskTypes: TaskType[] = ["task", "subtask", "bug", "feature", "research"];

export function TaskForm({ projects, hierarchy, defaultProjectId, onSubmit, onCancel }: TaskFormProps) {
  const { t } = useI18n();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState(defaultProjectId ?? projects[0]?.id ?? "");
  const [areaId, setAreaId] = useState<string>("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [type, setType] = useState<TaskType>("task");
  const [dueDate, setDueDate] = useState(getTodayIsoDate());
  const [impact, setImpact] = useState<TaskPrioritySignal>(5);
  const [urgency, setUrgency] = useState<TaskPrioritySignal>(4);
  const [effort, setEffort] = useState<TaskPrioritySignal>(2);
  const [tagsInput, setTagsInput] = useState("");

  const selectedProject = projects.find((project) => project.id === projectId);
  const areas = projectId ? getProjectAreas(hierarchy, projectId) : [];
  const showHierarchy = selectedProject?.complexityMode === "complex" && areas.length > 0;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !projectId) return;

    const selectedArea = areas.find((area) => area.id === areaId);
    const phase = selectedArea
      ? hierarchy.phases.find((item) => item.areaId === selectedArea.id)
      : undefined;
    const milestone = phase
      ? hierarchy.milestones.find((item) => item.phaseId === phase.id)
      : undefined;
    const epic = milestone
      ? hierarchy.epics.find((item) => item.milestoneId === milestone.id)
      : undefined;
    const taskGroup = epic ? hierarchy.taskGroups.find((item) => item.epicId === epic.id) : undefined;

    onSubmit({
      title: title.trim(),
      description: description.trim() || "A high-value task that deserves focused execution.",
      projectId,
      areaId: selectedArea?.id ?? null,
      phaseId: phase?.id ?? null,
      milestoneId: milestone?.id ?? null,
      epicId: epic?.id ?? null,
      taskGroupId: taskGroup?.id ?? null,
      parentTaskId: null,
      status,
      type,
      priority: impact,
      dueDate,
      startDate: null,
      impact,
      urgency,
      effort,
      tags: tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      dependencies: [],
      blockedBy: [],
      acceptanceCriteria: "",
      notes: "",
      order: 0,
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        {t("form.taskTitle")}
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ship the dashboard" />
      </label>
      <label>
        {t("label.description")}
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What needs to happen?" />
      </label>
      <label>
        {t("label.project")}
        <select
          value={projectId}
          onChange={(event) => {
            setProjectId(event.target.value);
            setAreaId("");
          }}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </label>
      {showHierarchy ? (
        <label>
          {t("label.area")}
          <select value={areaId} onChange={(event) => setAreaId(event.target.value)}>
            <option value="">{t("form.selectAreaOptional")}</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.title}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <div className="form__grid">
        <label>
          {t("label.status")}
          <select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>
            <option value="todo">{t("status.todo")}</option>
            <option value="in-progress">{t("status.inProgress")}</option>
            <option value="done">{t("status.done")}</option>
          </select>
        </label>
        <label>
          {t("label.type")}
          <select value={type} onChange={(event) => setType(event.target.value as TaskType)}>
            {taskTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="form__grid">
        <label>
          {t("label.dueDate")}
          <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        </label>
        <label>
          {t("label.tags")}
          <input
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            placeholder="design, mvp, launch"
          />
        </label>
      </div>
      <div className="form__grid form__grid--three">
        <label>
          {t("label.impact")}
          <select value={impact} onChange={(event) => setImpact(Number(event.target.value) as TaskPrioritySignal)}>
            {signals.map((signal) => (
              <option key={signal} value={signal}>
                {signal}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("label.urgency")}
          <select value={urgency} onChange={(event) => setUrgency(Number(event.target.value) as TaskPrioritySignal)}>
            {signals.map((signal) => (
              <option key={signal} value={signal}>
                {signal}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("label.effort")}
          <select value={effort} onChange={(event) => setEffort(Number(event.target.value) as TaskPrioritySignal)}>
            {signals.map((signal) => (
              <option key={signal} value={signal}>
                {signal}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t("btn.cancel")}
        </Button>
        <Button type="submit">{t("form.createTask")}</Button>
      </div>
    </form>
  );
}
