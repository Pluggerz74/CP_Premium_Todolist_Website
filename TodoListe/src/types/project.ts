export type ProjectStatus = "active" | "paused" | "archived";

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  color: string;
  goal: string;
  createdAt: string;
};

export type ProjectInput = Omit<Project, "id" | "createdAt">;
