import { appConfig } from "../../config/app";
import type { Project } from "../../types/project";
import type { ProjectComplexityMode } from "../../types/project";
import type { AppView } from "../../types/view";
import { ModeBadge } from "../ui/ModeBadge";
import { Button } from "../ui/Button";

const coreNav: Array<{ label: string; value: AppView; icon: string }> = [
  { label: "Dashboard", value: "dashboard", icon: "▦" },
  { label: "Today", value: "today", icon: "◷" },
  { label: "Upcoming", value: "upcoming", icon: "→" },
  { label: "High Value", value: "high-value", icon: "★" },
  { label: "Focus", value: "focus", icon: "◎" },
];

const simpleNav: Array<{ label: string; value: AppView; icon: string }> = [
  { label: "Simple List", value: "simple-list", icon: "≡" },
];

const complexNav: Array<{ label: string; value: AppView; icon: string }> = [
  { label: "Projects", value: "projects", icon: "◫" },
  { label: "Overview", value: "project-overview", icon: "◉" },
  { label: "Project Map", value: "project-map", icon: "⎋" },
  { label: "Backlog", value: "backlog", icon: "▤" },
  { label: "Search", value: "search", icon: "⌕" },
];

type SidebarProps = {
  projects: Project[];
  activeView: AppView;
  selectedProjectId: string | null;
  complexityMode: ProjectComplexityMode;
  onViewChange: (view: AppView) => void;
  onProjectSelect: (projectId: string | null) => void;
  onNewProject: () => void;
  onQuickAdd?: () => void;
};

export function Sidebar({
  projects,
  activeView,
  selectedProjectId,
  complexityMode,
  onViewChange,
  onProjectSelect,
  onNewProject,
  onQuickAdd,
}: SidebarProps) {
  const modeNav = complexityMode === "complex" ? complexNav : simpleNav;

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand__mark" aria-hidden="true">
          ✓
        </div>
        <div>
          <strong>{appConfig.name}</strong>
          <span>Command Center</span>
        </div>
      </div>

      <div className="sidebar__mode">
        <ModeBadge mode={complexityMode} />
      </div>

      {onQuickAdd && complexityMode === "simple" ? (
        <div className="sidebar__quick-add">
          <Button onClick={onQuickAdd}>Quick Add</Button>
        </div>
      ) : null}

      <nav className="sidebar__nav" aria-label="Primary navigation">
        {coreNav.map((item) => (
          <button
            key={item.value}
            type="button"
            className={activeView === item.value ? "sidebar__item is-active" : "sidebar__item"}
            onClick={() => onViewChange(item.value)}
          >
            <span className="sidebar__item-icon" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <nav className="sidebar__nav sidebar__nav--secondary" aria-label="Mode navigation">
        <p className="sidebar__section-title">Mode views</p>
        {modeNav.map((item) => (
          <button
            key={item.value}
            type="button"
            className={activeView === item.value ? "sidebar__item is-active" : "sidebar__item"}
            onClick={() => onViewChange(item.value)}
          >
            <span className="sidebar__item-icon" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
        <button
          type="button"
          className={activeView === "settings" ? "sidebar__item is-active" : "sidebar__item"}
          onClick={() => onViewChange("settings")}
        >
          <span className="sidebar__item-icon" aria-hidden="true">
            ⚙
          </span>
          Settings
        </button>
      </nav>

      <section className="sidebar__projects" aria-label="Projects">
        <div className="sidebar__section-title">
          <span>Projects</span>
          <Button variant="ghost" onClick={onNewProject} aria-label="Create project">
            +
          </Button>
        </div>
        <button
          type="button"
          className={selectedProjectId === null ? "sidebar__project is-active" : "sidebar__project"}
          onClick={() => onProjectSelect(null)}
        >
          <span className="sidebar__item-icon" aria-hidden="true">
            ◈
          </span>
          <span className="sidebar__project-label">All projects</span>
        </button>
        {projects.map((project) => (
          <button
            key={project.id}
            type="button"
            className={selectedProjectId === project.id ? "sidebar__project is-active" : "sidebar__project"}
            onClick={() => onProjectSelect(project.id)}
          >
            <span className="project-dot" style={{ background: project.color }} aria-hidden="true" />
            <span className="sidebar__project-label">
              {project.name}
              {project.complexityMode === "complex" ? <small>Complex</small> : null}
            </span>
          </button>
        ))}
      </section>
    </aside>
  );
}
