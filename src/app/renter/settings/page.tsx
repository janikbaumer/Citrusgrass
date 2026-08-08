"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { ChangePasswordSection } from "@/components/ChangePasswordSection";
import { DeleteAccountSection } from "@/components/DeleteAccountSection";

export default function RenterSettingsPage() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto w-full max-w-lg px-6 py-10 sm:py-16">
      <h1 className="text-center text-2xl font-semibold">{t("settings.title")}</h1>
      <div className="mt-6">
        <ChangePasswordSection />
      </div>
      <DeleteAccountSection />
    </main>
  );
}
