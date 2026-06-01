import { appConfig } from "../../config/app";
import { Button } from "../ui/Button";

type TopBarProps = {
  onNewTask: () => void;
};

export function TopBar({ onNewTask }: TopBarProps) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Premium execution system</p>
        <h1>{appConfig.tagline}</h1>
      </div>
      <Button onClick={onNewTask}>New Task</Button>
    </header>
  );
}
