import type { AppView } from "../../types/view";

export function getViewTitle(view: AppView): string {
  const titles: Record<AppView, string> = {
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

  return titles[view];
}

export function getViewEyebrow(view: AppView, complexityMode: "simple" | "complex"): string {
  if (view === "project-map" || view === "backlog") return "Complex project planning";
  if (view === "simple-list") return "Simple everyday execution";
  if (complexityMode === "complex") return "Complex workspace";
  return "Simple workspace";
}
