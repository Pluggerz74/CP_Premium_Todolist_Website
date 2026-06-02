import { useState } from "react";
import type { TaskFilterState } from "../../types/appSettings";
import type { ProjectHierarchyStore } from "../../types/hierarchy";
import type { Project } from "../../types/project";
import type { ViewDensity } from "../../types/appSettings";
import type { TaskIndex } from "../../utils/taskIndex";
import { getProjectAreas } from "../../utils/hierarchy";
import { useI18n } from "../../i18n/useI18n";
import { Button } from "../../components/ui/Button";
import { SearchInput } from "../../components/ui/SearchInput";
import { SelectField } from "../../components/ui/SelectField";

type TaskFilterBarProps = {
  filters: TaskFilterState;
  projects: Project[];
  taskIndex: TaskIndex;
  hierarchy: ProjectHierarchyStore;
  viewDensity: ViewDensity;
  onFiltersChange: (partial: Partial<TaskFilterState>) => void;
  onReset: () => void;
  onDensityChange: (density: ViewDensity) => void;
};

export function TaskFilterBar({
  filters,
  projects,
  taskIndex,
  hierarchy,
  viewDensity,
  onFiltersChange,
  onReset,
  onDensityChange,
}: TaskFilterBarProps) {
  const { t } = useI18n();
  const tags = taskIndex.allTags;
  const areas = filters.projectId ? getProjectAreas(hierarchy, filters.projectId) : [];
  const milestones = filters.areaId
    ? hierarchy.milestones.filter((item) => item.areaId === filters.areaId)
    : [];

  return (
    <div className="filter-bar card">
      <div className="filter-bar__row">
        <SearchInput
          value={filters.searchQuery}
          onChange={(searchQuery) => onFiltersChange({ searchQuery })}
          placeholder={t("label.search")}
        />
        <div className="filter-bar__density">
          <button
            type="button"
            className={viewDensity === "comfortable" ? "density-toggle is-active" : "density-toggle"}
            onClick={() => onDensityChange("comfortable")}
          >
            {t("density.comfortable")}
          </button>
          <button
            type="button"
            className={viewDensity === "compact" ? "density-toggle is-active" : "density-toggle"}
            onClick={() => onDensityChange("compact")}
          >
            {t("density.compact")}
          </button>
        </div>
      </div>

      <div className="filter-bar__grid">
        <label>
          {t("filter.project")}
          <SelectField
            value={filters.projectId ?? ""}
            onChange={(value) =>
              onFiltersChange({
                projectId: value || null,
                areaId: null,
                milestoneId: null,
              })
            }
            options={[
              { value: "", label: t("filter.allProjects") },
              ...projects.map((project) => ({ value: project.id, label: project.name })),
            ]}
          />
        </label>

        <label>
          {t("filter.area")}
          <SelectField
            value={filters.areaId ?? ""}
            onChange={(value) =>
              onFiltersChange({
                areaId: value || null,
                milestoneId: null,
              })
            }
            disabled={!filters.projectId}
            options={[
              { value: "", label: t("filter.allAreas") },
              ...areas.map((area) => ({ value: area.id, label: area.title })),
            ]}
          />
        </label>

        <label>
          {t("filter.milestone")}
          <SelectField
            value={filters.milestoneId ?? ""}
            onChange={(value) => onFiltersChange({ milestoneId: value || null })}
            disabled={!filters.areaId}
            options={[
              { value: "", label: t("filter.allMilestones") },
              ...milestones.map((milestone) => ({ value: milestone.id, label: milestone.title })),
            ]}
          />
        </label>

        <label>
          {t("label.status")}
          <SelectField
            value={filters.status}
            onChange={(value) => onFiltersChange({ status: value as TaskFilterState["status"] })}
            options={[
              { value: "all", label: t("status.all") },
              { value: "todo", label: t("status.todo") },
              { value: "in-progress", label: t("status.inProgress") },
              { value: "done", label: t("status.done") },
            ]}
          />
        </label>

        <label>
          {t("filter.tag")}
          <SelectField
            value={filters.tag ?? ""}
            onChange={(value) => onFiltersChange({ tag: value || null })}
            options={[
              { value: "", label: t("filter.allTags") },
              ...tags.map((tag) => ({ value: tag, label: tag })),
            ]}
          />
        </label>

        <label>
          {t("filter.minScore")}
          <SelectField
            value={filters.minScore !== null ? String(filters.minScore) : ""}
            onChange={(value) => onFiltersChange({ minScore: value ? Number(value) : null })}
            options={[
              { value: "", label: t("filter.anyScore") },
              ...[2, 4, 6, 8].map((score) => ({ value: String(score), label: `${score}+` })),
            ]}
          />
        </label>
      </div>

      <div className="filter-bar__actions">
        <Button variant="ghost" onClick={onReset}>
          {t("btn.resetFilters")}
        </Button>
      </div>
    </div>
  );
}
