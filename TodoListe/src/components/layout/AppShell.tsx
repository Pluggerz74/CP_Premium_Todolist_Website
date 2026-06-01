import type { PropsWithChildren } from "react";
import type { Project } from "../../types/project";
import type { AppView } from "../../types/view";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

type AppShellProps = PropsWithChildren<{
  projects: Project[];
  activeView: AppView;
  selectedProjectId: string | null;
  onViewChange: (view: AppView) => void;
  onProjectSelect: (projectId: string | null) => void;
  onNewTask: () => void;
  onNewProject: () => void;
}>;

export function AppShell({
  children,
  projects,
  activeView,
  selectedProjectId,
  onViewChange,
  onProjectSelect,
  onNewTask,
  onNewProject,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <Sidebar
        projects={projects}
        activeView={activeView}
        selectedProjectId={selectedProjectId}
        onViewChange={onViewChange}
        onProjectSelect={onProjectSelect}
        onNewProject={onNewProject}
      />
      <main className="app-main">
        <TopBar onNewTask={onNewTask} />
        <div className="app-content">{children}</div>
      </main>
    </div>
  );
}
