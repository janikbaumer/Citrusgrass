"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const LINKS = [
  { href: "/about", labelKey: "publicHeader.about" },
  { href: "/faq", labelKey: "publicHeader.faq" },
  { href: "/contact", labelKey: "publicHeader.contact" },
] as const;

export function Footer() {
  const { t } = useLanguage();
  const year = String(new Date().getFullYear());

  return (
    <footer className="mt-auto border-t border-line px-4 py-8 text-sm text-muted sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
        <div>
          <p className="font-semibold text-ink">{t("publicHeader.brand")}</p>
          <p className="mt-1 max-w-xs text-muted">{t("footer.tagline")}</p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink">
              {t(link.labelKey)}
            </Link>
          ))}
          <a href="mailto:info@citrusgrass.com" className="hover:text-ink">
            info@citrusgrass.com
          </a>
        </nav>
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        {t("footer.copyright", { year })}
      </p>
    </footer>
  );
}
