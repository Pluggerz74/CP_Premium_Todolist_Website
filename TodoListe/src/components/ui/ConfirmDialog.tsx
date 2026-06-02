import type { PropsWithChildren, ReactNode } from "react";
import { useI18n } from "../../i18n/useI18n";
import { Button } from "./Button";

type ConfirmDialogProps = PropsWithChildren<{
  title: string;
  message: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}>;

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = "danger",
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  const { t } = useI18n();

  return (
    <div className="confirm-dialog" role="alertdialog" aria-labelledby="confirm-dialog-title">
      <h3 id="confirm-dialog-title">{title}</h3>
      <div className="confirm-dialog__message">{message}</div>
      {children}
      <div className="confirm-dialog__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {cancelLabel ?? t("btn.cancel")}
        </Button>
        <Button type="button" variant={variant === "danger" ? "danger" : "primary"} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}
