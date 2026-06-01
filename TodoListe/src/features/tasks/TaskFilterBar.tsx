import type { TaskFilterState } from "../../types/appSettings";
import type { ProjectHierarchyStore } from "../../types/hierarchy";
import type { Project } from "../../types/project";
import type { ViewDensity } from "../../types/appSettings";
import { getAllTags } from "../../utils/selectors";
import type { Task } from "../../types/task";
import { Button } from "../../components/ui/Button";
import { SearchInput } from "../../components/ui/SearchInput";
import { getProjectAreas } from "../../utils/hierarchy";

type TaskFilterBarProps = {
  filters: TaskFilterState;
  projects: Project[];
  tasks: Task[];
  hierarchy: ProjectHierarchyStore;
  viewDensity: ViewDensity;
  onFiltersChange: (partial: Partial<TaskFilterState>) => void;
  onReset: () => void;
  onDensityChange: (density: ViewDensity) => void;
};

export function TaskFilterBar({
  filters,
  projects,
  tasks,
  hierarchy,
  viewDensity,
  onFiltersChange,
  onReset,
  onDensityChange,
}: TaskFilterBarProps) {
  const tags = getAllTags(tasks);
  const areas = filters.projectId ? getProjectAreas(hierarchy, filters.projectId) : [];
  const milestones = filters.areaId
    ? hierarchy.milestones.filter((item) => item.areaId === filters.areaId)
    : [];

  return (
    <div className="filter-bar card">
      <div className="filter-bar__row">
        <SearchInput value={filters.searchQuery} onChange={(searchQuery) => onFiltersChange({ searchQuery })} />
        <div className="filter-bar__density">
          <button
            type="button"
            className={viewDensity === "comfortable" ? "density-toggle is-active" : "density-toggle"}
            onClick={() => onDensityChange("comfortable")}
          >
            Comfortable
          </button>
          <button
            type="button"
            className={viewDensity === "compact" ? "density-toggle is-active" : "density-toggle"}
            onClick={() => onDensityChange("compact")}
          >
            Compact
          </button>
        </div>
      </div>

      <div className="filter-bar__grid">
        <label>
          Project
          <select
            value={filters.projectId ?? ""}
            onChange={(event) =>
              onFiltersChange({
                projectId: event.target.value || null,
                areaId: null,
                milestoneId: null,
              })
            }
          >
            <option value="">All projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Area
          <select
            value={filters.areaId ?? ""}
            onChange={(event) =>
              onFiltersChange({
                areaId: event.target.value || null,
                milestoneId: null,
              })
            }
            disabled={!filters.projectId}
          >
            <option value="">All areas</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          Milestone
          <select
            value={filters.milestoneId ?? ""}
            onChange={(event) => onFiltersChange({ milestoneId: event.target.value || null })}
            disabled={!filters.areaId}
          >
            <option value="">All milestones</option>
            {milestones.map((milestone) => (
              <option key={milestone.id} value={milestone.id}>
                {milestone.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          Status
          <select
            value={filters.status}
            onChange={(event) =>
              onFiltersChange({ status: event.target.value as TaskFilterState["status"] })
            }
          >
            <option value="all">All statuses</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label>
          Tag
          <select
            value={filters.tag ?? ""}
            onChange={(event) => onFiltersChange({ tag: event.target.value || null })}
          >
            <option value="">All tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>

        <label>
          Min score
          <select
            value={filters.minScore ?? ""}
            onChange={(event) =>
              onFiltersChange({ minScore: event.target.value ? Number(event.target.value) : null })
            }
          >
            <option value="">Any score</option>
            {[2, 4, 6, 8].map((score) => (
              <option key={score} value={score}>
                {score}+
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="filter-bar__actions">
        <Button variant="ghost" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    </div>
  );
}
