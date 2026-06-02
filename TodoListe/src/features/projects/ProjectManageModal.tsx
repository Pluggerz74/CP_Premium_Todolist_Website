import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Project } from "../../types/project";
import type { Task } from "../../types/task";
import { isInboxProject } from "../../constants/inboxProject";
import { useI18n } from "../../i18n/useI18n";
import { getProjectDisplayName } from "../../utils/formatLabels";
import { Button } from "../../components/ui/Button";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";

export type ProjectDeleteStrategy = "move-to-inbox" | "delete-tasks";

type ProjectManageModalProps = {
  projects: Project[];
  tasks: Task[];
  complexityMode: "simple" | "complex";
  onCreateProject: () => void;
  onRenameProject: (projectId: string, name: string) => void;
  onDeleteProject: (projectId: string, strategy: ProjectDeleteStrategy) => void;
  onSelectProject?: (projectId: string) => void;
  selectedProjectId?: string | null;
  autoDeleteProjectId?: string | null;
  onAutoDeleteHandled?: () => void;
};

type DeleteState = {
  project: Project;
  taskCount: number;
  strategy: ProjectDeleteStrategy;
};

export function ProjectManageModal({
  projects,
  tasks,
  complexityMode,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
  onSelectProject,
  selectedProjectId,
  autoDeleteProjectId,
  onAutoDeleteHandled,
}: ProjectManageModalProps) {
  const { t, language } = useI18n();
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteState, setDeleteState] = useState<DeleteState | null>(null);

  useEffect(() => {
    if (!autoDeleteProjectId) return;
    const project = projects.find((item) => item.id === autoDeleteProjectId);
    if (project && !isInboxProject(project.id)) {
      setDeleteState({
        project,
        taskCount: tasks.filter((task) => task.projectId === project.id).length,
        strategy: "move-to-inbox",
      });
    }
    onAutoDeleteHandled?.();
  }, [autoDeleteProjectId, projects, tasks, onAutoDeleteHandled]);

  const taskCountByProject = useMemo(() => {
    const counts = new Map<string, number>();
    for (const task of tasks) {
      counts.set(task.projectId, (counts.get(task.projectId) ?? 0) + 1);
    }
    return counts;
  }, [tasks]);

  const sortedProjects = useMemo(
    () =>
      [...projects].sort((a, b) => {
        if (isInboxProject(a.id)) return -1;
        if (isInboxProject(b.id)) return 1;
        return a.name.localeCompare(b.name);
      }),
    [projects],
  );

  const manageTitle =
    complexityMode === "simple" ? t("projectManage.titleLists") : t("projectManage.titleProjects");

  function startRename(project: Project) {
    setRenamingId(project.id);
    setRenameValue(getProjectDisplayName(project, language));
  }

  function submitRename(event: FormEvent) {
    event.preventDefault();
    if (!renamingId || !renameValue.trim() || isInboxProject(renamingId)) {
      setRenamingId(null);
      return;
    }
    onRenameProject(renamingId, renameValue.trim());
    setRenamingId(null);
  }

  function openDelete(project: Project) {
    setDeleteState({
      project,
      taskCount: taskCountByProject.get(project.id) ?? 0,
      strategy: "move-to-inbox",
    });
  }

  function confirmDelete() {
    if (!deleteState) return;
    onDeleteProject(deleteState.project.id, deleteState.strategy);
    setDeleteState(null);
  }

  const isDemoWarning =
    deleteState &&
    (deleteState.project.complexityMode === "complex" || deleteState.taskCount >= 5);

  if (deleteState) {
    const displayName = getProjectDisplayName(deleteState.project, language);
    const entityLabel =
      deleteState.project.complexityMode === "simple" ? t("label.list") : t("label.project");

    return (
      <ConfirmDialog
        title={
          deleteState.project.complexityMode === "simple"
            ? t("projectManage.deleteList")
            : t("projectManage.deleteProject")
        }
        message={
          <>
            <p>
              {t("projectManage.deleteIntro", {
                name: displayName,
                count: deleteState.taskCount,
                entity: entityLabel,
              })}
            </p>
            {deleteState.taskCount > 0 ? (
              <fieldset className="confirm-dialog__options">
                <legend>{t("projectManage.taskHandling")}</legend>
                <label className="confirm-dialog__option">
                  <input
                    type="radio"
                    name="delete-strategy"
                    checked={deleteState.strategy === "move-to-inbox"}
                    onChange={() =>
                      setDeleteState((current) =>
                        current ? { ...current, strategy: "move-to-inbox" } : current,
                      )
                    }
                  />
                  {t("projectManage.moveToInbox")}
                </label>
                <label className="confirm-dialog__option">
                  <input
                    type="radio"
                    name="delete-strategy"
                    checked={deleteState.strategy === "delete-tasks"}
                    onChange={() =>
                      setDeleteState((current) =>
                        current ? { ...current, strategy: "delete-tasks" } : current,
                      )
                    }
                  />
                  {t("projectManage.deleteTasksToo")}
                </label>
              </fieldset>
            ) : null}
            {isDemoWarning ? (
              <p className="confirm-dialog__warning">{t("projectManage.demoWarning")}</p>
            ) : null}
            <p className="confirm-dialog__hint">{t("projectManage.cannotUndo")}</p>
          </>
        }
        confirmLabel={t("btn.delete")}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteState(null)}
      />
    );
  }

  return (
    <div className="project-manage">
      <p className="project-manage__intro">{t("projectManage.intro")}</p>

      <div className="project-manage__toolbar">
        <Button type="button" onClick={onCreateProject}>
          {complexityMode === "simple" ? t("projectManage.createList") : t("projectManage.createProject")}
        </Button>
      </div>

      <ul className="project-manage__list">
        {sortedProjects.map((project) => {
          const count = taskCountByProject.get(project.id) ?? 0;
          const isInbox = isInboxProject(project.id);
          const isActive = selectedProjectId === project.id;
          const displayName = getProjectDisplayName(project, language);

          return (
            <li
              key={project.id}
              className={isActive ? "project-manage__row is-active" : "project-manage__row"}
            >
              <span className="project-dot" style={{ background: project.color }} aria-hidden="true" />
              <div className="project-manage__info">
                {renamingId === project.id && !isInbox ? (
                  <form className="project-manage__rename-form" onSubmit={submitRename}>
                    <input
                      value={renameValue}
                      onChange={(event) => setRenameValue(event.target.value)}
                      aria-label={
                        project.complexityMode === "simple"
                          ? t("projectManage.listName")
                          : t("projectManage.projectName")
                      }
                      autoFocus
                    />
                    <Button type="submit" variant="secondary">
                      {t("btn.save")}
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setRenamingId(null)}>
                      {t("btn.cancel")}
                    </Button>
                  </form>
                ) : (
                  <>
                    <button
                      type="button"
                      className="project-manage__name"
                      onClick={() => onSelectProject?.(project.id)}
                    >
                      {displayName}
                      {project.complexityMode === "complex" ? (
                        <small>{t("nav.complex")}</small>
                      ) : null}
                    </button>
                    <span className="project-manage__count">
                      {t("projectManage.taskCount", { count })}
                    </span>
                  </>
                )}
              </div>
              {!isInbox && renamingId !== project.id ? (
                <div className="project-manage__actions">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => startRename(project)}
                    aria-label={t("projectManage.renameAria", { name: displayName })}
                  >
                    {t("btn.rename")}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => openDelete(project)}
                    aria-label={t("projectManage.deleteAria", { name: displayName })}
                  >
                    {t("btn.delete")}
                  </Button>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
