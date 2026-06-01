import { appConfig } from "../../config/app";
import type { Project } from "../../types/project";
import type { ProjectComplexityMode } from "../../types/project";
import type { AppView } from "../../types/view";
import { ModeBadge } from "../ui/ModeBadge";
import { Button } from "../ui/Button";

const coreNav: Array<{ label: string; value: AppView }> = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Today", value: "today" },
  { label: "Upcoming", value: "upcoming" },
  { label: "High Value", value: "high-value" },
  { label: "Focus", value: "focus" },
];

const simpleNav: Array<{ label: string; value: AppView }> = [
  { label: "Simple List", value: "simple-list" },
];

const complexNav: Array<{ label: string; value: AppView }> = [
  { label: "Projects", value: "projects" },
  { label: "Overview", value: "project-overview" },
  { label: "Project Map", value: "project-map" },
  { label: "Backlog", value: "backlog" },
  { label: "Search", value: "search" },
];

type SidebarProps = {
  projects: Project[];
  activeView: AppView;
  selectedProjectId: string | null;
  complexityMode: ProjectComplexityMode;
  onViewChange: (view: AppView) => void;
  onProjectSelect: (projectId: string | null) => void;
  onNewProject: () => void;
};

export function Sidebar({
  projects,
  activeView,
  selectedProjectId,
  complexityMode,
  onViewChange,
  onProjectSelect,
  onNewProject,
}: SidebarProps) {
  const modeNav = complexityMode === "complex" ? complexNav : simpleNav;

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand__mark">✓</div>
        <div>
          <strong>{appConfig.name}</strong>
          <span>Command Center</span>
        </div>
      </div>

      <div className="sidebar__mode">
        <ModeBadge mode={complexityMode} />
      </div>

      <nav className="sidebar__nav" aria-label="Primary navigation">
        {coreNav.map((item) => (
          <button
            key={item.value}
            className={activeView === item.value ? "sidebar__item is-active" : "sidebar__item"}
            onClick={() => onViewChange(item.value)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <nav className="sidebar__nav sidebar__nav--secondary" aria-label="Mode navigation">
        <p className="sidebar__section-title">Mode views</p>
        {modeNav.map((item) => (
          <button
            key={item.value}
            className={activeView === item.value ? "sidebar__item is-active" : "sidebar__item"}
            onClick={() => onViewChange(item.value)}
          >
            {item.label}
          </button>
        ))}
        <button
          className={activeView === "settings" ? "sidebar__item is-active" : "sidebar__item"}
          onClick={() => onViewChange("settings")}
        >
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
          className={selectedProjectId === null ? "sidebar__project is-active" : "sidebar__project"}
          onClick={() => onProjectSelect(null)}
        >
          All projects
        </button>
        {projects.map((project) => (
          <button
            key={project.id}
            className={selectedProjectId === project.id ? "sidebar__project is-active" : "sidebar__project"}
            onClick={() => onProjectSelect(project.id)}
          >
            <span className="project-dot" style={{ background: project.color }} />
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
