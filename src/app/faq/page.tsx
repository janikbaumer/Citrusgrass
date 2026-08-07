"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { PublicHeader } from "@/components/PublicHeader";
import type { TranslationKey } from "@/lib/i18n/en";

const FAQS: { questionKey: TranslationKey; answerKey: TranslationKey }[] = [
  { questionKey: "faq.q1", answerKey: "faq.a1" },
  { questionKey: "faq.q2", answerKey: "faq.a2" },
  { questionKey: "faq.q3", answerKey: "faq.a3" },
  { questionKey: "faq.q4", answerKey: "faq.a4" },
];

export default function FaqPage() {
  const { t } = useLanguage();

  return (
    <>
      <PublicHeader active="/faq" />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <h1 className="mb-6 text-2xl font-semibold">{t("faq.title")}</h1>
        <div className="space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.questionKey}>
              <h2 className="font-medium text-ink">{t(faq.questionKey)}</h2>
              <p className="mt-1 text-muted">{t(faq.answerKey)}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
