"use client";

import { useState } from "react";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export function ChangePasswordSection() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isGoogleAccount = user?.providerData[0]?.providerId === "google.com";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !user.email) return;
    setError(null);
    setSaved(false);
    if (newPassword !== confirmPassword) {
      setError(t("changePassword.mismatchError"));
      return;
    }
    setSaving(true);
    try {
      await reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(user.email, currentPassword)
      );
      await updatePassword(user, newPassword);
      setSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.somethingWrong"));
    } finally {
      setSaving(false);
    }
  }

  if (isGoogleAccount) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6">
        <h2 className="text-lg font-semibold text-ink">{t("changePassword.title")}</h2>
        <p className="mt-1 text-sm text-muted">{t("changePassword.googleAccount")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="text-lg font-semibold text-ink">{t("changePassword.title")}</h2>

      <form onSubmit={handleSubmit} className="mt-4 max-w-sm space-y-3">
        <div>
          <label htmlFor="currentPassword" className="mb-1 block text-sm font-medium text-ink">
            {t("changePassword.currentPassword")}
          </label>
          <input
            id="currentPassword"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-ink">
            {t("changePassword.newPassword")}
          </label>
          <input
            id="newPassword"
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-ink">
            {t("changePassword.confirmPassword")}
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}
        {saved && !error && <p className="text-sm text-good">{t("common.saved")}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? t("common.saving") : t("changePassword.submit")}
        </button>
      </form>
    </div>
  );
}
