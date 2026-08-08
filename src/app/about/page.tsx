"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { PublicHeader } from "@/components/PublicHeader";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <>
      <PublicHeader active="/about" />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10 sm:py-16">
        <h1 className="mb-6 text-2xl font-semibold">{t("about.title")}</h1>
        <div className="space-y-4 text-ink">
          <p>{t("about.p1")}</p>
          <p>{t("about.p2")}</p>
          <p>{t("about.p3")}</p>
        </div>
      </main>
    </>
  );
}
