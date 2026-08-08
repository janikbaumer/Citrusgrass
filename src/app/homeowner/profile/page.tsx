"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { updateUserProfile } from "@/lib/user";
import type { LandlordType } from "@/lib/types";

export default function HomeownerProfilePage() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();

  // The homeowner layout only renders this page once `profile` is loaded,
  // so these initial values are always accurate on first render.
  const [firstName, setFirstName] = useState(profile?.firstName || "");
  const [lastName, setLastName] = useState(profile?.lastName || "");
  const [landlordType, setLandlordType] = useState<LandlordType>(
    profile?.landlordType || "private"
  );
  const [phone, setPhone] = useState(profile?.phone || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await updateUserProfile(user.uid, { firstName, lastName, landlordType, phone });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.somethingWrong"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-lg px-6 py-10 sm:py-16">
      <h1 className="mb-6 text-center text-2xl font-semibold">{t("homeownerProfile.title")}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-ink">
              {t("field.firstName")}
            </label>
            <input
              id="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-ink">
              {t("field.lastName")}
            </label>
            <input
              id="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div>
          <span className="mb-1 block text-sm font-medium text-ink">{t("homeownerProfile.landlordType")}</span>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="radio"
                name="landlordType"
                value="private"
                checked={landlordType === "private"}
                onChange={() => setLandlordType("private")}
                className="accent-accent"
              />
              {t("homeownerProfile.private")}
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="radio"
                name="landlordType"
                value="company"
                checked={landlordType === "company"}
                onChange={() => setLandlordType("company")}
                className="accent-accent"
              />
              {t("homeownerProfile.company")}
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">
            {t("field.email")}
          </label>
          <input
            id="email"
            type="email"
            disabled
            value={profile?.email || ""}
            className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm text-muted"
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-ink">
            {t("field.phone")}
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
          {saving ? t("common.saving") : t("common.save")}
        </button>
      </form>
    </main>
  );
}
