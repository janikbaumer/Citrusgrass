"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const LINKS = [
  { href: "/about", labelKey: "publicHeader.about" },
  { href: "/faq", labelKey: "publicHeader.faq" },
  { href: "/contact", labelKey: "publicHeader.contact" },
] as const;

export function PublicHeader({ active }: { active?: (typeof LINKS)[number]["href"] }) {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="px-4 py-5 sm:px-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-ink">
          {t("publicHeader.brand")}
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-muted md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={link.href === active ? "text-accent" : "hover:text-ink"}
            >
              {t(link.labelKey)}
            </Link>
          ))}
          <LanguageSwitcher />
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={t("common.menu")}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink md:hidden"
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
        <nav className="mt-4 flex flex-col items-start gap-4 text-sm font-medium text-muted md:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={link.href === active ? "text-accent" : "hover:text-ink"}
            >
              {t(link.labelKey)}
            </Link>
          ))}
          <LanguageSwitcher />
        </nav>
      )}
    </header>
  );
}
