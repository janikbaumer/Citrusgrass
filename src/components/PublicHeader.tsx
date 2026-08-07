"use client";

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

  return (
    <header className="flex items-center justify-between px-6 py-5">
      <Link href="/" className="text-lg font-semibold text-ink">
        {t("publicHeader.brand")}
      </Link>
      <nav className="flex items-center gap-5 text-sm font-medium text-muted">
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
    </header>
  );
}
