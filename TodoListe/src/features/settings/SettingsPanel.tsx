import type { ThemeMode } from "../../types/theme";
import { Card } from "../../components/ui/Card";
import { ThemeToggle } from "../../components/ui/ThemeToggle";

export function SettingsPanel({ theme, onToggleTheme }: { theme: ThemeMode; onToggleTheme: () => void }) {
  return (
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">Settings</p>
        <h2>Workspace preferences</h2>
      </div>
      <Card className="settings-card">
        <div>
          <h3>Appearance</h3>
          <p>Switch between calm dark mode and clean light mode.</p>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </Card>
      <Card className="settings-card">
        <div>
          <h3>Persistence</h3>
          <p>Version 1 stores projects and tasks locally in your browser.</p>
        </div>
      </Card>
    </section>
  );
}
