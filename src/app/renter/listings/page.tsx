"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRenterApplications } from "@/hooks/useRenterApplications";
import { formatPropertyAddress, formatPropertySummary, getRenterStatusLabels } from "@/lib/types";
import { EmptyStateIllustration } from "@/components/illustrations/EmptyStateIllustration";

export default function RenterListingsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const applications = useRenterApplications(user?.uid);
  const renterStatusLabels = getRenterStatusLabels(t);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10 sm:py-16">
      <h1 className="mb-6 text-2xl font-semibold">{t("renterListings.title")}</h1>

      {applications === null && <p className="text-muted">{t("common.loading")}</p>}

      {applications?.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <EmptyStateIllustration className="h-24 w-auto" />
          <p className="text-muted">{t("applications.empty")}</p>
        </div>
      )}

      <ul className="space-y-3">
        {applications?.map((application) => {
          const displayProperty = application.property ?? application.propertySnapshot;
          return (
            <li
              key={application.id}
              className={`rounded-2xl bg-surface p-4 shadow-warm-sm ${
                application.property ? "" : "opacity-60"
              }`}
            >
              <p className="font-medium">
                {displayProperty
                  ? formatPropertyAddress(displayProperty)
                  : t("common.listingUnavailable")}
              </p>
              {displayProperty && (
                <p className="text-sm text-muted">
                  {formatPropertySummary(displayProperty)}
                </p>
              )}
              {!application.property && displayProperty && (
                <p className="mt-1 text-sm text-danger">{t("common.listingUnavailable")}</p>
              )}
              <p className="mt-1 text-sm text-ink">
                {t("renterListings.status")} <span className="font-medium">{renterStatusLabels[application.status]}</span>
              </p>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
