"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { displayName } from "@/lib/types";

export default function HomeownerDashboardPage() {
  const { profile } = useAuth();
  const { t } = useLanguage();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">
        {t("common.welcome")} {profile && displayName(profile)}
      </h1>
      <p className="text-muted">{t("homeownerDashboard.subtitle")}</p>
      <p className="text-sm text-muted">{t("homeownerDashboard.moreComing")}</p>
    </main>
  );
}
