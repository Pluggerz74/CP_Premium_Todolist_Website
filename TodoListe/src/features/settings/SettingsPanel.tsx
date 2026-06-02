import { STORAGE_VERSION } from "../../constants/storageKeys";
import type { ThemeMode } from "../../types/theme";
import type { AppSettings } from "../../types/appSettings";
import type { AppDataSnapshot } from "../../utils/dataBackup";
import { readStorageMeta } from "../../utils/storageMigration";
import { useI18n } from "../../i18n/useI18n";
import { Card } from "../../components/ui/Card";
import { ThemeToggle } from "../../components/ui/ThemeToggle";
import { ModeBadge } from "../../components/ui/ModeBadge";
import { LanguageSwitch } from "../../components/ui/LanguageSwitch";
import { Button } from "../../components/ui/Button";
import { BackupImportPanel } from "./BackupImportPanel";

type SettingsPanelProps = {
  theme: ThemeMode;
  settings: AppSettings;
  onToggleTheme: () => void;
  onComplexityModeChange: (mode: AppSettings["complexityMode"]) => void;
  onDensityChange: (density: AppSettings["viewDensity"]) => void;
  onResetDemoData?: () => void;
  onLoadScaleTestData?: () => void;
  onImportBackup?: (snapshot: AppDataSnapshot) => void;
};

export function SettingsPanel({
  theme,
  settings,
  onToggleTheme,
  onComplexityModeChange,
  onDensityChange,
  onResetDemoData,
  onLoadScaleTestData,
  onImportBackup,
}: SettingsPanelProps) {
  const { t } = useI18n();
  const storageMeta = readStorageMeta();

  return (
    <section className="section-block settings-panel">
      <div className="section-heading">
        <p className="eyebrow">{t("nav.settings")}</p>
        <h2>{t("settings.title")}</h2>
        <p className="settings-panel__intro">{t("settings.intro")}</p>
      </div>

      <Card className="settings-card">
        <div>
          <h3>{t("settings.language")}</h3>
          <p>{t("settings.languageHint")}</p>
        </div>
        <LanguageSwitch />
      </Card>

      <Card className="settings-card">
        <div>
          <h3>{t("settings.appearance")}</h3>
          <p>{t("settings.appearanceHint")}</p>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </Card>

      <Card className="settings-card">
        <div>
          <h3>{t("settings.projectMode")}</h3>
          <p>{t("settings.projectModeHint")}</p>
          <ModeBadge mode={settings.complexityMode} />
        </div>
        <div className="settings-card__actions">
          <Button
            variant={settings.complexityMode === "simple" ? "primary" : "secondary"}
            onClick={() => onComplexityModeChange("simple")}
          >
            {t("mode.simple")}
          </Button>
          <Button
            variant={settings.complexityMode === "complex" ? "primary" : "secondary"}
            onClick={() => onComplexityModeChange("complex")}
          >
            {t("mode.complex")}
          </Button>
        </div>
      </Card>

      <Card className="settings-card">
        <div>
          <h3>{t("settings.density")}</h3>
          <p>{t("settings.densityHint")}</p>
        </div>
        <div className="settings-card__actions">
          <Button
            variant={settings.viewDensity === "comfortable" ? "primary" : "secondary"}
            onClick={() => onDensityChange("comfortable")}
          >
            {t("density.comfortable")}
          </Button>
          <Button
            variant={settings.viewDensity === "compact" ? "primary" : "secondary"}
            onClick={() => onDensityChange("compact")}
          >
            {t("density.compact")}
          </Button>
        </div>
      </Card>

      <Card className="settings-card settings-card--persistence">
        <div>
          <h3>{t("settings.storage")}</h3>
          <p>
            Schema v{STORAGE_VERSION}
            {storageMeta.lastError ? ` — ${storageMeta.lastError}` : ""}
          </p>
        </div>
        {onImportBackup ? <BackupImportPanel onImport={onImportBackup} /> : null}
        <div className="settings-card__actions">
          {onResetDemoData ? (
            <Button variant="secondary" onClick={onResetDemoData}>
              {t("btn.reloadDemo")}
            </Button>
          ) : null}
        </div>
      </Card>

      <Card className="settings-card">
        <div>
          <h3>{t("settings.shortcuts")}</h3>
          <p>{t("settings.shortcutsHint")}</p>
        </div>
        <ul className="settings-shortcuts">
          <li>
            <kbd>/</kbd> {t("shortcut.focusSearch")}
          </li>
          <li>
            <kbd>n</kbd> {t("shortcut.quickAdd")}
          </li>
          <li>
            <kbd>Esc</kbd> {t("shortcut.closeModal")}
          </li>
        </ul>
      </Card>

      {import.meta.env.DEV && onLoadScaleTestData ? (
        <Card className="settings-card settings-card--dev">
          <div>
            <h3>Development scale test</h3>
            <p>Load ~1,200 generated tasks for stress-testing. Use {t("btn.reloadDemo")} to restore.</p>
          </div>
          <div className="settings-card__actions">
            <Button variant="secondary" onClick={onLoadScaleTestData}>
              Load scale test data
            </Button>
          </div>
        </Card>
      ) : null}
    </section>
  );
}
