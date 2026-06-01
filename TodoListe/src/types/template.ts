import type { ProjectComplexityMode } from "./project";

export type ProjectTemplateId =
  | "simple-todo"
  | "game-development"
  | "saas-product"
  | "website-project"
  | "content-project"
  | "learning-project";

export type ProjectTemplate = {
  id: ProjectTemplateId;
  name: string;
  description: string;
  complexityMode: ProjectComplexityMode;
  defaultGoal: string;
  defaultColor: string;
  areaTitles: string[];
};
