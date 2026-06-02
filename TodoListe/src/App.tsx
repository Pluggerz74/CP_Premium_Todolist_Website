import { useMemo, useRef, useState } from "react";
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
import { SimpleListPanel } from "./features/projects/SimpleListPanel";
import { SettingsPanel } from "./features/settings/SettingsPanel";
import { TaskFilterBar } from "./features/tasks/TaskFilterBar";
import { getViewEyebrow, getViewTitle } from "./features/tasks/TaskFilters";
import { TaskForm } from "./features/tasks/TaskForm";
import { TaskEditForm } from "./features/tasks/TaskEditForm";
import { QuickAddForm } from "./features/tasks/QuickAddForm";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useAppSettings } from "./hooks/useAppSettings";
import { useHierarchy } from "./hooks/useHierarchy";
import { useProjects } from "./hooks/useProjects";
import { useTaskIndex, useProjectMap } from "./hooks/useTaskIndex";
import { useTasks } from "./hooks/useTasks";
import { useTheme } from "./hooks/useTheme";
import { useViewState } from "./hooks/useViewState";
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
  const { projects, createProjectWithTemplate, setProjects } = useProjects();
  const { tasks, createTask, updateTask, updateTaskStatus, deleteTask, setTasks } = useTasks();
  const { hierarchy, addHierarchy, setHierarchy } = useHierarchy();
  const {
    settings,
    filters,
    setComplexityMode,
    setViewDensity,
    toggleSectionCollapsed,
    updateFilters,
    resetFilters,
  } = useAppSettings();
  const { theme, toggleTheme } = useTheme();
  const { activeView, setActiveView, selectedProjectId, setSelectedProjectId } = useViewState();
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isQuickAddOpen, setQuickAddOpen] = useState(false);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
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
    setProjects(migrateProjects(snapshot.projects));
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

  function handleSelectProject(projectId: string) {
    setSelectedProjectId(projectId);
    setActiveView("project-overview");
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
          onSelectProject={handleSelectProject}
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
        <SimpleListPanel
          projects={projects}
          tasks={filteredTasks}
          taskIndex={taskIndex}
          projectMap={projectMap}
          viewDensity={settings.viewDensity}
          onStatusChange={handleStatusChange}
          onDelete={deleteTask}
          onFocus={handleFocus}
          onEdit={handleEditTask}
          onQuickAdd={() => setQuickAddOpen(true)}
        />
      );
    }

    return (
      <SettingsPanel
        theme={theme}
        settings={settings}
        onToggleTheme={toggleTheme}
        onComplexityModeChange={setComplexityMode}
        onDensityChange={setViewDensity}
        onResetDemoData={handleResetDemoData}
        onLoadScaleTestData={handleLoadScaleTestData}
        onImportBackup={handleImportBackup}
      />
    );
  }

  return (
    <>
      <AppShell
        projects={projects}
        activeView={activeView}
        selectedProjectId={selectedProjectId}
        complexityMode={settings.complexityMode}
        searchQuery={filters.searchQuery}
        onViewChange={setActiveView}
        onProjectSelect={setSelectedProjectId}
        onSearchChange={handleSearchChange}
        onNewTask={() => setTaskModalOpen(true)}
        onQuickAdd={() => setQuickAddOpen(true)}
        onNewProject={() => setProjectModalOpen(true)}
        searchInputRef={searchInputRef}
      >
        {storageInit?.migrated ? (
          <div className="storage-banner" role="status">
            Storage schema upgraded to version {storageInit.toVersion}. Your data was validated and preserved.
          </div>
        ) : null}

        {storageWarnings.length > 0 ? (
          <div className="storage-banner storage-banner--warning" role="alert">
            {storageWarnings.join(" ")}
          </div>
        ) : null}

        <div className="view-title">
          <p className="eyebrow">
            {getViewEyebrow(activeView, settings.complexityMode)}
            {selectedProject ? ` · ${selectedProject.name}` : ""}
          </p>
          <h2>{getViewTitle(activeView)}</h2>
        </div>

        {showFilterBar ? (
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

      <Modal title="Create high-value task" isOpen={isTaskModalOpen} onClose={() => setTaskModalOpen(false)}>
        <TaskForm
          projects={projects}
          hierarchy={hierarchy}
          defaultProjectId={selectedProjectId}
          onSubmit={handleTaskSubmit}
          onCancel={() => setTaskModalOpen(false)}
        />
      </Modal>

      <Modal title="Quick add" isOpen={isQuickAddOpen} onClose={() => setQuickAddOpen(false)}>
        <QuickAddForm
          projects={projects}
          defaultProjectId={selectedProjectId}
          onSubmit={handleQuickAddSubmit}
          onCancel={() => setQuickAddOpen(false)}
        />
      </Modal>

      <Modal
        title="Edit task"
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
          />
        ) : null}
      </Modal>

      <Modal title="Create project" isOpen={isProjectModalOpen} onClose={() => setProjectModalOpen(false)}>
        <ProjectForm onSubmit={handleProjectSubmit} onCancel={() => setProjectModalOpen(false)} />
      </Modal>
    </>
  );
}
