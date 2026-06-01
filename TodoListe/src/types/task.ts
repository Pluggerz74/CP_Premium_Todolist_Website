export type TaskStatus = "todo" | "in-progress" | "done";

export type TaskType = "task" | "subtask" | "bug" | "feature" | "research";

export type TaskPrioritySignal = 1 | 2 | 3 | 4 | 5;

export type Task = {
  id: string;
  title: string;
  description: string;
  projectId: string;
  areaId: string | null;
  phaseId: string | null;
  milestoneId: string | null;
  epicId: string | null;
  taskGroupId: string | null;
  parentTaskId: string | null;
  status: TaskStatus;
  type: TaskType;
  priority: TaskPrioritySignal;
  impact: TaskPrioritySignal;
  urgency: TaskPrioritySignal;
  effort: TaskPrioritySignal;
  highValueScore: number;
  dueDate: string;
  startDate: string | null;
  tags: string[];
  dependencies: string[];
  blockedBy: string[];
  acceptanceCriteria: string;
  notes: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export type TaskInput = Omit<Task, "id" | "createdAt" | "updatedAt" | "highValueScore" | "completedAt">;
