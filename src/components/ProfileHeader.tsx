"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { deleteProfilePicture, updateUserProfile, uploadProfilePicture } from "@/lib/user";
import { displayName } from "@/lib/types";
import type { UserRole } from "@/lib/types";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export function ProfileHeader({ role }: { role: UserRole }) {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!profile) return null;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      setError(t("profile.photoInvalidType"));
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError(t("profile.photoTooLarge"));
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const photoURL = await uploadProfilePicture(user.uid, file);
      await updateUserProfile(user.uid, { photoURL });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.somethingWrong"));
    } finally {
      setUploading(false);
    }
  }

  async function handleRemovePhoto() {
    if (!user) return;
    setError(null);
    setUploading(true);
    try {
      await deleteProfilePicture(user.uid);
      await updateUserProfile(user.uid, { photoURL: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.somethingWrong"));
    } finally {
      setUploading(false);
    }
  }

  const initials = `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="mb-6 overflow-hidden rounded-2xl bg-surface shadow-warm-sm">
      <div className="zest-glow-top h-20 bg-good-bg sm:h-24" />

      <div className="px-6 pb-6">
        <div className="-mt-10 sm:-mt-12">
          <div className="relative inline-block h-20 w-20 shrink-0 rounded-full border-4 border-surface sm:h-24 sm:w-24">
            {profile.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.photoURL}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-accent text-xl font-semibold text-accent-ink sm:text-2xl">
                {initials}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              aria-label={t("profile.changePhoto")}
              className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-warm-sm transition hover:bg-bg disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h1.13a1.5 1.5 0 0 0 1.28-.72l.4-.66A1.5 1.5 0 0 1 9.59 4h.82a1.5 1.5 0 0 1 1.28.72l.4.66A1.5 1.5 0 0 0 13.37 6h1.13A1.5 1.5 0 0 1 16 7.5v6A1.5 1.5 0 0 1 14.5 15h-9A1.5 1.5 0 0 1 4 13.5v-6Z" />
                <circle cx="10" cy="10.5" r="2.5" />
              </svg>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="mt-3">
          <h1 className="text-xl font-semibold text-ink sm:text-2xl">{displayName(profile)}</h1>
          <span className="mt-1 inline-block rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium capitalize text-accent">
            {t(`roles.${role}`)}
          </span>
        </div>

        {error && <p className="mt-2 text-sm text-danger">{error}</p>}

        {profile.photoURL && (
          <button
            type="button"
            onClick={handleRemovePhoto}
            disabled={uploading}
            className="mt-2 text-xs text-muted underline underline-offset-2 hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t("profile.removePhoto")}
          </button>
        )}
      </div>
    </div>
  );
}
