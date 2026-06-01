export type TaskStatus = "todo" | "in-progress" | "done";

export type TaskPrioritySignal = 1 | 2 | 3 | 4 | 5;

export type Task = {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  dueDate: string;
  impact: TaskPrioritySignal;
  urgency: TaskPrioritySignal;
  effort: TaskPrioritySignal;
  createdAt: string;
  updatedAt: string;
};

export type TaskInput = Omit<Task, "id" | "createdAt" | "updatedAt">;
