import { useMemo, useState } from "react";
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
import { demoHierarchy } from "./data/demoHierarchy";
import { demoProjects } from "./data/demoProjects";
import { demoTasks } from "./data/demoTasks";
import { useAppSettings } from "./hooks/useAppSettings";
import { useHierarchy } from "./hooks/useHierarchy";
import { useProjects } from "./hooks/useProjects";
import { useTasks } from "./hooks/useTasks";
import { useTheme } from "./hooks/useTheme";
import { useViewState } from "./hooks/useViewState";
import type { ProjectTemplateId } from "./types/template";
import type { TaskInput, TaskStatus } from "./types/task";
import {
  filterTasks,
  getHighValueTasks,
  getNextBestAction,
  getTodayTasks,
  getUpcomingTasks,
  scopeTasksByMode,
  scopeTasksByProject,
} from "./utils/selectors";
import { sortByHighValueScore } from "./utils/scoring";

export function App() {
  const { projects, createProjectWithTemplate, setProjects } = useProjects();
  const { tasks, createTask, updateTaskStatus, deleteTask, setTasks } = useTasks();
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
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [focusTaskId, setFocusTaskId] = useState<string | null>(null);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId),
    [projects, selectedProjectId],
  );

  const scopedTasks = useMemo(() => {
    let result = scopeTasksByMode(tasks, projects, settings.complexityMode);
    result = scopeTasksByProject(result, selectedProjectId);
    return sortByHighValueScore(result);
  }, [tasks, projects, settings.complexityMode, selectedProjectId]);

  const filteredTasks = useMemo(() => {
    const mergedFilters = {
      ...filters,
      searchQuery: filters.searchQuery || (activeView === "search" ? filters.searchQuery : filters.searchQuery),
      projectId: filters.projectId ?? selectedProjectId,
    };
    return filterTasks(scopedTasks, mergedFilters);
  }, [scopedTasks, filters, selectedProjectId, activeView]);

  const focusTask = useMemo(() => {
    if (focusTaskId) return tasks.find((task) => task.id === focusTaskId) ?? null;
    return getNextBestAction(scopeTasksByMode(tasks, projects, settings.complexityMode));
  }, [focusTaskId, tasks, projects, settings.complexityMode]);

  const focusProject = focusTask ? projects.find((project) => project.id === focusTask.projectId) : undefined;

  const showFilterBar = ["dashboard", "high-value", "backlog", "search", "simple-list", "today", "upcoming"].includes(
    activeView,
  );

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

  function handleSearchChange(query: string) {
    updateFilters({ searchQuery: query });
    if (query.trim() && activeView !== "search") {
      setActiveView("search");
    }
  }

  function handleResetDemoData() {
    setProjects(demoProjects);
    setTasks(demoTasks);
    setHierarchy(demoHierarchy);
    resetFilters();
    setSelectedProjectId(null);
    setActiveView("dashboard");
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
      return <ProjectOverview project={selectedProject} hierarchy={hierarchy} tasks={tasks} />;
    }

    if (activeView === "project-map") {
      return (
        <ProjectMap
          project={selectedProject}
          hierarchy={hierarchy}
          tasks={tasks}
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
          viewDensity={settings.viewDensity}
          onStatusChange={handleStatusChange}
          onDelete={deleteTask}
          onFocus={handleFocus}
        />
      );
    }

    if (activeView === "search") {
      return (
        <SearchPanel
          projects={projects}
          tasks={filteredTasks}
          query={filters.searchQuery}
          viewDensity={settings.viewDensity}
          onStatusChange={handleStatusChange}
          onDelete={deleteTask}
          onFocus={handleFocus}
        />
      );
    }

    if (activeView === "simple-list") {
      return (
        <SimpleListPanel
          projects={projects}
          tasks={filteredTasks}
          viewDensity={settings.viewDensity}
          onStatusChange={handleStatusChange}
          onDelete={deleteTask}
          onFocus={handleFocus}
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
        onNewProject={() => setProjectModalOpen(true)}
      >
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
            tasks={scopedTasks}
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

      <Modal title="Create project" isOpen={isProjectModalOpen} onClose={() => setProjectModalOpen(false)}>
        <ProjectForm onSubmit={handleProjectSubmit} onCancel={() => setProjectModalOpen(false)} />
      </Modal>
    </>
  );
}
