import { FormEvent, useMemo, useState } from "react";
import type { Project } from "../../types/project";
import type { ProjectHierarchyStore } from "../../types/hierarchy";
import type { Task, TaskInput, TaskPrioritySignal, TaskStatus, TaskType } from "../../types/task";
import {
  getAreaPhases,
  getEpicTaskGroups,
  getMilestoneEpics,
  getPhaseMilestones,
  getProjectAreas,
} from "../../utils/hierarchy";
import { validateHierarchySelection } from "../../utils/taskHierarchyEdit";
import { calculateHighValueScore } from "../../utils/scoring";
import { Button } from "../../components/ui/Button";
import { ScorePill } from "../../components/ui/ScorePill";

type TaskEditFormProps = {
  task: Task;
  projects: Project[];
  hierarchy: ProjectHierarchyStore;
  onSubmit: (taskId: string, input: Partial<TaskInput>) => void;
  onCancel: () => void;
};

const signals: TaskPrioritySignal[] = [1, 2, 3, 4, 5];
const taskTypes: TaskType[] = ["task", "subtask", "bug", "feature", "research"];

export function TaskEditForm({ task, projects, hierarchy, onSubmit, onCancel }: TaskEditFormProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [projectId, setProjectId] = useState(task.projectId);
  const [areaId, setAreaId] = useState(task.areaId ?? "");
  const [phaseId, setPhaseId] = useState(task.phaseId ?? "");
  const [milestoneId, setMilestoneId] = useState(task.milestoneId ?? "");
  const [epicId, setEpicId] = useState(task.epicId ?? "");
  const [taskGroupId, setTaskGroupId] = useState(task.taskGroupId ?? "");
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [type, setType] = useState<TaskType>(task.type);
  const [priority, setPriority] = useState<TaskPrioritySignal>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [impact, setImpact] = useState<TaskPrioritySignal>(task.impact);
  const [urgency, setUrgency] = useState<TaskPrioritySignal>(task.urgency);
  const [effort, setEffort] = useState<TaskPrioritySignal>(task.effort);
  const [tagsInput, setTagsInput] = useState(task.tags.join(", "));
  const [error, setError] = useState<string | null>(null);

  const selectedProject = projects.find((project) => project.id === projectId);
  const showHierarchy = selectedProject?.complexityMode === "complex";

  const areas = useMemo(
    () => (projectId ? getProjectAreas(hierarchy, projectId) : []),
    [hierarchy, projectId],
  );
  const phases = useMemo(
    () => (areaId ? getAreaPhases(hierarchy, areaId) : []),
    [hierarchy, areaId],
  );
  const milestones = useMemo(
    () => (phaseId ? getPhaseMilestones(hierarchy, phaseId) : []),
    [hierarchy, phaseId],
  );
  const epics = useMemo(
    () => (milestoneId ? getMilestoneEpics(hierarchy, milestoneId) : []),
    [hierarchy, milestoneId],
  );
  const taskGroups = useMemo(
    () => (epicId ? getEpicTaskGroups(hierarchy, epicId) : []),
    [hierarchy, epicId],
  );

  const previewScore = calculateHighValueScore({ impact, urgency, effort });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }
    if (!projectId) {
      setError("Select a project.");
      return;
    }

    const hierarchyRefs = showHierarchy
      ? validateHierarchySelection(hierarchy, projectId, {
          areaId: areaId || null,
          phaseId: phaseId || null,
          milestoneId: milestoneId || null,
          epicId: epicId || null,
          taskGroupId: taskGroupId || null,
        })
      : {
          areaId: null,
          phaseId: null,
          milestoneId: null,
          epicId: null,
          taskGroupId: null,
        };

    setError(null);
    onSubmit(task.id, {
      title: title.trim(),
      description: description.trim(),
      projectId,
      ...hierarchyRefs,
      status,
      type,
      priority,
      dueDate,
      impact,
      urgency,
      effort,
      tags: tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  }

  return (
    <form className="form form--edit" onSubmit={handleSubmit}>
      <div className="form__score-preview">
        <span className="eyebrow">High-value score</span>
        <ScorePill score={previewScore} />
        <span className="form__score-hint">Updates when you save impact, urgency, or effort.</span>
      </div>

      {error ? (
        <p className="form__error" role="alert">
          {error}
        </p>
      ) : null}

      <label>
        Title
        <input value={title} onChange={(event) => setTitle(event.target.value)} required />
      </label>
      <label>
        Description
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} />
      </label>

      <div className="form__section">
        <p className="form__section-title">Planning</p>
        <label>
          Project
          <select
            value={projectId}
            onChange={(event) => {
              setProjectId(event.target.value);
              setAreaId("");
              setPhaseId("");
              setMilestoneId("");
              setEpicId("");
              setTaskGroupId("");
            }}
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
        {showHierarchy && areas.length > 0 ? (
          <>
            <label>
              Area
              <select
                value={areaId}
                onChange={(event) => {
                  setAreaId(event.target.value);
                  setPhaseId("");
                  setMilestoneId("");
                  setEpicId("");
                  setTaskGroupId("");
                }}
              >
                <option value="">None</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.title}
                  </option>
                ))}
              </select>
            </label>
            {areaId && phases.length > 0 ? (
              <label>
                Phase
                <select
                  value={phaseId}
                  onChange={(event) => {
                    setPhaseId(event.target.value);
                    setMilestoneId("");
                    setEpicId("");
                    setTaskGroupId("");
                  }}
                >
                  <option value="">None</option>
                  {phases.map((phase) => (
                    <option key={phase.id} value={phase.id}>
                      {phase.title}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {phaseId && milestones.length > 0 ? (
              <label>
                Milestone
                <select
                  value={milestoneId}
                  onChange={(event) => {
                    setMilestoneId(event.target.value);
                    setEpicId("");
                    setTaskGroupId("");
                  }}
                >
                  <option value="">None</option>
                  {milestones.map((milestone) => (
                    <option key={milestone.id} value={milestone.id}>
                      {milestone.title}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {milestoneId && epics.length > 0 ? (
              <label>
                Epic
                <select
                  value={epicId}
                  onChange={(event) => {
                    setEpicId(event.target.value);
                    setTaskGroupId("");
                  }}
                >
                  <option value="">None</option>
                  {epics.map((epic) => (
                    <option key={epic.id} value={epic.id}>
                      {epic.title}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {epicId && taskGroups.length > 0 ? (
              <label>
                Task group
                <select value={taskGroupId} onChange={(event) => setTaskGroupId(event.target.value)}>
                  <option value="">None</option>
                  {taskGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.title}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </>
        ) : null}
      </div>

      <div className="form__section">
        <p className="form__section-title">Status & schedule</p>
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
            Type
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
            Priority
            <select
              value={priority}
              onChange={(event) => setPriority(Number(event.target.value) as TaskPrioritySignal)}
            >
              {signals.map((signal) => (
                <option key={signal} value={signal}>
                  {signal}
                </option>
              ))}
            </select>
          </label>
          <label>
            Due date
            <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
          </label>
        </div>
      </div>

      <div className="form__section">
        <p className="form__section-title">Value signals</p>
        <div className="form__grid form__grid--three">
          <label>
            Impact
            <select value={impact} onChange={(event) => setImpact(Number(event.target.value) as TaskPrioritySignal)}>
              {signals.map((signal) => (
                <option key={signal} value={signal}>
                  {signal}
                </option>
              ))}
            </select>
          </label>
          <label>
            Urgency
            <select value={urgency} onChange={(event) => setUrgency(Number(event.target.value) as TaskPrioritySignal)}>
              {signals.map((signal) => (
                <option key={signal} value={signal}>
                  {signal}
                </option>
              ))}
            </select>
          </label>
          <label>
            Effort
            <select value={effort} onChange={(event) => setEffort(Number(event.target.value) as TaskPrioritySignal)}>
              {signals.map((signal) => (
                <option key={signal} value={signal}>
                  {signal}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <label>
        Tags
        <input
          value={tagsInput}
          onChange={(event) => setTagsInput(event.target.value)}
          placeholder="design, mvp, launch"
        />
      </label>

      <div className="form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save changes</Button>
      </div>
    </form>
  );
}
