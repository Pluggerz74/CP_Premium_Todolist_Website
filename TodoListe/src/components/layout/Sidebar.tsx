import { appConfig } from "../../config/app";
import type { Project } from "../../types/project";
import type { ProjectComplexityMode } from "../../types/project";
import type { AppView } from "../../types/view";
import type { TranslationKey } from "../../i18n/translations";
import { useI18n } from "../../i18n/useI18n";
import { LanguageSwitch } from "../ui/LanguageSwitch";
import { ModeBadge } from "../ui/ModeBadge";
import { Button } from "../ui/Button";

const coreNav: Array<{ labelKey: TranslationKey; value: AppView; icon: string }> = [
  { labelKey: "nav.dashboard", value: "dashboard", icon: "▦" },
  { labelKey: "nav.today", value: "today", icon: "◷" },
  { labelKey: "nav.upcoming", value: "upcoming", icon: "→" },
  { labelKey: "nav.highValue", value: "high-value", icon: "★" },
  { labelKey: "nav.focus", value: "focus", icon: "◎" },
];

const simpleNav: Array<{ labelKey: TranslationKey; value: AppView; icon: string }> = [
  { labelKey: "nav.simpleList", value: "simple-list", icon: "≡" },
];

const complexNav: Array<{ labelKey: TranslationKey; value: AppView; icon: string }> = [
  { labelKey: "nav.projects", value: "projects", icon: "◫" },
  { labelKey: "nav.overview", value: "project-overview", icon: "◉" },
  { labelKey: "nav.projectMap", value: "project-map", icon: "⎋" },
  { labelKey: "nav.backlog", value: "backlog", icon: "▤" },
  { labelKey: "nav.search", value: "search", icon: "⌕" },
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
  const { t } = useI18n();
  const modeNav = complexityMode === "complex" ? complexNav : simpleNav;

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand__mark" aria-hidden="true">
          ✓
        </div>
        <div>
          <strong>{appConfig.name}</strong>
          <span>{t("app.commandCenter")}</span>
        </div>
      </div>

      <div className="sidebar__mode">
        <ModeBadge mode={complexityMode} />
      </div>

      {onQuickAdd && complexityMode === "simple" ? (
        <div className="sidebar__quick-add">
          <Button onClick={onQuickAdd}>{t("btn.quickAdd")}</Button>
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
            {t(item.labelKey)}
          </button>
        ))}
      </nav>

      <nav className="sidebar__nav sidebar__nav--secondary" aria-label="Mode navigation">
        <p className="sidebar__section-title">{t("nav.modeViews")}</p>
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
            {t(item.labelKey)}
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
          {t("nav.settings")}
        </button>
      </nav>

      <section className="sidebar__projects" aria-label="Projects">
        <div className="sidebar__section-title">
          <span>{t("nav.projects")}</span>
          <Button variant="ghost" onClick={onNewProject} aria-label={t("modal.createProject")}>
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
          <span className="sidebar__project-label">{t("nav.allProjects")}</span>
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
              {project.complexityMode === "complex" ? <small>{t("nav.complex")}</small> : null}
            </span>
          </button>
        ))}
      </section>

      <div className="sidebar__footer">
        <LanguageSwitch variant="compact" />
      </div>
    </aside>
  );
}
