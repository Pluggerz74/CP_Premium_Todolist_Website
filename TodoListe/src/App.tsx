import { useMemo, useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { Modal } from "./components/ui/Modal";
import { Dashboard } from "./features/dashboard/Dashboard";
import { HighValuePanel } from "./features/dashboard/HighValuePanel";
import { TodayPanel } from "./features/dashboard/TodayPanel";
import { UpcomingPanel } from "./features/dashboard/UpcomingPanel";
import { FocusMode } from "./features/focus/FocusMode";
import { ProjectForm } from "./features/projects/ProjectForm";
import { SettingsPanel } from "./features/settings/SettingsPanel";
import { TaskForm } from "./features/tasks/TaskForm";
import { getViewTitle } from "./features/tasks/TaskFilters";
import { useProjects } from "./hooks/useProjects";
import { useTasks } from "./hooks/useTasks";
import { useTheme } from "./hooks/useTheme";
import { useViewState } from "./hooks/useViewState";
import type { ProjectInput } from "./types/project";
import type { TaskInput, TaskStatus } from "./types/task";
import { sortByHighValueScore } from "./utils/scoring";

export function App() {
  const { projects, createProject } = useProjects();
  const { tasks, createTask, updateTask, deleteTask } = useTasks();
  const { theme, toggleTheme } = useTheme();
  const { activeView, setActiveView, selectedProjectId, setSelectedProjectId } = useViewState();
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [focusTaskId, setFocusTaskId] = useState<string | null>(null);

  const visibleTasks = useMemo(() => {
    const scopedTasks = selectedProjectId
      ? tasks.filter((task) => task.projectId === selectedProjectId)
      : tasks;

    return sortByHighValueScore(scopedTasks);
  }, [selectedProjectId, tasks]);

  const focusTask = useMemo(() => {
    if (focusTaskId) return tasks.find((task) => task.id === focusTaskId) ?? null;
    return sortByHighValueScore(tasks.filter((task) => task.status !== "done"))[0] ?? null;
  }, [focusTaskId, tasks]);

  const focusProject = focusTask ? projects.find((project) => project.id === focusTask.projectId) : undefined;

  function handleTaskSubmit(input: TaskInput) {
    createTask(input);
    setTaskModalOpen(false);
  }

  function handleProjectSubmit(input: ProjectInput) {
    createProject(input);
    setProjectModalOpen(false);
  }

  function handleStatusChange(taskId: string, status: TaskStatus) {
    updateTask(taskId, { status });
  }

  function handleFocus(taskId: string) {
    setFocusTaskId(taskId);
    setActiveView("focus");
  }

  function renderContent() {
    if (activeView === "dashboard") {
      return (
        <Dashboard
          projects={projects}
          tasks={visibleTasks}
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
          tasks={visibleTasks}
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
          tasks={visibleTasks}
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
          tasks={visibleTasks}
          onStatusChange={handleStatusChange}
          onDelete={deleteTask}
          onFocus={handleFocus}
        />
      );
    }

    if (activeView === "focus") {
      return <FocusMode task={focusTask} project={focusProject} onStatusChange={handleStatusChange} />;
    }

    return <SettingsPanel theme={theme} onToggleTheme={toggleTheme} />;
  }

  return (
    <>
      <AppShell
        projects={projects}
        activeView={activeView}
        selectedProjectId={selectedProjectId}
        onViewChange={setActiveView}
        onProjectSelect={setSelectedProjectId}
        onNewTask={() => setTaskModalOpen(true)}
        onNewProject={() => setProjectModalOpen(true)}
      >
        <div className="view-title">
          <p className="eyebrow">{selectedProjectId ? "Filtered workspace" : "Full workspace"}</p>
          <h2>{getViewTitle(activeView)}</h2>
        </div>
        {renderContent()}
      </AppShell>

      <Modal title="Create high-value task" isOpen={isTaskModalOpen} onClose={() => setTaskModalOpen(false)}>
        <TaskForm
          projects={projects}
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
