"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { PublicHeader } from "@/components/PublicHeader";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <>
      <PublicHeader active="/contact" />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <h1 className="mb-6 text-2xl font-semibold">{t("contact.title")}</h1>
        <p className="text-ink">
          {t("contact.intro")}{" "}
          <a
            href="mailto:info@citrusgrass.com"
            className="font-medium text-accent underline underline-offset-2"
          >
            info@citrusgrass.com
          </a>
          .
        </p>
      </main>
    </>
  );
}
