import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { Modal } from "./components/ui/Modal";
import { Dashboard } from "./features/dashboard/Dashboard";
import { HighValuePanel } from "./features/dashboard/HighValuePanel";
import { TodayPanel } from "./features/dashboard/TodayPanel";
import { UpcomingPanel } from "./features/dashboard/UpcomingPanel";
import { FocusMode } from "./features/focus/FocusMode";
import { BacklogPanel } from "./features/projects/BacklogPanel";
import { ProjectForm } from "./features/projects/ProjectForm";
import { ProjectMap } from "./features/projects/ProjectMap";
import { ProjectOverview } from "./features/projects/ProjectOverview";
import { ProjectsPanel } from "./features/projects/ProjectsPanel";
import { SearchPanel } from "./features/projects/SearchPanel";
import { SimpleBoardPanel } from "./features/projects/SimpleBoardPanel";
import {
  ProjectManageModal,
  type ProjectDeleteStrategy,
} from "./features/projects/ProjectManageModal";
import { SettingsPanel } from "./features/settings/SettingsPanel";
import { ConfirmDialog } from "./components/ui/ConfirmDialog";
import { INBOX_PROJECT_ID, ensureInboxInProjects } from "./constants/inboxProject";
import { TaskFilterBar } from "./features/tasks/TaskFilterBar";
import { SimpleFilterBar } from "./features/tasks/SimpleFilterBar";
import { getViewEyebrowKey, getViewTitleKey } from "./features/tasks/TaskFilters";
import { TaskForm } from "./features/tasks/TaskForm";
import { TaskEditForm } from "./features/tasks/TaskEditForm";
import { QuickAddForm } from "./features/tasks/QuickAddForm";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { I18nProvider } from "./i18n/I18nProvider";
import { translate, translateWithParams } from "./i18n/translations";
import { useAppSettings } from "./hooks/useAppSettings";
import { useHierarchy } from "./hooks/useHierarchy";
import { useProjects } from "./hooks/useProjects";
import { useTaskIndex, useProjectMap } from "./hooks/useTaskIndex";
import { useTasks } from "./hooks/useTasks";
import { useTheme } from "./hooks/useTheme";
import { useViewState } from "./hooks/useViewState";
import type { AppSettings } from "./types/appSettings";
import type { ProjectTemplateId } from "./types/template";
import type { Task } from "./types/task";
import type { TaskInput, TaskStatus } from "./types/task";
import { getDemoResetPayload, importAppData, type AppDataSnapshot } from "./utils/dataBackup";
import { migrateHierarchy, migrateProjects, migrateTasks } from "./utils/migration";
import { generateScaleTestPayload } from "./utils/scaleTestData";
import {
  filterTasksWithIndex,
  getHighValueTasks,
  getNextBestAction,
  getTodayTasks,
  getUpcomingTasks,
  scopeTasksByModeWithIndex,
  scopeTasksByProject,
} from "./utils/selectors";
import { sortByHighValueScore } from "./utils/scoring";
import type { StorageInitResult } from "./utils/storageMigration";

type AppProps = {
  storageInit?: StorageInitResult;
};

export function App({ storageInit }: AppProps) {
  const { projects, createProjectWithTemplate, setProjects, updateProject, deleteProject } =
    useProjects();
  const {
    tasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    setTasks,
    deleteTasksForProject,
    moveTasksToProject,
  } = useTasks();
  const { hierarchy, addHierarchy, setHierarchy, removeHierarchyForProject } = useHierarchy();
  const {
    settings,
    filters,
    setComplexityMode,
    setViewDensity,
    setLanguage,
    toggleSectionCollapsed,
    updateFilters,
    resetFilters,
  } = useAppSettings();
  const { theme, toggleTheme } = useTheme();
  const { activeView, setActiveView, selectedProjectId, setSelectedProjectId } = useViewState();
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isQuickAddOpen, setQuickAddOpen] = useState(false);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isManageModalOpen, setManageModalOpen] = useState(false);
  const [autoDeleteProjectId, setAutoDeleteProjectId] = useState<string | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [focusTaskId, setFocusTaskId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const taskIndex = useTaskIndex(tasks, projects);
  const projectMap = useProjectMap(projects);

  const selectedProject = useMemo(
    () => (selectedProjectId ? projectMap.get(selectedProjectId) : undefined),
    [projectMap, selectedProjectId],
  );

  const scopedTasks = useMemo(() => {
    let result = scopeTasksByModeWithIndex(tasks, taskIndex, settings.complexityMode);
    result = scopeTasksByProject(result, selectedProjectId);
    return sortByHighValueScore(result);
  }, [tasks, taskIndex, settings.complexityMode, selectedProjectId]);

  const filteredTasks = useMemo(() => {
    const mergedFilters = {
      ...filters,
      projectId: filters.projectId ?? selectedProjectId,
    };
    return filterTasksWithIndex(scopedTasks, mergedFilters, taskIndex);
  }, [scopedTasks, filters, selectedProjectId, taskIndex]);

  const focusTask = useMemo(() => {
    if (focusTaskId) return taskIndex.byId.get(focusTaskId) ?? null;
    return getNextBestAction(scopeTasksByModeWithIndex(tasks, taskIndex, settings.complexityMode));
  }, [focusTaskId, tasks, taskIndex, settings.complexityMode]);

  const focusProject = focusTask ? projectMap.get(focusTask.projectId) : undefined;

  const showFilterBar = ["dashboard", "high-value", "backlog", "search", "simple-list", "today", "upcoming"].includes(
    activeView,
  );
  const showSimpleFilterBar =
    settings.complexityMode === "simple" &&
    ["today", "upcoming", "dashboard"].includes(activeView);
  const showComplexFilterBar = showFilterBar && !showSimpleFilterBar;

  const storageWarnings = storageInit?.warnings ?? [];

  function handleTaskSubmit(input: TaskInput) {
    createTask(input);
    setTaskModalOpen(false);
  }

  function handleProjectSubmit(input: {
    name: string;
    description: string;
    goal: string;
    templateId: ProjectTemplateId;
  }) {
    createProjectWithTemplate(input.name, input.description, input.goal, input.templateId, addHierarchy);
    setProjectModalOpen(false);
  }

  function handleStatusChange(taskId: string, status: TaskStatus) {
    updateTaskStatus(taskId, status);
  }

  function handleFocus(taskId: string) {
    setFocusTaskId(taskId);
    setActiveView("focus");
  }

  function handleEditTask(taskId: string) {
    const task = taskIndex.byId.get(taskId);
    if (task) setEditingTask(task);
  }

  function handleTaskEditSubmit(taskId: string, input: Partial<TaskInput>) {
    updateTask(taskId, input);
    setEditingTask(null);
  }

  function handleQuickAddSubmit(input: TaskInput) {
    createTask(input);
    setQuickAddOpen(false);
  }

  function handleImportBackup(snapshot: AppDataSnapshot) {
    const result = importAppData(snapshot);
    if (!result.ok) {
      throw new Error(result.error);
    }
    setProjects(ensureInboxInProjects(migrateProjects(snapshot.projects)));
    setTasks(migrateTasks(snapshot.tasks));
    setHierarchy(migrateHierarchy(snapshot.hierarchy));
    resetFilters();
    setSelectedProjectId(null);
    setFocusTaskId(null);
    setActiveView("dashboard");
  }

  function closeModals() {
    setTaskModalOpen(false);
    setQuickAddOpen(false);
    setProjectModalOpen(false);
    setEditingTask(null);
  }

  useKeyboardShortcuts({
    searchInputRef,
    onQuickAdd: () => setQuickAddOpen(true),
    onEscape: closeModals,
  });

  function handleSearchChange(query: string) {
    updateFilters({ searchQuery: query });
    if (query.trim() && activeView !== "search") {
      setActiveView("search");
    }
  }

  function handleResetDemoData() {
    const payload = getDemoResetPayload();
    setProjects(payload.projects);
    setTasks(payload.tasks);
    setHierarchy(payload.hierarchy);
    resetFilters();
    setSelectedProjectId(null);
    setActiveView("dashboard");
  }

  function handleLoadScaleTestData() {
    const payload = generateScaleTestPayload(1200);
    setProjects(payload.projects);
    setTasks(payload.tasks);
    setHierarchy(payload.hierarchy);
    resetFilters();
    setComplexityMode("complex");
    setSelectedProjectId("project-game-dev");
    setActiveView("backlog");
  }

  useEffect(() => {
    if (settings.complexityMode !== "simple") return;
    if (activeView === "dashboard") {
      setActiveView("simple-list");
    }
  }, [settings.complexityMode, activeView, setActiveView]);

  function handleRenameProject(projectId: string, name: string) {
    updateProject(projectId, { name });
  }

  function handleDeleteProject(projectId: string, strategy: ProjectDeleteStrategy) {
    if (projectId === INBOX_PROJECT_ID) return;

    if (strategy === "move-to-inbox") {
      moveTasksToProject(projectId, INBOX_PROJECT_ID);
    } else {
      deleteTasksForProject(projectId);
    }

    removeHierarchyForProject(projectId);
    deleteProject(projectId);

    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
    }
    if (activeView === "project-overview" || activeView === "project-map") {
      setActiveView(settings.complexityMode === "simple" ? "simple-list" : "projects");
    }
  }

  function handleRequestDeleteProject(projectId: string) {
    setAutoDeleteProjectId(projectId);
    setManageModalOpen(true);
  }

  function handleRequestDeleteTask(taskId: string) {
    setDeleteTaskId(taskId);
  }

  function confirmDeleteTask() {
    if (deleteTaskId) {
      deleteTask(deleteTaskId);
      if (editingTask?.id === deleteTaskId) {
        setEditingTask(null);
      }
      if (focusTaskId === deleteTaskId) {
        setFocusTaskId(null);
      }
    }
    setDeleteTaskId(null);
  }

  function handleProjectSelect(projectId: string | null) {
    setSelectedProjectId(projectId);
    if (settings.complexityMode === "simple" && projectId) {
      setActiveView("simple-list");
    }
  }

  function handleComplexityModeChange(mode: AppSettings["complexityMode"]) {
    setComplexityMode(mode);
    if (mode === "simple") {
      setActiveView("simple-list");
    }
  }

  function renderContent() {
    if (activeView === "dashboard") {
      return (
        <Dashboard
          projects={projects}
          tasks={getHighValueTasks(filteredTasks, 4)}
          allTasks={filteredTasks}
          complexityMode={settings.complexityMode}
          onStatusChange={handleStatusChange}
          onDelete={deleteTask}
          onFocus={handleFocus}
          onEdit={handleEditTask}
        />
      );
    }

    if (activeView === "today") {
      return (
        <TodayPanel
          projects={projects}
          tasks={getTodayTasks(filteredTasks)}
          onStatusChange={handleStatusChange}
          onDelete={deleteTask}
          onFocus={handleFocus}
          onEdit={handleEditTask}
          onQuickAdd={() => setQuickAddOpen(true)}
        />
      );
    }

    if (activeView === "upcoming") {
      return (
        <UpcomingPanel
          projects={projects}
          tasks={getUpcomingTasks(filteredTasks)}
          onStatusChange={handleStatusChange}
          onDelete={deleteTask}
          onFocus={handleFocus}
          onEdit={handleEditTask}
        />
      );
    }

    if (activeView === "high-value") {
      return (
        <HighValuePanel
          projects={projects}
          tasks={getHighValueTasks(filteredTasks)}
          onStatusChange={handleStatusChange}
          onDelete={deleteTask}
          onFocus={handleFocus}
          onEdit={handleEditTask}
        />
      );
    }

    if (activeView === "focus") {
      return (
        <FocusMode
          task={focusTask}
          project={focusProject}
          hierarchy={hierarchy}
          onStatusChange={handleStatusChange}
          onEdit={handleEditTask}
        />
      );
    }

    if (activeView === "projects") {
      return (
        <ProjectsPanel
          projects={projects}
          tasks={tasks}
          complexityMode={settings.complexityMode}
          onSelectProject={(projectId) => {
            setSelectedProjectId(projectId);
            setActiveView("project-overview");
          }}
        />
      );
    }

    if (activeView === "project-overview") {
      return (
        <ProjectOverview
          project={selectedProject}
          hierarchy={hierarchy}
          tasks={tasks}
          taskIndex={taskIndex}
          onFocus={handleFocus}
        />
      );
    }

    if (activeView === "project-map") {
      return (
        <ProjectMap
          project={selectedProject}
          hierarchy={hierarchy}
          taskIndex={taskIndex}
          collapsedSections={settings.collapsedSections}
          onToggleSection={toggleSectionCollapsed}
          onStatusChange={handleStatusChange}
          onDelete={deleteTask}
          onFocus={handleFocus}
        />
      );
    }

    if (activeView === "backlog") {
      return (
        <BacklogPanel
          projects={projects}
          tasks={filteredTasks}
          taskIndex={taskIndex}
          projectMap={projectMap}
          viewDensity={settings.viewDensity}
          onStatusChange={handleStatusChange}
          onDelete={deleteTask}
          onFocus={handleFocus}
          onEdit={handleEditTask}
        />
      );
    }

    if (activeView === "search") {
      return (
        <SearchPanel
          projects={projects}
          tasks={filteredTasks}
          projectMap={projectMap}
          query={filters.searchQuery}
          viewDensity={settings.viewDensity}
          onStatusChange={handleStatusChange}
          onDelete={deleteTask}
          onFocus={handleFocus}
          onEdit={handleEditTask}
        />
      );
    }

    if (activeView === "simple-list") {
      return (
        <SimpleBoardPanel
          tasks={filteredTasks}
          taskIndex={taskIndex}
          projectMap={projectMap}
          onStatusChange={handleStatusChange}
          onEdit={handleEditTask}
          onDelete={handleRequestDeleteTask}
          onFocus={handleFocus}
          onQuickAdd={() => setQuickAddOpen(true)}
        />
      );
    }

    return (
      <SettingsPanel
        theme={theme}
        settings={settings}
        onToggleTheme={toggleTheme}
        onComplexityModeChange={handleComplexityModeChange}
        onDensityChange={setViewDensity}
        onResetDemoData={handleResetDemoData}
        onLoadScaleTestData={handleLoadScaleTestData}
        onImportBackup={handleImportBackup}
        onManageProjects={() => setManageModalOpen(true)}
      />
    );
  }

  return (
    <I18nProvider language={settings.language} setLanguage={setLanguage}>
      <>
      <AppShell
        projects={projects}
        tasks={tasks}
        activeView={activeView}
        selectedProjectId={selectedProjectId}
        complexityMode={settings.complexityMode}
        searchQuery={filters.searchQuery}
        onViewChange={setActiveView}
        onProjectSelect={handleProjectSelect}
        onSearchChange={handleSearchChange}
        onNewTask={() => setTaskModalOpen(true)}
        onQuickAdd={() => setQuickAddOpen(true)}
        onNewProject={() => setProjectModalOpen(true)}
        onManageProjects={() => setManageModalOpen(true)}
        onRenameProject={handleRenameProject}
        onRequestDeleteProject={handleRequestDeleteProject}
        searchInputRef={searchInputRef}
      >
        {storageInit?.migrated ? (
          <div className="storage-banner" role="status">
            {translateWithParams(settings.language, "storage.migrated", { version: storageInit.toVersion })}
          </div>
        ) : null}

        {storageWarnings.length > 0 ? (
          <div className="storage-banner storage-banner--warning" role="alert">
            {storageWarnings.join(" ")}
          </div>
        ) : null}

        <div className="view-title">
          <p className="eyebrow">
            {translate(settings.language, getViewEyebrowKey(activeView, settings.complexityMode))}
            {selectedProject ? ` · ${selectedProject.name}` : ""}
          </p>
          <h2>{translate(settings.language, getViewTitleKey(activeView))}</h2>
        </div>

        {showSimpleFilterBar ? (
          <SimpleFilterBar
            filters={filters}
            projects={projects}
            onFiltersChange={updateFilters}
            onReset={resetFilters}
          />
        ) : null}

        {showComplexFilterBar ? (
          <TaskFilterBar
            filters={filters}
            projects={projects}
            taskIndex={taskIndex}
            hierarchy={hierarchy}
            viewDensity={settings.viewDensity}
            onFiltersChange={updateFilters}
            onReset={resetFilters}
            onDensityChange={setViewDensity}
          />
        ) : null}

        {renderContent()}
      </AppShell>

      <Modal title={translate(settings.language, "modal.createTask")} isOpen={isTaskModalOpen} onClose={() => setTaskModalOpen(false)}>
        <TaskForm
          projects={projects}
          hierarchy={hierarchy}
          defaultProjectId={selectedProjectId}
          onSubmit={handleTaskSubmit}
          onCancel={() => setTaskModalOpen(false)}
        />
      </Modal>

      <Modal title={translate(settings.language, "modal.quickAdd")} isOpen={isQuickAddOpen} onClose={() => setQuickAddOpen(false)}>
        <QuickAddForm
          projects={projects}
          defaultProjectId={selectedProjectId}
          onSubmit={handleQuickAddSubmit}
          onCancel={() => setQuickAddOpen(false)}
        />
      </Modal>

      <Modal
        title={translate(settings.language, "modal.editTask")}
        isOpen={editingTask !== null}
        onClose={() => setEditingTask(null)}
      >
        {editingTask ? (
          <TaskEditForm
            task={editingTask}
            projects={projects}
            hierarchy={hierarchy}
            onSubmit={handleTaskEditSubmit}
            onCancel={() => setEditingTask(null)}
            onDelete={(taskId) => {
              deleteTask(taskId);
              setEditingTask(null);
            }}
          />
        ) : null}
      </Modal>

      <Modal title={translate(settings.language, "modal.createProject")} isOpen={isProjectModalOpen} onClose={() => setProjectModalOpen(false)}>
        <ProjectForm onSubmit={handleProjectSubmit} onCancel={() => setProjectModalOpen(false)} />
      </Modal>

      <Modal
        title={translate(
          settings.language,
          settings.complexityMode === "simple" ? "modal.manageLists" : "modal.manageProjects",
        )}
        isOpen={isManageModalOpen}
        onClose={() => {
          setManageModalOpen(false);
          setAutoDeleteProjectId(null);
        }}
      >
        <ProjectManageModal
          projects={projects}
          tasks={tasks}
          complexityMode={settings.complexityMode}
          selectedProjectId={selectedProjectId}
          autoDeleteProjectId={autoDeleteProjectId}
          onAutoDeleteHandled={() => setAutoDeleteProjectId(null)}
          onCreateProject={() => {
            setManageModalOpen(false);
            setProjectModalOpen(true);
          }}
          onRenameProject={handleRenameProject}
          onDeleteProject={handleDeleteProject}
          onSelectProject={(projectId) => {
            handleProjectSelect(projectId);
            setManageModalOpen(false);
          }}
        />
      </Modal>

      <Modal
        title={translate(settings.language, "modal.deleteTask")}
        isOpen={deleteTaskId !== null}
        onClose={() => setDeleteTaskId(null)}
      >
        {deleteTaskId ? (
          <ConfirmDialog
            title={translate(settings.language, "taskDelete.confirmTitle")}
            message={translateWithParams(settings.language, "taskDelete.confirmMessage", {
              title: taskIndex.byId.get(deleteTaskId)?.title ?? "",
            })}
            confirmLabel={translate(settings.language, "btn.delete")}
            onConfirm={confirmDeleteTask}
            onCancel={() => setDeleteTaskId(null)}
          />
        ) : null}
      </Modal>
      </>
    </I18nProvider>
  );
}
