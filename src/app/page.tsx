"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { PublicHeader } from "@/components/PublicHeader";
import { HandoffIllustration } from "@/components/illustrations/HandoffIllustration";
import { HouseIcon } from "@/components/illustrations/HouseIcon";
import { KeyIcon } from "@/components/illustrations/KeyIcon";
import type { TranslationKey } from "@/lib/i18n/en";

const BENEFITS: { icon: "search" | "bolt" | "board"; titleKey: TranslationKey; descriptionKey: TranslationKey }[] = [
  { icon: "search", titleKey: "landing.benefit1Title", descriptionKey: "landing.benefit1Description" },
  { icon: "bolt", titleKey: "landing.benefit2Title", descriptionKey: "landing.benefit2Description" },
  { icon: "board", titleKey: "landing.benefit3Title", descriptionKey: "landing.benefit3Description" },
];

function BenefitIcon({ icon }: { icon: "search" | "bolt" | "board" }) {
  if (icon === "search") {
    return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <circle cx="8.5" cy="8.5" r="5" />
        <path d="M16 16l-3.8-3.8" />
      </svg>
    );
  }
  if (icon === "bolt") {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path d="M11 2 4.5 11.5h4.2l-.9 6.5L15.5 8H11l.9-6Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <rect x="3" y="10" width="3" height="7" rx="1" />
      <rect x="8.5" y="6" width="3" height="11" rx="1" />
      <rect x="14" y="3" width="3" height="14" rx="1" />
    </svg>
  );
}

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <PublicHeader />

      <main className="flex flex-1 flex-col">
        <section className="flex flex-col items-center gap-10 px-6 py-10 text-center sm:py-16">
          <HandoffIllustration className="h-auto w-full max-w-md" />

          <div className="max-w-xl space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("home.title")}
            </h1>
            <p className="text-lg text-ink">{t("home.valueProp")}</p>
            <p className="text-muted">{t("home.subtitle")}</p>
          </div>

          <div className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
            <Link
              href="/register?role=homeowner"
              className="group flex flex-col items-center gap-2 rounded-2xl bg-surface p-8 shadow-warm-sm transition hover:shadow-warm"
            >
              <HouseIcon className="h-10 w-10" />
              <span className="text-lg font-medium">{t("home.homeownerCardTitle")}</span>
              <span className="text-sm text-muted">{t("home.homeownerCardSubtitle")}</span>
            </Link>

            <Link
              href="/register?role=renter"
              className="group flex flex-col items-center gap-2 rounded-2xl bg-surface p-8 shadow-warm-sm transition hover:shadow-warm"
            >
              <KeyIcon className="h-10 w-10" />
              <span className="text-lg font-medium">{t("home.renterCardTitle")}</span>
              <span className="text-sm text-muted">{t("home.renterCardSubtitle")}</span>
            </Link>
          </div>

          <p className="text-sm text-muted">
            {t("home.haveAccount")}{" "}
            <Link href="/login" className="font-medium text-accent underline underline-offset-2">
              {t("common.logIn")}
            </Link>
          </p>
        </section>

        <section className="border-t border-line px-6 py-10 sm:py-16">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <HouseIcon className="h-16 w-16 shrink-0" />
            <div className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
                {t("about.title")}
              </h2>
              <p className="text-ink">{t("about.p1")}</p>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 sm:justify-start">
                <Link
                  href="/about"
                  className="text-sm font-medium text-accent underline underline-offset-2"
                >
                  {t("common.readMore")}
                </Link>
                <Link
                  href="/contact"
                  className="text-sm font-medium text-accent underline underline-offset-2"
                >
                  {t("landing.getInTouch")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-surface px-6 py-10 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-2xl font-semibold">{t("landing.benefitsTitle")}</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              {BENEFITS.map((benefit) => (
                <div key={benefit.titleKey} className="flex flex-col items-center gap-3 text-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <BenefitIcon icon={benefit.icon} />
                  </span>
                  <h3 className="font-medium text-ink">{t(benefit.titleKey)}</h3>
                  <p className="text-sm text-muted">{t(benefit.descriptionKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-line px-6 py-10 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-2xl font-semibold">{t("landing.howItWorksTitle")}</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <HouseIcon className="h-6 w-6" />
                  <h3 className="font-medium text-ink">{t("landing.homeownerStepsTitle")}</h3>
                </div>
                <ol className="list-inside list-decimal space-y-2 text-sm text-muted">
                  <li>{t("landing.homeownerStep1")}</li>
                  <li>{t("landing.homeownerStep2")}</li>
                  <li>{t("landing.homeownerStep3")}</li>
                </ol>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <KeyIcon className="h-6 w-6" />
                  <h3 className="font-medium text-ink">{t("landing.renterStepsTitle")}</h3>
                </div>
                <ol className="list-inside list-decimal space-y-2 text-sm text-muted">
                  <li>{t("landing.renterStep1")}</li>
                  <li>{t("landing.renterStep2")}</li>
                  <li>{t("landing.renterStep3")}</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-surface px-6 py-10 sm:py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-semibold">{t("landing.partnersTitle")}</h2>
            <p className="mt-2 text-sm text-muted">{t("landing.partnersSubtitle")}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4" aria-hidden="true">
              {[0, 1, 2, 3].map((slot) => (
                <div
                  key={slot}
                  className="h-12 w-28 rounded-xl border border-dashed border-line bg-bg"
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
