"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { createUserProfile } from "@/lib/user";
import { isSafeRedirect } from "@/lib/safeRedirect";
import type { UserRole } from "@/lib/types";
import { HouseIcon } from "@/components/illustrations/HouseIcon";
import { KeyIcon } from "@/components/illustrations/KeyIcon";

function Onboarding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <p className="px-6 py-16 text-center text-muted">{t("common.loading")}</p>;
  }

  if (!user) {
    router.replace("/login");
    return null;
  }

  async function chooseRole(role: UserRole) {
    if (!user) return;
    setSubmitting(true);
    await createUserProfile(user, role);
    router.push(isSafeRedirect(next) ? next : "/dashboard");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <div className="max-w-xl space-y-2">
        <h1 className="text-2xl font-semibold">{t("onboarding.title")}</h1>
        <p className="text-muted">{t("onboarding.subtitle")}</p>
      </div>
      <div className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
        <button
          onClick={() => chooseRole("homeowner")}
          disabled={submitting}
          className="flex flex-col items-center gap-2 rounded-2xl bg-surface p-8 shadow-warm-sm transition hover:shadow-warm disabled:cursor-not-allowed disabled:opacity-60"
        >
          <HouseIcon className="h-10 w-10" />
          <span className="text-lg font-medium">{t("onboarding.homeowner")}</span>
        </button>
        <button
          onClick={() => chooseRole("renter")}
          disabled={submitting}
          className="flex flex-col items-center gap-2 rounded-2xl bg-surface p-8 shadow-warm-sm transition hover:shadow-warm disabled:cursor-not-allowed disabled:opacity-60"
        >
          <KeyIcon className="h-10 w-10" />
          <span className="text-lg font-medium">{t("onboarding.renter")}</span>
        </button>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <Onboarding />
    </Suspense>
  );
}
