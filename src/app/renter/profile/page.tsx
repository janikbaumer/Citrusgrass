"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { updateUserProfile } from "@/lib/user";
import { buildRenterSnapshot, resyncRenterSnapshot } from "@/lib/application";
import { ProfileHeader } from "@/components/ProfileHeader";
import { DocumentUploadField } from "@/components/DocumentUploadField";
import type { TranslationKey } from "@/lib/i18n/en";
import type { UserProfile } from "@/lib/types";

// The Firestore-stored `value` stays the original English string for
// backwards compatibility with existing renter profiles - only the
// displayed label (`labelKey`) is translated.
const SALARY_RANGES: { value: string; labelKey: TranslationKey }[] = [
  { value: "Under $30,000", labelKey: "salaryRange.under30k" },
  { value: "$30,000 - $50,000", labelKey: "salaryRange.30to50k" },
  { value: "$50,000 - $75,000", labelKey: "salaryRange.50to75k" },
  { value: "$75,000 - $100,000", labelKey: "salaryRange.75to100k" },
  { value: "$100,000 - $150,000", labelKey: "salaryRange.100to150k" },
  { value: "$150,000+", labelKey: "salaryRange.over150k" },
  { value: "Prefer not to say", labelKey: "salaryRange.preferNotToSay" },
];

type DocumentFlag = "hasDebtRegisterDocument" | "hasIdDocument" | "hasSalaryStatement";

export default function RenterProfilePage() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();

  // The renter layout only renders this page once `profile` is loaded, so
  // these initial values are always accurate on first render.
  const [firstName, setFirstName] = useState(profile?.firstName || "");
  const [lastName, setLastName] = useState(profile?.lastName || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [salaryRange, setSalaryRange] = useState(profile?.salaryRange || "");
  const [about, setAbout] = useState(profile?.about || "");
  const [jobTitle, setJobTitle] = useState(profile?.jobTitle || "");
  const [hasDebtRegisterDocument, setHasDebtRegisterDocument] = useState(
    !!profile?.hasDebtRegisterDocument
  );
  const [hasIdDocument, setHasIdDocument] = useState(!!profile?.hasIdDocument);
  const [hasSalaryStatement, setHasSalaryStatement] = useState(!!profile?.hasSalaryStatement);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Needed by four call sites (main save, plus one per document field) -
  // overrides let a document handler reflect its own just-changed flag
  // immediately, without waiting for React to commit the setState call.
  function currentSnapshot(overrides?: Partial<Pick<UserProfile, DocumentFlag>>) {
    return buildRenterSnapshot({
      firstName,
      lastName,
      email: profile!.email,
      phone,
      salaryRange,
      about,
      jobTitle,
      hasDebtRegisterDocument: overrides?.hasDebtRegisterDocument ?? hasDebtRegisterDocument,
      hasIdDocument: overrides?.hasIdDocument ?? hasIdDocument,
      hasSalaryStatement: overrides?.hasSalaryStatement ?? hasSalaryStatement,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await updateUserProfile(user.uid, { firstName, lastName, phone, salaryRange, about, jobTitle });
      await resyncRenterSnapshot(user.uid, currentSnapshot());
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.somethingWrong"));
    } finally {
      setSaving(false);
    }
  }

  function handleDocumentChange(flag: DocumentFlag, setFlag: (value: boolean) => void) {
    return async (hasDocument: boolean) => {
      if (!user) return;
      await updateUserProfile(user.uid, { [flag]: hasDocument });
      await resyncRenterSnapshot(user.uid, currentSnapshot({ [flag]: hasDocument }));
      setFlag(hasDocument);
    };
  }

  return (
    <main className="mx-auto w-full max-w-lg px-6 py-10 sm:py-16">
      <ProfileHeader role="renter" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="space-y-4 rounded-2xl bg-surface p-6 shadow-warm-sm">
          <h2 className="text-lg font-semibold text-ink">{t("renterProfile.personalInfoTitle")}</h2>

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
            <label htmlFor="jobTitle" className="mb-1 block text-sm font-medium text-ink">
              {t("renterProfile.jobTitle")}
            </label>
            <input
              id="jobTitle"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
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

          <div>
            <label htmlFor="salaryRange" className="mb-1 block text-sm font-medium text-ink">
              {t("renterProfile.salaryRange")}
            </label>
            <select
              id="salaryRange"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
            >
              <option value="">{t("renterProfile.selectRange")}</option>
              {SALARY_RANGES.map((range) => (
                <option key={range.value} value={range.value}>
                  {t(range.labelKey)}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl bg-surface p-6 shadow-warm-sm">
          <h2 className="text-lg font-semibold text-ink">{t("renterProfile.aboutMeTitle")}</h2>

          <div>
            <label htmlFor="about" className="mb-1 block text-sm font-medium text-ink">
              {t("renterProfile.about")}
            </label>
            <textarea
              id="about"
              rows={4}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
        </section>

        {user && (
          <section className="space-y-4 rounded-2xl bg-surface p-6 shadow-warm-sm">
            <h2 className="text-lg font-semibold text-ink">{t("renterProfile.documentsTitle")}</h2>

            <DocumentUploadField
              uid={user.uid}
              type="debt-register-documents"
              label={t("renterProfile.debtRegisterLabel")}
              availableLabel={t("pipelineBoard.debtRegisterAvailable")}
              hasDocument={hasDebtRegisterDocument}
              onChange={handleDocumentChange("hasDebtRegisterDocument", setHasDebtRegisterDocument)}
            />

            <DocumentUploadField
              uid={user.uid}
              type="id-documents"
              label={t("renterProfile.idDocumentLabel")}
              availableLabel={t("pipelineBoard.idDocumentAvailable")}
              hasDocument={hasIdDocument}
              onChange={handleDocumentChange("hasIdDocument", setHasIdDocument)}
            />

            <DocumentUploadField
              uid={user.uid}
              type="salary-statements"
              label={t("renterProfile.salaryStatementLabel")}
              availableLabel={t("pipelineBoard.salaryStatementAvailable")}
              hasDocument={hasSalaryStatement}
              onChange={handleDocumentChange("hasSalaryStatement", setHasSalaryStatement)}
            />
          </section>
        )}

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
