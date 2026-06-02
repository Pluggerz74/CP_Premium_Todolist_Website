import { useEffect, useMemo, useRef, useState } from "react";
import { appConfig } from "../../config/app";
import { isInboxProject } from "../../constants/inboxProject";
import type { Project } from "../../types/project";
import type { ProjectComplexityMode } from "../../types/project";
import type { Task } from "../../types/task";
import type { AppView } from "../../types/view";
import type { TranslationKey } from "../../i18n/translations";
import { useI18n } from "../../i18n/useI18n";
import { getProjectDisplayName } from "../../utils/formatLabels";
import { LanguageSwitch } from "../ui/LanguageSwitch";
import { ModeBadge } from "../ui/ModeBadge";
import { Button } from "../ui/Button";

const complexCoreNav: Array<{ labelKey: TranslationKey; value: AppView; icon: string }> = [
  { labelKey: "nav.dashboard", value: "dashboard", icon: "▦" },
  { labelKey: "nav.today", value: "today", icon: "◷" },
  { labelKey: "nav.upcoming", value: "upcoming", icon: "→" },
  { labelKey: "nav.highValue", value: "high-value", icon: "★" },
  { labelKey: "nav.focus", value: "focus", icon: "◎" },
];

const simpleCoreNav: Array<{ labelKey: TranslationKey; value: AppView; icon: string }> = [
  { labelKey: "nav.myTasks", value: "simple-list", icon: "≡" },
  { labelKey: "nav.today", value: "today", icon: "◷" },
  { labelKey: "nav.upcoming", value: "upcoming", icon: "→" },
  { labelKey: "nav.important", value: "high-value", icon: "★" },
];

const complexModeNav: Array<{ labelKey: TranslationKey; value: AppView; icon: string }> = [
  { labelKey: "nav.projects", value: "projects", icon: "◫" },
  { labelKey: "nav.overview", value: "project-overview", icon: "◉" },
  { labelKey: "nav.projectMap", value: "project-map", icon: "⎋" },
  { labelKey: "nav.backlog", value: "backlog", icon: "▤" },
  { labelKey: "nav.search", value: "search", icon: "⌕" },
];

type SidebarProps = {
  projects: Project[];
  tasks: Task[];
  activeView: AppView;
  selectedProjectId: string | null;
  complexityMode: ProjectComplexityMode;
  onViewChange: (view: AppView) => void;
  onProjectSelect: (projectId: string | null) => void;
  onNewProject: () => void;
  onManageProjects: () => void;
  onQuickAdd?: () => void;
  onRenameProject: (projectId: string, name: string) => void;
  onDeleteProject: (projectId: string) => void;
};

export function Sidebar({
  projects,
  tasks,
  activeView,
  selectedProjectId,
  complexityMode,
  onViewChange,
  onProjectSelect,
  onNewProject,
  onManageProjects,
  onQuickAdd,
  onRenameProject,
  onDeleteProject,
}: SidebarProps) {
  const { t, language } = useI18n();
  const [menuProjectId, setMenuProjectId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const openMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuProjectId) return;
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (openMenuRef.current && !openMenuRef.current.contains(target)) {
        setMenuProjectId(null);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [menuProjectId]);

  const coreNav = complexityMode === "simple" ? simpleCoreNav : complexCoreNav;
  const taskCountByProject = useMemo(() => {
    const counts = new Map<string, number>();
    for (const task of tasks) {
      counts.set(task.projectId, (counts.get(task.projectId) ?? 0) + 1);
    }
    return counts;
  }, [tasks]);

  const visibleProjects = useMemo(
    () =>
      complexityMode === "simple"
        ? projects.filter((project) => project.complexityMode === "simple")
        : projects,
    [projects, complexityMode],
  );

  function startRename(project: Project) {
    setRenamingId(project.id);
    setRenameValue(getProjectDisplayName(project, language));
    setMenuProjectId(null);
  }

  function submitRename(projectId: string) {
    if (renameValue.trim() && !isInboxProject(projectId)) {
      onRenameProject(projectId, renameValue.trim());
    }
    setRenamingId(null);
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand__mark" aria-hidden="true">
          ✓
        </div>
        <div>
          <strong>{appConfig.name}</strong>
          <span>{complexityMode === "simple" ? t("mode.simpleBadge") : t("mode.complexBadge")}</span>
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

      <nav className="sidebar__nav" aria-label={t("aria.navPrimary")}>
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

      {complexityMode === "complex" ? (
        <nav className="sidebar__nav sidebar__nav--secondary" aria-label={t("aria.navMode")}>
          <p className="sidebar__section-title">{t("nav.modeViews")}</p>
          {complexModeNav.map((item) => (
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
      ) : null}

      <nav className="sidebar__nav sidebar__nav--secondary">
        {complexityMode === "simple" ? (
          <button
            type="button"
            className="sidebar__item"
            onClick={onManageProjects}
            aria-label={t("aria.openManageProjects")}
          >
            <span className="sidebar__item-icon" aria-hidden="true">
              ☰
            </span>
            {t("nav.lists")}
          </button>
        ) : null}
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

      <section className="sidebar__projects" aria-label={t("aria.projectList")}>
        <div className="sidebar__section-title">
          <span>{complexityMode === "simple" ? t("nav.lists") : t("nav.projects")}</span>
          <div className="sidebar__section-actions">
            <Button
              variant="ghost"
              onClick={onManageProjects}
              aria-label={t("aria.openManageProjects")}
              title={complexityMode === "simple" ? t("nav.manageLists") : t("nav.manageProjects")}
            >
              …
            </Button>
            <Button variant="ghost" onClick={onNewProject} aria-label={t("modal.createProject")}>
              +
            </Button>
          </div>
        </div>
        {complexityMode === "complex" ? (
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
        ) : null}
        {visibleProjects.map((project) => {
          const displayName = getProjectDisplayName(project, language);
          const count = taskCountByProject.get(project.id) ?? 0;
          const isInbox = isInboxProject(project.id);

          return (
            <div
              key={project.id}
              className={
                selectedProjectId === project.id
                  ? "sidebar__project-row is-active"
                  : "sidebar__project-row"
              }
            >
              {renamingId === project.id && !isInbox ? (
                <div className="sidebar__project-rename">
                  <input
                    value={renameValue}
                    onChange={(event) => setRenameValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") submitRename(project.id);
                      if (event.key === "Escape") setRenamingId(null);
                    }}
                    aria-label={
                      project.complexityMode === "simple"
                        ? t("projectManage.listName")
                        : t("projectManage.projectName")
                    }
                    autoFocus
                  />
                  <Button type="button" variant="ghost" onClick={() => submitRename(project.id)}>
                    {t("btn.save")}
                  </Button>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    className="sidebar__project"
                    onClick={() => onProjectSelect(project.id)}
                  >
                    <span className="project-dot" style={{ background: project.color }} aria-hidden="true" />
                    <span className="sidebar__project-label">
                      {displayName}
                      {project.complexityMode === "complex" ? <small>{t("nav.complex")}</small> : null}
                      <small className="sidebar__project-count">{count}</small>
                    </span>
                  </button>
                  {!isInbox ? (
                    <div
                      className="sidebar__project-menu"
                      ref={menuProjectId === project.id ? openMenuRef : undefined}
                    >
                      <button
                        type="button"
                        className="sidebar__project-menu-trigger"
                        aria-label={t("aria.projectActions", { name: displayName })}
                        aria-expanded={menuProjectId === project.id}
                        aria-haspopup="menu"
                        onClick={() =>
                          setMenuProjectId((current) => (current === project.id ? null : project.id))
                        }
                      >
                        ⋯
                      </button>
                      {menuProjectId === project.id ? (
                        <div className="sidebar__project-menu-panel" role="menu">
                          <button type="button" role="menuitem" onClick={() => startRename(project)}>
                            {t("btn.rename")}
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className="is-danger"
                            onClick={() => {
                              setMenuProjectId(null);
                              onDeleteProject(project.id);
                            }}
                          >
                            {t("btn.delete")}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </>
              )}
            </div>
          );
        })}
      </section>

      <div className="sidebar__footer">
        <LanguageSwitch variant="compact" />
      </div>
    </aside>
  );
}
