"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!profile) {
      router.replace("/onboarding");
      return;
    }
    router.replace(`/${profile.role}/dashboard`);
  }, [loading, user, profile, router]);

  return <p className="px-6 py-16 text-center text-muted">{t("common.loading")}</p>;
}
