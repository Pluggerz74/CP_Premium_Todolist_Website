import { demoHierarchy } from "../data/demoHierarchy";
import { demoProjects } from "../data/demoProjects";
import { demoTasks } from "../data/demoTasks";
import type { TaskFilterState } from "../types/appSettings";
import type { ProjectHierarchyStore } from "../types/hierarchy";
import type { Project } from "../types/project";
import type { Task, TaskStatus, TaskType } from "../types/task";
import type { DemoResetPayload } from "./dataBackup";
import { createId } from "./ids";
import { calculateHighValueScore } from "./scoring";
import { defaultTaskFilters } from "./selectors";

const BASE_DATE = "2026-06-01T08:00:00.000Z";
const STATUSES: TaskStatus[] = ["todo", "in-progress", "done"];
const TYPES: TaskType[] = ["task", "feature", "bug", "research"];
const TAG_POOL = ["alpha", "beta", "audio", "ui", "backend", "qa", "perf", "docs"];

type HierarchyAnchor = {
  projectId: string;
  areaId: string | null;
  phaseId: string | null;
  milestoneId: string | null;
  epicId: string | null;
  taskGroupId: string | null;
};

function collectAnchors(hierarchy: ProjectHierarchyStore): HierarchyAnchor[] {
  const anchors: HierarchyAnchor[] = [];

  for (const project of demoProjects.filter((item) => item.complexityMode === "complex")) {
    const areas = hierarchy.areas.filter((area) => area.projectId === project.id);
    if (areas.length === 0) {
      anchors.push({
        projectId: project.id,
        areaId: null,
        phaseId: null,
        milestoneId: null,
        epicId: null,
        taskGroupId: null,
      });
      continue;
    }

    for (const area of areas) {
      const phases = hierarchy.phases.filter((phase) => phase.areaId === area.id);
      const milestones = hierarchy.milestones.filter((milestone) => milestone.areaId === area.id);
      const epics = hierarchy.epics.filter((epic) => epic.areaId === area.id);
      const taskGroups = hierarchy.taskGroups.filter((group) => group.areaId === area.id);

      if (taskGroups.length === 0) {
        anchors.push({
          projectId: project.id,
          areaId: area.id,
          phaseId: phases[0]?.id ?? null,
          milestoneId: milestones[0]?.id ?? null,
          epicId: epics[0]?.id ?? null,
          taskGroupId: null,
        });
        continue;
      }

      for (const taskGroup of taskGroups) {
        anchors.push({
          projectId: project.id,
          areaId: area.id,
          phaseId: taskGroup.phaseId,
          milestoneId: taskGroup.milestoneId,
          epicId: taskGroup.epicId,
          taskGroupId: taskGroup.id,
        });
      }
    }
  }

  for (const project of demoProjects.filter((item) => item.complexityMode === "simple")) {
    anchors.push({
      projectId: project.id,
      areaId: null,
      phaseId: null,
      milestoneId: null,
      epicId: null,
      taskGroupId: null,
    });
  }

  return anchors;
}

function makeGeneratedTask(index: number, anchor: HierarchyAnchor): Task {
  const impact = ((index % 5) + 1) as Task["impact"];
  const urgency = (((index + 2) % 5) + 1) as Task["urgency"];
  const effort = (((index + 1) % 5) + 1) as Task["effort"];
  const status = STATUSES[index % STATUSES.length];
  const type = TYPES[index % TYPES.length];
  const tagCount = index % 3;
  const tags = Array.from({ length: tagCount }, (_, tagIndex) => TAG_POOL[(index + tagIndex) % TAG_POOL.length]);

  const task: Task = {
    id: createId("scale-task"),
    title: `Scale test task ${index + 1}`,
    description: `Generated stress-test task for QA at index ${index + 1}.`,
    projectId: anchor.projectId,
    areaId: anchor.areaId,
    phaseId: anchor.phaseId,
    milestoneId: anchor.milestoneId,
    epicId: anchor.epicId,
    taskGroupId: anchor.taskGroupId,
    parentTaskId: null,
    status,
    type,
    priority: impact,
    impact,
    urgency,
    effort,
    highValueScore: 0,
    dueDate: `2026-06-${String((index % 28) + 1).padStart(2, "0")}`,
    startDate: null,
    tags,
    dependencies: [],
    blockedBy: [],
    acceptanceCriteria: "",
    notes: "",
    order: index,
    createdAt: BASE_DATE,
    updatedAt: BASE_DATE,
    completedAt: status === "done" ? BASE_DATE : null,
  };

  task.highValueScore = calculateHighValueScore(task);
  return task;
}

export function generateScaleTestPayload(taskCount = 1200): DemoResetPayload {
  const anchors = collectAnchors(demoHierarchy);
  const generatedTasks: Task[] = [];

  for (let index = 0; index < taskCount; index += 1) {
    const anchor = anchors[index % anchors.length];
    generatedTasks.push(makeGeneratedTask(index, anchor));
  }

  const projects: Project[] = demoProjects;
  const tasks: Task[] = [...demoTasks, ...generatedTasks];
  const hierarchy: ProjectHierarchyStore = demoHierarchy;
  const filters: TaskFilterState = defaultTaskFilters;

  return { projects, tasks, hierarchy, filters };
}
