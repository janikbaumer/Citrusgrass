"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/types";

const OPTIONS: { value: Language; labelKey: "languageSwitcher.english" | "languageSwitcher.german" }[] = [
  { value: "en", labelKey: "languageSwitcher.english" },
  { value: "de", labelKey: "languageSwitcher.german" },
];

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-1 text-sm font-medium text-muted">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLanguage(option.value)}
          className={
            option.value === language
              ? "rounded-full bg-accent px-2 py-0.5 text-accent-ink"
              : "rounded-full px-2 py-0.5 hover:text-ink"
          }
        >
          {t(option.labelKey)}
        </button>
      ))}
    </div>
  );
}
