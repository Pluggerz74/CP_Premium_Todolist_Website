import { useRef, useState } from "react";
import { Button } from "../../components/ui/Button";
import { downloadAppBackup, parseBackupFile, type AppDataSnapshot } from "../../utils/dataBackup";

type BackupImportPanelProps = {
  onImport: (snapshot: AppDataSnapshot) => void;
};

type ImportStep = "idle" | "preview" | "confirm" | "success" | "error";

export function BackupImportPanel({ onImport }: BackupImportPanelProps) {
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
        setMessage(result.error);
        setPendingSnapshot(null);
        return;
      }
      setPendingSnapshot(result.snapshot);
      setStep("preview");
      setMessage(
        `Found ${result.snapshot.projects.length} projects and ${result.snapshot.tasks.length} tasks (exported ${new Date(result.snapshot.exportedAt).toLocaleString()}).`,
      );
    };
    reader.onerror = () => {
      setStep("error");
      setMessage("Could not read the selected file.");
    };
    reader.readAsText(file);
  }

  function handleConfirmImport() {
    if (!pendingSnapshot) return;
    try {
      onImport(pendingSnapshot);
      setStep("success");
      setMessage("Backup imported. Your workspace has been refreshed with the imported data.");
      setPendingSnapshot(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setStep("error");
      setMessage("Import failed. Your previous data was not changed.");
    }
  }

  return (
    <div className="backup-import">
      <div className="settings-card__actions">
        <Button variant="secondary" onClick={downloadAppBackup}>
          Download backup
        </Button>
        <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
          Import backup
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
          <p className="backup-import__warning">
            Importing will replace all projects, tasks, and hierarchy stored on this device. Download a backup first if
            you want to keep your current data.
          </p>
          <div className="backup-import__actions">
            <Button variant="secondary" onClick={resetFlow}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setStep("confirm")}>
              Continue
            </Button>
          </div>
        </div>
      ) : null}

      {step === "confirm" && pendingSnapshot ? (
        <div className="backup-import__panel backup-import__panel--danger" role="alert">
          <p>
            <strong>Replace local data?</strong> This cannot be undone without another backup file.
          </p>
          <div className="backup-import__actions">
            <Button variant="secondary" onClick={() => setStep("preview")}>
              Go back
            </Button>
            <Button variant="danger" onClick={handleConfirmImport}>
              Yes, import backup
            </Button>
          </div>
        </div>
      ) : null}

      {step === "success" ? (
        <div className="backup-import__panel backup-import__panel--success" role="status">
          <p>{message}</p>
          <Button variant="secondary" onClick={resetFlow}>
            Done
          </Button>
        </div>
      ) : null}

      {step === "error" && message ? (
        <div className="backup-import__panel backup-import__panel--error" role="alert">
          <p>{message}</p>
          <Button variant="secondary" onClick={resetFlow}>
            Dismiss
          </Button>
        </div>
      ) : null}
    </div>
  );
}
