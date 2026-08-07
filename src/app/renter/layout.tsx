"use client";

import type { ReactNode } from "react";
import { useRequireRole } from "@/hooks/useRequireRole";
import { useLanguage } from "@/contexts/LanguageContext";
import { RoleNav } from "@/components/RoleNav";

export default function RenterLayout({ children }: { children: ReactNode }) {
  const { ready } = useRequireRole("renter");
  const { t } = useLanguage();

  if (!ready) {
    return <p className="px-6 py-16 text-center text-muted">{t("common.loading")}</p>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <RoleNav role="renter" />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
