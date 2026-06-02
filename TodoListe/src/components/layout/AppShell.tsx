import type { PropsWithChildren, RefObject } from "react";
import type { Project } from "../../types/project";
import type { ProjectComplexityMode } from "../../types/project";
import type { Task } from "../../types/task";
import type { AppView } from "../../types/view";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

type AppShellProps = PropsWithChildren<{
  projects: Project[];
  tasks: Task[];
  activeView: AppView;
  selectedProjectId: string | null;
  complexityMode: ProjectComplexityMode;
  searchQuery: string;
  onViewChange: (view: AppView) => void;
  onProjectSelect: (projectId: string | null) => void;
  onSearchChange: (query: string) => void;
  onNewTask: () => void;
  onQuickAdd: () => void;
  onNewProject: () => void;
  onManageProjects: () => void;
  onRenameProject: (projectId: string, name: string) => void;
  onRequestDeleteProject: (projectId: string) => void;
  searchInputRef?: RefObject<HTMLInputElement | null>;
}>;

export function AppShell({
  children,
  projects,
  tasks,
  activeView,
  selectedProjectId,
  complexityMode,
  searchQuery,
  onViewChange,
  onProjectSelect,
  onSearchChange,
  onNewTask,
  onQuickAdd,
  onNewProject,
  onManageProjects,
  onRenameProject,
  onRequestDeleteProject,
  searchInputRef,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <Sidebar
        projects={projects}
        tasks={tasks}
        activeView={activeView}
        selectedProjectId={selectedProjectId}
        complexityMode={complexityMode}
        onViewChange={onViewChange}
        onProjectSelect={onProjectSelect}
        onNewProject={onNewProject}
        onManageProjects={onManageProjects}
        onQuickAdd={onQuickAdd}
        onRenameProject={onRenameProject}
        onDeleteProject={onRequestDeleteProject}
      />
      <main className="app-main">
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onNewTask={onNewTask}
          onQuickAdd={onQuickAdd}
          searchInputRef={searchInputRef}
        />
        <div className="app-content">{children}</div>
      </main>
    </div>
  );
}
