import type { RefObject } from "react";
import { appConfig } from "../../config/app";
import { Button } from "../ui/Button";
import { SearchInput } from "../ui/SearchInput";

type TopBarProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewTask: () => void;
  onQuickAdd: () => void;
  searchInputRef?: RefObject<HTMLInputElement | null>;
};

export function TopBar({ searchQuery, onSearchChange, onNewTask, onQuickAdd, searchInputRef }: TopBarProps) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Project command center</p>
        <h1>{appConfig.tagline}</h1>
      </div>
      <div className="topbar__actions">
        <SearchInput
          variant="toolbar"
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Quick search tasks..."
          inputRef={searchInputRef}
        />
        <Button variant="secondary" onClick={onQuickAdd}>
          Quick Add
        </Button>
        <Button onClick={onNewTask}>New Task</Button>
      </div>
    </header>
  );
}
