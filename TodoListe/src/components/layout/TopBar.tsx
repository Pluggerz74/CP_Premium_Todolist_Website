import { appConfig } from "../../config/app";
import { Button } from "../ui/Button";
import { SearchInput } from "../ui/SearchInput";

type TopBarProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewTask: () => void;
};

export function TopBar({ searchQuery, onSearchChange, onNewTask }: TopBarProps) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Premium execution system</p>
        <h1>{appConfig.tagline}</h1>
      </div>
      <div className="topbar__actions">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Quick search tasks..."
        />
        <Button onClick={onNewTask}>New Task</Button>
      </div>
    </header>
  );
}
