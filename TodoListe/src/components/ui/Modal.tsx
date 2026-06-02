import type { PropsWithChildren } from "react";
import { useI18n } from "../../i18n/useI18n";
import { Button } from "./Button";

type ModalProps = PropsWithChildren<{
  title: string;
  isOpen: boolean;
  onClose: () => void;
}>;

export function Modal({ title, isOpen, onClose, children }: ModalProps) {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <h2 id="modal-title">{title}</h2>
          <Button variant="ghost" onClick={onClose} aria-label={t("modal.close")}>
            ×
          </Button>
        </header>
        {children}
      </section>
    </div>
  );
}
