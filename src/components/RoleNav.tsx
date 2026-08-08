"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { UserRole } from "@/lib/types";
import type { TranslationKey } from "@/lib/i18n/en";

const LINKS: Record<UserRole, { href: string; labelKey: TranslationKey }[]> = {
  renter: [
    { href: "/renter/dashboard", labelKey: "roleNav.dashboard" },
    { href: "/renter/profile", labelKey: "roleNav.profile" },
    { href: "/renter/listings", labelKey: "roleNav.applications" },
  ],
  homeowner: [
    { href: "/homeowner/dashboard", labelKey: "roleNav.dashboard" },
    { href: "/homeowner/properties", labelKey: "roleNav.properties" },
    { href: "/homeowner/profile", labelKey: "roleNav.profile" },
  ],
};

export function RoleNav({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { t } = useLanguage();

  return (
    <nav className="flex items-center justify-between border-b border-line bg-surface px-6 py-3">
      <div className="flex gap-5">
        {LINKS[role].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              pathname === link.href || pathname.startsWith(`${link.href}/`)
                ? "text-sm font-medium text-accent"
                : "text-sm font-medium text-muted hover:text-ink"
            }
          >
            {t(link.labelKey)}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-5">
        <Link href="/about" className="text-sm font-medium text-muted hover:text-ink">
          {t("publicHeader.about")}
        </Link>
        <Link href="/faq" className="text-sm font-medium text-muted hover:text-ink">
          {t("publicHeader.faq")}
        </Link>
        <Link href="/contact" className="text-sm font-medium text-muted hover:text-ink">
          {t("publicHeader.contact")}
        </Link>
        <span aria-hidden="true" className="h-4 w-px bg-line" />
        <LanguageSwitcher />
        <span aria-hidden="true" className="h-4 w-px bg-line" />
        <button
          onClick={() => signOut()}
          className="text-sm font-medium text-muted hover:text-ink"
        >
          {t("roleNav.signOut")}
        </button>
      </div>
    </nav>
  );
}
