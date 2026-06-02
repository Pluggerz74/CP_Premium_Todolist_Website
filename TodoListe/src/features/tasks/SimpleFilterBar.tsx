import { useState } from "react";
import type { TaskFilterState } from "../../types/appSettings";
import type { Project } from "../../types/project";
import { useI18n } from "../../i18n/useI18n";
import { Button } from "../../components/ui/Button";
import { SearchInput } from "../../components/ui/SearchInput";
import { SelectField } from "../../components/ui/SelectField";

type SimpleFilterBarProps = {
  filters: TaskFilterState;
  projects: Project[];
  onFiltersChange: (partial: Partial<TaskFilterState>) => void;
  onReset: () => void;
};

export function SimpleFilterBar({ filters, projects, onFiltersChange, onReset }: SimpleFilterBarProps) {
  const { t } = useI18n();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const simpleProjects = projects.filter((project) => project.complexityMode === "simple");
  const projectOptions = (simpleProjects.length > 0 ? simpleProjects : projects).map((project) => ({
    value: project.id,
    label: project.name,
  }));

  return (
    <div className="filter-bar filter-bar--simple card">
      <div className="filter-bar__row">
        <SearchInput
          value={filters.searchQuery}
          onChange={(searchQuery) => onFiltersChange({ searchQuery })}
          placeholder={t("label.search")}
        />
        <label className="filter-bar__simple-project">
          <span>{t("label.list")}</span>
          <SelectField
            value={filters.projectId ?? ""}
            onChange={(value) =>
              onFiltersChange({
                projectId: value || null,
                areaId: null,
                milestoneId: null,
              })
            }
            options={[{ value: "", label: t("filter.allProjects") }, ...projectOptions]}
            aria-label={t("filter.project")}
          />
        </label>
        <Button variant="ghost" type="button" onClick={() => setShowAdvanced((open) => !open)}>
          {t("btn.moreFilters")}
        </Button>
      </div>

      {showAdvanced ? (
        <div className="filter-bar__grid filter-bar__grid--simple">
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
          <div className="filter-bar__actions">
            <Button variant="ghost" onClick={onReset}>
              {t("btn.resetFilters")}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
