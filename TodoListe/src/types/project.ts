export type ProjectStatus = "active" | "paused" | "archived";

export type ProjectComplexityMode = "simple" | "complex";

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  color: string;
  goal: string;
  complexityMode: ProjectComplexityMode;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt">;
