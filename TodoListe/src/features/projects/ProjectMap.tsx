import { memo, useMemo } from "react";
import type { ProjectHierarchyStore } from "../../types/hierarchy";
import type { Project } from "../../types/project";
import type { Task, TaskStatus } from "../../types/task";
import { buildProjectTree, type HierarchyTreeNode } from "../../utils/hierarchy";
import type { TaskIndex } from "../../utils/taskIndex";
import { useI18n } from "../../i18n/useI18n";
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
  const { t } = useI18n();
  const collapsed = collapsedSections[node.id] ?? level > 1;
  const nodeTask = node.type === "task" ? taskIndex.byId.get(node.id) : undefined;
  const projects = useMemo(() => [...projectMap.values()], [projectMap]);

  return (
    <CollapsibleSection
      id={node.id}
      title={node.label}
      subtitle={node.description}
      meta={t("projectMap.nodeOpen", { open: node.openTaskCount, total: node.taskCount })}
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
  const { t } = useI18n();
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
        title={t("projectMap.selectComplexTitle")}
        description={t("projectMap.selectComplexHint")}
      />
    );
  }

  if (project.complexityMode !== "complex") {
    return (
      <EmptyState
        title={t("projectMap.simpleSelectedTitle")}
        description={t("projectMap.simpleSelectedHint")}
      />
    );
  }

  if (tree.length === 0) {
    return (
      <EmptyState
        title={t("projectMap.noHierarchyTitle")}
        description={t("projectMap.noHierarchyHint")}
      />
    );
  }

  return (
    <div className="project-map">
      <p className="project-map__intro">{t("projectMap.intro")}</p>
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
