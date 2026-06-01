import type { ProjectHierarchyStore } from "../../types/hierarchy";
import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { buildProjectTree, type HierarchyTreeNode } from "../../utils/hierarchy";
import { CollapsibleSection } from "../../components/ui/CollapsibleSection";
import { EmptyState } from "../../components/ui/EmptyState";
import { CompactTaskTable } from "./CompactTaskTable";

type ProjectMapProps = {
  project: Project | undefined;
  hierarchy: ProjectHierarchyStore;
  tasks: Task[];
  collapsedSections: Record<string, boolean>;
  onToggleSection: (sectionId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
};

function TreeNodeSection({
  node,
  level,
  collapsedSections,
  onToggleSection,
  tasks,
  projects,
  onStatusChange,
  onDelete,
  onFocus,
}: {
  node: HierarchyTreeNode;
  level: number;
  collapsedSections: Record<string, boolean>;
  onToggleSection: (sectionId: string) => void;
  tasks: Task[];
  projects: Project[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
}) {
  const collapsed = collapsedSections[node.id] ?? level > 1;
  const nodeTasks = node.type === "task" ? tasks.filter((task) => task.id === node.id) : [];

  return (
    <CollapsibleSection
      id={node.id}
      title={node.label}
      subtitle={node.description}
      meta={`${node.openTaskCount}/${node.taskCount} open`}
      collapsed={collapsed}
      onToggle={() => onToggleSection(node.id)}
      level={level}
    >
      {node.type === "task" && nodeTasks.length > 0 ? (
        <CompactTaskTable
          tasks={nodeTasks}
          projects={projects}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onFocus={onFocus}
        />
      ) : null}
      {node.children.map((child) => (
        <TreeNodeSection
          key={child.id}
          node={child}
          level={level + 1}
          collapsedSections={collapsedSections}
          onToggleSection={onToggleSection}
          tasks={tasks}
          projects={projects}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onFocus={onFocus}
        />
      ))}
    </CollapsibleSection>
  );
}

export function ProjectMap({
  project,
  hierarchy,
  tasks,
  collapsedSections,
  onToggleSection,
  onStatusChange,
  onDelete,
  onFocus,
}: ProjectMapProps) {
  if (!project) {
    return (
      <EmptyState
        title="Select a complex project"
        description="Project map shows hierarchical areas, milestones, epics, and tasks for large projects."
      />
    );
  }

  if (project.complexityMode !== "complex") {
    return (
      <EmptyState
        title="Simple project selected"
        description="Switch to a complex project like Echo Realms to explore the full hierarchy map."
      />
    );
  }

  const tree = buildProjectTree(project.id, hierarchy, tasks);

  if (tree.length === 0) {
    return (
      <EmptyState
        title="No hierarchy yet"
        description="Create a project from a template to generate areas, milestones, and planning lanes."
      />
    );
  }

  return (
    <div className="project-map">
      <p className="project-map__intro">
        Progressive disclosure keeps massive projects manageable. Expand areas to drill into phases, milestones, epics, and tasks.
      </p>
      {tree.map((node) => (
        <TreeNodeSection
          key={node.id}
          node={node}
          level={0}
          collapsedSections={collapsedSections}
          onToggleSection={onToggleSection}
          tasks={tasks}
          projects={[project]}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onFocus={onFocus}
        />
      ))}
    </div>
  );
}
