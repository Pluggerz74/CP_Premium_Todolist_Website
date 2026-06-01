import { memo, useMemo } from "react";
import type { ProjectHierarchyStore } from "../../types/hierarchy";
import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { buildProjectTree, type HierarchyTreeNode } from "../../utils/hierarchy";
import type { TaskIndex } from "../../utils/taskIndex";
import { CollapsibleSection } from "../../components/ui/CollapsibleSection";
import { EmptyState } from "../../components/ui/EmptyState";
import { CompactTaskTable } from "./CompactTaskTable";

type ProjectMapProps = {
  project: Project | undefined;
  hierarchy: ProjectHierarchyStore;
  taskIndex: TaskIndex;
  collapsedSections: Record<string, boolean>;
  onToggleSection: (sectionId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
};

type TreeNodeSectionProps = {
  node: HierarchyTreeNode;
  level: number;
  collapsedSections: Record<string, boolean>;
  onToggleSection: (sectionId: string) => void;
  taskIndex: TaskIndex;
  projectMap: Map<string, Project>;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onFocus: (taskId: string) => void;
};

const TreeNodeSection = memo(function TreeNodeSection({
  node,
  level,
  collapsedSections,
  onToggleSection,
  taskIndex,
  projectMap,
  onStatusChange,
  onDelete,
  onFocus,
}: TreeNodeSectionProps) {
  const collapsed = collapsedSections[node.id] ?? level > 1;
  const nodeTask = node.type === "task" ? taskIndex.byId.get(node.id) : undefined;
  const projects = useMemo(() => [...projectMap.values()], [projectMap]);

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
      {node.type === "task" && nodeTask ? (
        <CompactTaskTable
          tasks={[nodeTask]}
          projects={projects}
          projectMap={projectMap}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onFocus={onFocus}
        />
      ) : null}
      {!collapsed
        ? node.children.map((child) => (
            <TreeNodeSection
              key={child.id}
              node={child}
              level={level + 1}
              collapsedSections={collapsedSections}
              onToggleSection={onToggleSection}
              taskIndex={taskIndex}
              projectMap={projectMap}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              onFocus={onFocus}
            />
          ))
        : null}
    </CollapsibleSection>
  );
});

export function ProjectMap({
  project,
  hierarchy,
  taskIndex,
  collapsedSections,
  onToggleSection,
  onStatusChange,
  onDelete,
  onFocus,
}: ProjectMapProps) {
  const projectMap = useMemo(
    () => (project ? new Map([[project.id, project]]) : new Map<string, Project>()),
    [project],
  );

  const tree = useMemo(() => {
    if (!project) return [];
    return buildProjectTree(project.id, hierarchy, taskIndex);
  }, [project, hierarchy, taskIndex]);

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
      <div className="project-map__tree">
        {tree.map((node) => (
          <TreeNodeSection
            key={node.id}
            node={node}
            level={0}
            collapsedSections={collapsedSections}
            onToggleSection={onToggleSection}
            taskIndex={taskIndex}
            projectMap={projectMap}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            onFocus={onFocus}
          />
        ))}
      </div>
    </div>
  );
}
