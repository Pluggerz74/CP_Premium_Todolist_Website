import type { AppView } from "../../types/view";
import type { TranslationKey } from "../../i18n/translations";

const viewTitleKeys: Record<AppView, TranslationKey> = {
  dashboard: "view.dashboard",
  today: "view.today",
  upcoming: "view.upcoming",
  "high-value": "view.highValue",
  focus: "view.focus",
  projects: "view.projects",
  "project-overview": "view.projectOverview",
  "project-map": "view.projectMap",
  backlog: "view.backlog",
  search: "view.search",
  "simple-list": "view.simpleList",
  settings: "view.settings",
};

export function getViewTitleKey(view: AppView): TranslationKey {
  return viewTitleKeys[view];
}

export function getViewEyebrowKey(
  view: AppView,
  complexityMode: "simple" | "complex",
): TranslationKey {
  if (view === "project-map" || view === "backlog") return "eyebrow.complexPlanning";
  if (view === "simple-list") return "eyebrow.simpleExecution";
  if (complexityMode === "complex") return "eyebrow.complexWorkspace";
  return "eyebrow.simpleWorkspace";
}

/** @deprecated Use getViewTitleKey with translate() or useI18n */
export function getViewTitle(view: AppView): string {
  const legacy: Record<AppView, string> = {
    dashboard: "Dashboard",
    today: "Today",
    upcoming: "Upcoming",
    "high-value": "High-value ranking",
    focus: "Focus mode",
    projects: "Projects",
    "project-overview": "Project overview",
    "project-map": "Project map",
    backlog: "Backlog",
    search: "Search",
    "simple-list": "Simple list",
    settings: "Settings",
  };
  return legacy[view];
}

/** @deprecated Use getViewEyebrowKey with translate() or useI18n */
export function getViewEyebrow(view: AppView, complexityMode: "simple" | "complex"): string {
  if (view === "project-map" || view === "backlog") return "Complex project planning";
  if (view === "simple-list") return "Simple everyday execution";
  if (complexityMode === "complex") return "Complex workspace";
  return "Simple workspace";
}
