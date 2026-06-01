import type { PropsWithChildren } from "react";
import type { Project } from "../../types/project";
import type { ProjectComplexityMode } from "../../types/project";
import type { AppView } from "../../types/view";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

type AppShellProps = PropsWithChildren<{
  projects: Project[];
  activeView: AppView;
  selectedProjectId: string | null;
  complexityMode: ProjectComplexityMode;
  searchQuery: string;
  onViewChange: (view: AppView) => void;
  onProjectSelect: (projectId: string | null) => void;
  onSearchChange: (query: string) => void;
  onNewTask: () => void;
  onNewProject: () => void;
}>;

export function AppShell({
  children,
  projects,
  activeView,
  selectedProjectId,
  complexityMode,
  searchQuery,
  onViewChange,
  onProjectSelect,
  onSearchChange,
  onNewTask,
  onNewProject,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <Sidebar
        projects={projects}
        activeView={activeView}
        selectedProjectId={selectedProjectId}
        complexityMode={complexityMode}
        onViewChange={onViewChange}
        onProjectSelect={onProjectSelect}
        onNewProject={onNewProject}
      />
      <main className="app-main">
        <TopBar searchQuery={searchQuery} onSearchChange={onSearchChange} onNewTask={onNewTask} />
        <div className="app-content">{children}</div>
      </main>
    </div>
  );
}
