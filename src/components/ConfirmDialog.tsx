"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function ConfirmDialog({
  open,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  danger,
}: ConfirmDialogProps) {
  const { t } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={onCancel}
      onClick={(e) => {
        if (e.target === dialogRef.current) onCancel();
      }}
      className="m-auto w-full max-w-sm rounded-2xl border-0 bg-surface p-6 shadow-warm backdrop:bg-ink/40"
    >
      <p className="text-ink">{message}</p>
      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition hover:bg-bg"
        >
          {t("common.cancel")}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={
            danger
              ? "rounded-full bg-danger px-4 py-2 text-sm font-medium text-accent-ink transition hover:opacity-90"
              : "rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition hover:bg-accent-hover"
          }
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
