import { useRef, useState } from "react";
import { useI18n } from "../../i18n/useI18n";
import { translateBackupError } from "../../i18n/helpers";
import { Button } from "../../components/ui/Button";
import { downloadAppBackup, parseBackupFile, type AppDataSnapshot } from "../../utils/dataBackup";

type BackupImportPanelProps = {
  onImport: (snapshot: AppDataSnapshot) => void;
};

type ImportStep = "idle" | "preview" | "confirm" | "success" | "error";

export function BackupImportPanel({ onImport }: BackupImportPanelProps) {
  const { t, language } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<ImportStep>("idle");
  const [pendingSnapshot, setPendingSnapshot] = useState<AppDataSnapshot | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function resetFlow() {
    setStep("idle");
    setPendingSnapshot(null);
    setMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === "string" ? reader.result : "";
      const result = parseBackupFile(content);
      if (!result.ok) {
        setStep("error");
        setMessage(translateBackupError(language, result.error));
        setPendingSnapshot(null);
        return;
      }
      setPendingSnapshot(result.snapshot);
      setStep("preview");
      setMessage(
        t("backup.previewFound", {
          projects: result.snapshot.projects.length,
          tasks: result.snapshot.tasks.length,
          date: new Date(result.snapshot.exportedAt).toLocaleString(),
        }),
      );
    };
    reader.onerror = () => {
      setStep("error");
      setMessage(t("backup.error.readFailed"));
    };
    reader.readAsText(file);
  }

  function handleConfirmImport() {
    if (!pendingSnapshot) return;
    try {
      onImport(pendingSnapshot);
      setStep("success");
      setMessage(t("backup.success"));
      setPendingSnapshot(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setStep("error");
      setMessage(t("backup.error.importFailed"));
    }
  }

  return (
    <div className="backup-import">
      <div className="settings-card__actions">
        <Button variant="secondary" onClick={downloadAppBackup}>
          {t("btn.downloadBackup")}
        </Button>
        <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
          {t("btn.importBackup")}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="backup-import__file-input"
          aria-hidden="true"
          tabIndex={-1}
          onChange={handleFileChange}
        />
      </div>

      {step === "preview" && pendingSnapshot ? (
        <div className="backup-import__panel" role="status">
          <p>{message}</p>
          <p className="backup-import__warning">{t("backup.previewWarning")}</p>
          <div className="backup-import__actions">
            <Button variant="secondary" onClick={resetFlow}>
              {t("btn.cancel")}
            </Button>
            <Button variant="primary" onClick={() => setStep("confirm")}>
              {t("btn.continue")}
            </Button>
          </div>
        </div>
      ) : null}

      {step === "confirm" && pendingSnapshot ? (
        <div className="backup-import__panel backup-import__panel--danger" role="alert">
          <p>
            <strong>{t("confirm.importReplace")}</strong> {t("confirm.importReplaceHint")}
          </p>
          <div className="backup-import__actions">
            <Button variant="secondary" onClick={() => setStep("preview")}>
              {t("btn.goBack")}
            </Button>
            <Button variant="danger" onClick={handleConfirmImport}>
              {t("btn.confirmImport")}
            </Button>
          </div>
        </div>
      ) : null}

      {step === "success" ? (
        <div className="backup-import__panel backup-import__panel--success" role="status">
          <p>{message}</p>
          <Button variant="secondary" onClick={resetFlow}>
            {t("btn.done")}
          </Button>
        </div>
      ) : null}

      {step === "error" && message ? (
        <div className="backup-import__panel backup-import__panel--error" role="alert">
          <p>{message}</p>
          <Button variant="secondary" onClick={resetFlow}>
            {t("btn.dismiss")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
