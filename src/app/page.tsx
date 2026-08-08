"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PublicHeader } from "@/components/PublicHeader";
import { HandoffIllustration } from "@/components/illustrations/HandoffIllustration";
import { HouseIcon } from "@/components/illustrations/HouseIcon";
import { KeyIcon } from "@/components/illustrations/KeyIcon";

export default function Home() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (loading || !user) return;
    router.replace(profile ? `/${profile.role}/dashboard` : "/onboarding");
  }, [loading, user, profile, router]);

  if (loading || user) {
    return null;
  }

  return (
    <>
      <PublicHeader />

      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-10 sm:py-16 text-center">
        <HandoffIllustration className="h-auto w-full max-w-md" />

        <div className="max-w-xl space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("home.title")}
          </h1>
          <p className="text-muted">{t("home.subtitle")}</p>
        </div>

        <div className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
          <Link
            href="/register?role=homeowner"
            className="group flex flex-col items-center gap-2 rounded-2xl bg-surface p-8 shadow-warm-sm transition hover:shadow-warm"
          >
            <HouseIcon className="h-10 w-10" />
            <span className="text-lg font-medium">{t("home.homeownerCardTitle")}</span>
            <span className="text-sm text-muted">{t("home.homeownerCardSubtitle")}</span>
          </Link>

          <Link
            href="/register?role=renter"
            className="group flex flex-col items-center gap-2 rounded-2xl bg-surface p-8 shadow-warm-sm transition hover:shadow-warm"
          >
            <KeyIcon className="h-10 w-10" />
            <span className="text-lg font-medium">{t("home.renterCardTitle")}</span>
            <span className="text-sm text-muted">{t("home.renterCardSubtitle")}</span>
          </Link>
        </div>

        <p className="text-sm text-muted">
          {t("home.haveAccount")}{" "}
          <Link href="/login" className="font-medium text-accent underline underline-offset-2">
            {t("common.logIn")}
          </Link>
        </p>
      </main>
    </>
  );
}
