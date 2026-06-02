import type { RefObject } from "react";
import type { ProjectComplexityMode } from "../../types/project";
import { useI18n } from "../../i18n/useI18n";
import { cn } from "../../utils/cn";
import { Button } from "../ui/Button";
import { SearchInput } from "../ui/SearchInput";

type TopBarProps = {
  searchQuery: string;
  complexityMode: ProjectComplexityMode;
  onSearchChange: (query: string) => void;
  onNewTask: () => void;
  onQuickAdd: () => void;
  searchInputRef?: RefObject<HTMLInputElement | null>;
};

export function TopBar({
  searchQuery,
  complexityMode,
  onSearchChange,
  onNewTask,
  onQuickAdd,
  searchInputRef,
}: TopBarProps) {
  const { t } = useI18n();
  const isSimple = complexityMode === "simple";

  return (
    <header className={cn("topbar", isSimple && "topbar--simple")}>
      {isSimple ? null : (
        <div>
          <p className="eyebrow">{t("app.tagline")}</p>
          <h1>{t("app.headline")}</h1>
        </div>
      )}
      <div className="topbar__actions">
        <SearchInput
          variant="toolbar"
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={t("label.search")}
          inputRef={searchInputRef}
        />
        <Button variant="secondary" onClick={onQuickAdd}>
          {t("btn.quickAdd")}
        </Button>
        <Button onClick={onNewTask}>{t("btn.newTask")}</Button>
      </div>
    </header>
  );
}
