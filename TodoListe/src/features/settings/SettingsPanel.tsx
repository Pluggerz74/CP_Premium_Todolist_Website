import { STORAGE_VERSION } from "../../constants/storageKeys";
import type { ThemeMode } from "../../types/theme";
import type { AppSettings } from "../../types/appSettings";
import { downloadAppBackup } from "../../utils/dataBackup";
import { readStorageMeta } from "../../utils/storageMigration";
import { Card } from "../../components/ui/Card";
import { ThemeToggle } from "../../components/ui/ThemeToggle";
import { ModeBadge } from "../../components/ui/ModeBadge";
import { Button } from "../../components/ui/Button";

type SettingsPanelProps = {
  theme: ThemeMode;
  settings: AppSettings;
  onToggleTheme: () => void;
  onComplexityModeChange: (mode: AppSettings["complexityMode"]) => void;
  onDensityChange: (density: AppSettings["viewDensity"]) => void;
  onResetDemoData?: () => void;
};

export function SettingsPanel({
  theme,
  settings,
  onToggleTheme,
  onComplexityModeChange,
  onDensityChange,
  onResetDemoData,
}: SettingsPanelProps) {
  const storageMeta = readStorageMeta();

  return (
    <section className="section-block settings-panel">
      <div className="section-heading">
        <p className="eyebrow">Settings</p>
        <h2>Workspace preferences</h2>
        <p className="settings-panel__intro">
          Tune appearance, planning density, and local data safety without leaving your workflow.
        </p>
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
          <h3>Project mode</h3>
          <p>
            Simple Mode keeps everyday todos fast. Complex Mode unlocks hierarchy, project maps, and backlog planning for massive projects.
          </p>
          <ModeBadge mode={settings.complexityMode} />
        </div>
        <div className="settings-card__actions">
          <Button
            variant={settings.complexityMode === "simple" ? "primary" : "secondary"}
            onClick={() => onComplexityModeChange("simple")}
          >
            Simple Mode
          </Button>
          <Button
            variant={settings.complexityMode === "complex" ? "primary" : "secondary"}
            onClick={() => onComplexityModeChange("complex")}
          >
            Complex Mode
          </Button>
        </div>
      </Card>

      <Card className="settings-card">
        <div>
          <h3>List density</h3>
          <p>Use compact rows when planning large projects with hundreds of tasks.</p>
        </div>
        <div className="settings-card__actions">
          <Button
            variant={settings.viewDensity === "comfortable" ? "primary" : "secondary"}
            onClick={() => onDensityChange("comfortable")}
          >
            Comfortable
          </Button>
          <Button
            variant={settings.viewDensity === "compact" ? "primary" : "secondary"}
            onClick={() => onDensityChange("compact")}
          >
            Compact
          </Button>
        </div>
      </Card>

      <Card className="settings-card settings-card--persistence">
        <div>
          <h3>Storage & backup</h3>
          <p>
            Schema v{STORAGE_VERSION} with defensive parsing, migration, and debounced writes.
            {storageMeta.lastError ? ` Last write issue: ${storageMeta.lastError}` : " Your data stays on this device."}
          </p>
        </div>
        <div className="settings-card__actions">
          <Button variant="secondary" onClick={downloadAppBackup}>
            Download backup
          </Button>
          {onResetDemoData ? (
            <Button variant="secondary" onClick={onResetDemoData}>
              Reload demo data
            </Button>
          ) : null}
        </div>
      </Card>
    </section>
  );
}
