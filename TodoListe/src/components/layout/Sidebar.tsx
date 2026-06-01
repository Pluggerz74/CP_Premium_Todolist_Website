import { appConfig } from "../../config/app";
import type { Project } from "../../types/project";
import type { AppView } from "../../types/view";
import { Button } from "../ui/Button";

const navItems: Array<{ label: string; value: AppView }> = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Today", value: "today" },
  { label: "Upcoming", value: "upcoming" },
  { label: "High Value", value: "high-value" },
  { label: "Focus", value: "focus" },
  { label: "Settings", value: "settings" },
];

type SidebarProps = {
  projects: Project[];
  activeView: AppView;
  selectedProjectId: string | null;
  onViewChange: (view: AppView) => void;
  onProjectSelect: (projectId: string | null) => void;
  onNewProject: () => void;
};

export function Sidebar({
  projects,
  activeView,
  selectedProjectId,
  onViewChange,
  onProjectSelect,
  onNewProject,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand__mark">✓</div>
        <div>
          <strong>{appConfig.name}</strong>
          <span>Command Center</span>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <button
            key={item.value}
            className={activeView === item.value ? "sidebar__item is-active" : "sidebar__item"}
            onClick={() => onViewChange(item.value)}
          >
            {item.label}
          </button>
        ))}
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
            {project.name}
          </button>
        ))}
      </section>
    </aside>
  );
}
