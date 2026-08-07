"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProperty } from "@/lib/property";
import { buildRenterSnapshot, createApplication, findExistingApplication } from "@/lib/application";
import { formatPropertyAddress, formatPropertySummary, getRenterStatusLabels } from "@/lib/types";
import type { Application, Property } from "@/lib/types";

export default function ApplyPageClient() {
  const params = useParams<{ propertyId: string }>();
  const propertyId = params.propertyId;
  const { user, profile, loading, signOut } = useAuth();
  const { t } = useLanguage();
  const renterStatusLabels = getRenterStatusLabels(t);

  const [property, setProperty] = useState<Property | null | undefined>(undefined);
  const [existingApplication, setExistingApplication] = useState<Application | null | undefined>(
    undefined
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProperty(propertyId).then(setProperty);
  }, [propertyId]);

  useEffect(() => {
    if (!user || !profile || profile.role !== "renter") return;
    findExistingApplication(propertyId, user.uid).then(setExistingApplication);
  }, [propertyId, user, profile]);

  async function handleApply() {
    if (!user || !property) return;
    setError(null);
    setSubmitting(true);
    try {
      const snapshot = buildRenterSnapshot(profile!);
      const id = await createApplication(propertyId, property.ownerId, user.uid, snapshot);
      setExistingApplication({
        id,
        propertyId,
        ownerId: property.ownerId,
        renterId: user.uid,
        renter: snapshot,
        status: "application_received",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.somethingWrong"));
    } finally {
      setSubmitting(false);
    }
  }

  if (property === undefined || loading) {
    return <p className="px-6 py-16 text-center text-muted">{t("common.loading")}</p>;
  }

  if (property === null) {
    return <p className="px-6 py-16 text-center text-muted">{t("apply.notFound")}</p>;
  }

  const next = `/apply/${propertyId}`;

  return (
    <main className="mx-auto w-full max-w-lg px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">{formatPropertyAddress(property)}</h1>
      <p className="mt-1 text-muted">{formatPropertySummary(property)}</p>
      {property.description && (
        <p className="mx-auto mt-3 max-w-md text-sm text-ink">{property.description}</p>
      )}

      <div className="mt-8">
        {!user && (
          <div className="space-y-3">
            <p className="text-ink">{t("apply.logInPrompt")}</p>
            <div className="flex justify-center gap-3">
              <Link
                href={`/login?next=${encodeURIComponent(next)}`}
                className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition hover:bg-bg"
              >
                {t("common.logIn")}
              </Link>
              <Link
                href={`/register?role=renter&next=${encodeURIComponent(next)}`}
                className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition hover:bg-accent-hover"
              >
                {t("apply.signUpAsRenter")}
              </Link>
            </div>
          </div>
        )}

        {user && !profile && (
          <div className="space-y-3">
            <p className="text-ink">{t("apply.finishSetup")}</p>
            <Link
              href={`/onboarding?next=${encodeURIComponent(next)}`}
              className="inline-block rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition hover:bg-accent-hover"
            >
              {t("apply.continue")}
            </Link>
          </div>
        )}

        {user && profile && profile.role !== "renter" && (
          <div className="space-y-3">
            <p className="text-ink">{t("apply.wrongRole")}</p>
            <button
              onClick={() => signOut()}
              className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition hover:bg-bg"
            >
              {t("apply.logOut")}
            </button>
          </div>
        )}

        {user && profile && profile.role === "renter" && existingApplication === undefined && (
          <p className="text-muted">{t("apply.checkingStatus")}</p>
        )}

        {user && profile && profile.role === "renter" && existingApplication === null && (
          <div className="space-y-3">
            <p className="text-ink">
              {t("apply.applyUsingProfile", { name: `${profile.firstName} ${profile.lastName}` })}
            </p>
            {error && <p className="text-sm text-danger">{error}</p>}
            <button
              onClick={handleApply}
              disabled={submitting}
              className="rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? t("apply.submitting") : t("apply.submit")}
            </button>
          </div>
        )}

        {user && profile && profile.role === "renter" && existingApplication && (
          <p className="text-ink">
            {t("apply.alreadyApplied")}{" "}
            <span className="font-medium">
              {renterStatusLabels[existingApplication.status]}
            </span>
          </p>
        )}
      </div>
    </main>
  );
}
