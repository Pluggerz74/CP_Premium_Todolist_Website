export type HierarchyTimestamps = {
  createdAt: string;
  updatedAt: string;
};

export type ProjectArea = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  order: number;
} & HierarchyTimestamps;

export type ProjectPhase = {
  id: string;
  projectId: string;
  areaId: string;
  title: string;
  description: string;
  order: number;
} & HierarchyTimestamps;

export type Milestone = {
  id: string;
  projectId: string;
  areaId: string;
  phaseId: string;
  title: string;
  description: string;
  order: number;
} & HierarchyTimestamps;

export type Epic = {
  id: string;
  projectId: string;
  areaId: string;
  phaseId: string;
  milestoneId: string;
  title: string;
  description: string;
  order: number;
} & HierarchyTimestamps;

export type TaskGroup = {
  id: string;
  projectId: string;
  areaId: string;
  phaseId: string;
  milestoneId: string;
  epicId: string;
  title: string;
  description: string;
  order: number;
} & HierarchyTimestamps;

export type ChecklistItem = {
  id: string;
  taskId: string;
  projectId: string;
  title: string;
  completed: boolean;
  order: number;
} & HierarchyTimestamps;

export type ProjectHierarchyStore = {
  areas: ProjectArea[];
  phases: ProjectPhase[];
  milestones: Milestone[];
  epics: Epic[];
  taskGroups: TaskGroup[];
  checklistItems: ChecklistItem[];
};

export type HierarchyLevel =
  | "area"
  | "phase"
  | "milestone"
  | "epic"
  | "taskGroup"
  | "task"
  | "checklist";

export type BreadcrumbItem = {
  level: HierarchyLevel;
  id: string;
  label: string;
};
