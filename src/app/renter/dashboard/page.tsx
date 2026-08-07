"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRenterApplications } from "@/hooks/useRenterApplications";
import { RenterPipelineBoard } from "@/components/RenterPipelineBoard";
import { displayName } from "@/lib/types";
import { EmptyStateIllustration } from "@/components/illustrations/EmptyStateIllustration";

export default function RenterDashboardPage() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const applications = useRenterApplications(user?.uid);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold">
          {t("common.welcome")} {profile && displayName(profile)}
        </h1>
        <p className="text-muted">{t("renterDashboard.subtitle")}</p>
      </div>

      {applications === null && <p className="text-center text-muted">{t("common.loading")}</p>}

      {applications?.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <EmptyStateIllustration className="h-24 w-auto" />
          <p className="text-muted">{t("applications.empty")}</p>
        </div>
      )}

      {applications && applications.length > 0 && (
        <RenterPipelineBoard applications={applications} />
      )}
    </main>
  );
}
