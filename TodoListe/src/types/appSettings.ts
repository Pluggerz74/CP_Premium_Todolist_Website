import type { Language } from "../i18n/translations";
import type { ProjectComplexityMode } from "./project";

export type ViewDensity = "comfortable" | "compact";

export type AppSettings = {
  complexityMode: ProjectComplexityMode;
  viewDensity: ViewDensity;
  language: Language;
  collapsedSections: Record<string, boolean>;
};

export type TaskFilterState = {
  searchQuery: string;
  projectId: string | null;
  areaId: string | null;
  milestoneId: string | null;
  status: "all" | "todo" | "in-progress" | "done";
  tag: string | null;
  minScore: number | null;
};
