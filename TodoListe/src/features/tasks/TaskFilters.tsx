import type { AppView } from "../../types/view";

export function getViewTitle(view: AppView): string {
  const titles: Record<AppView, string> = {
    dashboard: "Dashboard",
    today: "Today",
    upcoming: "Upcoming",
    "high-value": "High-value ranking",
    focus: "Focus mode",
    settings: "Settings",
  };

  return titles[view];
}
