"use client";

import { useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { deleteRenterDocument, uploadRenterDocument, type RenterDocumentType } from "@/lib/user";

const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;

interface DocumentUploadFieldProps {
  uid: string;
  type: RenterDocumentType;
  label: string;
  availableLabel: string;
  hasDocument: boolean;
  // Called after the file itself is uploaded/deleted in Storage - the
  // caller is responsible for updating Firestore (the boolean flag) and
  // re-syncing any existing applications, since it needs the renter's
  // other current profile field values to build a full snapshot.
  onChange: (hasDocument: boolean) => Promise<void>;
}

export function DocumentUploadField({
  uid,
  type,
  label,
  availableLabel,
  hasDocument,
  onChange,
}: DocumentUploadFieldProps) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const isValidType = file.type === "application/pdf" || file.type.startsWith("image/");
    if (!isValidType) {
      setError(t("profile.documentInvalidType"));
      return;
    }
    if (file.size > MAX_DOCUMENT_BYTES) {
      setError(t("profile.documentTooLarge"));
      return;
    }

    setError(null);
    setUploading(true);
    try {
      await uploadRenterDocument(uid, type, file);
      await onChange(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.somethingWrong"));
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    setError(null);
    setUploading(true);
    try {
      await deleteRenterDocument(uid, type);
      await onChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.somethingWrong"));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>

      {hasDocument ? (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 shrink-0 text-good"
          >
            <path d="M4 10.5 8 14.5 16 6" />
          </svg>
          <span className="text-good">{availableLabel}</span>
          <span className="ml-auto flex gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="text-xs font-medium text-accent underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t("renterProfile.replaceDocument")}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="text-xs font-medium text-danger underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t("renterProfile.removeDocument")}
            </button>
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink transition hover:bg-bg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? t("common.saving") : t("renterProfile.uploadDocument")}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
}
