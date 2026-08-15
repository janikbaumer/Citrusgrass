"use client";

import { useState } from "react";
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
    { href: "/browse", labelKey: "publicHeader.browse" },
    { href: "/renter/profile", labelKey: "roleNav.profile" },
    { href: "/renter/listings", labelKey: "roleNav.applications" },
    { href: "/renter/settings", labelKey: "roleNav.settings" },
  ],
  homeowner: [
    { href: "/homeowner/dashboard", labelKey: "roleNav.dashboard" },
    { href: "/homeowner/properties", labelKey: "roleNav.properties" },
    { href: "/homeowner/profile", labelKey: "roleNav.profile" },
    { href: "/homeowner/settings", labelKey: "roleNav.settings" },
  ],
};

export function RoleNav({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  // RoleNav lives in a persistent layout, so a Link click doesn't remount
  // it - close the mobile menu whenever the route changes by adjusting
  // state during render (see React's "adjusting state on prop change"
  // pattern) rather than in an effect, mirroring AuthContext's derived
  // `loading` elsewhere in this codebase.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav className="zest-glow-top border-b border-line bg-surface px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 sm:gap-5">
          {LINKS[role].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive(link.href)
                  ? "text-sm font-medium text-accent"
                  : "text-sm font-medium text-muted hover:text-ink"
              }
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-5 md:flex">
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

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={t("common.menu")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-ink md:hidden"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="h-5 w-5"
          >
            <path d="M3 5.5h14M3 10h14M3 14.5h14" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="mt-3 flex flex-col items-start gap-4 border-t border-line pt-3 text-sm font-medium text-muted md:hidden">
          <Link href="/about" className="hover:text-ink" onClick={() => setMenuOpen(false)}>
            {t("publicHeader.about")}
          </Link>
          <Link href="/faq" className="hover:text-ink" onClick={() => setMenuOpen(false)}>
            {t("publicHeader.faq")}
          </Link>
          <Link href="/contact" className="hover:text-ink" onClick={() => setMenuOpen(false)}>
            {t("publicHeader.contact")}
          </Link>
          <LanguageSwitcher />
          <button onClick={() => signOut()} className="hover:text-ink">
            {t("roleNav.signOut")}
          </button>
        </div>
      )}
    </nav>
  );
}
