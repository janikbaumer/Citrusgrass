"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPropertyAddress, formatPropertySummary } from "@/lib/types";
import type { Property } from "@/lib/types";
import { PublicHeader } from "@/components/PublicHeader";
import { EmptyStateIllustration } from "@/components/illustrations/EmptyStateIllustration";

export default function BrowsePage() {
  const { t } = useLanguage();
  const [properties, setProperties] = useState<Property[] | null>(null);

  const [city, setCity] = useState("");
  const [minRooms, setMinRooms] = useState("");
  const [maxRooms, setMaxRooms] = useState("");
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");

  useEffect(() => {
    // One-shot fetch, not a live onSnapshot listener - this page is public
    // and could see real unauthenticated traffic, so we avoid holding an
    // open realtime connection per visitor. The query must filter on both
    // isPubliclyListed and status literally, since that's what the
    // Firestore security rule checks to allow this list at all.
    const q = query(
      collection(db, "properties"),
      where("isPubliclyListed", "==", true),
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    );
    getDocs(q).then((snapshot) => {
      setProperties(
        snapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...(docSnapshot.data() as Omit<Property, "id">),
        }))
      );
    });
  }, []);

  // Filtering happens client-side, over the single fetch above, rather than
  // via more Firestore `where` clauses - Firestore only supports a range
  // filter on one field per query without more infrastructure, and this
  // page needs simultaneous rent- and size-range filtering.
  const filtered = (properties ?? []).filter((property) => {
    if (city && !property.city.toLowerCase().includes(city.toLowerCase())) return false;
    if (minRooms && property.rooms < Number(minRooms)) return false;
    if (maxRooms && property.rooms > Number(maxRooms)) return false;
    if (minRent && property.rent < Number(minRent)) return false;
    if (maxRent && property.rent > Number(maxRent)) return false;
    if (minSize && property.sizeSqm < Number(minSize)) return false;
    if (maxSize && property.sizeSqm > Number(maxSize)) return false;
    return true;
  });

  return (
    <>
      <PublicHeader active="/browse" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 sm:py-16">
        <h1 className="mb-6 text-2xl font-semibold">{t("browse.title")}</h1>

        <div className="mb-8 space-y-4 rounded-2xl bg-surface p-4 shadow-warm-sm">
          <div>
            <label htmlFor="filterCity" className="mb-1 block text-sm font-medium text-ink">
              {t("property.city")}
            </label>
            <input
              id="filterCity"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="mb-1 block text-sm font-medium text-ink">{t("property.rooms")}</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder={t("browse.min")}
                  value={minRooms}
                  onChange={(e) => setMinRooms(e.target.value)}
                  className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder={t("browse.max")}
                  value={maxRooms}
                  onChange={(e) => setMaxRooms(e.target.value)}
                  className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <span className="mb-1 block text-sm font-medium text-ink">{t("property.size")}</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder={t("browse.min")}
                  value={minSize}
                  onChange={(e) => setMinSize(e.target.value)}
                  className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
                <input
                  type="number"
                  min="0"
                  placeholder={t("browse.max")}
                  value={maxSize}
                  onChange={(e) => setMaxSize(e.target.value)}
                  className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <span className="mb-1 block text-sm font-medium text-ink">{t("property.rent")}</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder={t("browse.min")}
                  value={minRent}
                  onChange={(e) => setMinRent(e.target.value)}
                  className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
                <input
                  type="number"
                  min="0"
                  placeholder={t("browse.max")}
                  value={maxRent}
                  onChange={(e) => setMaxRent(e.target.value)}
                  className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {properties === null && <p className="text-muted">{t("common.loading")}</p>}

        {properties !== null && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <EmptyStateIllustration className="h-24 w-auto" />
            <p className="text-muted">{t("browse.noResults")}</p>
          </div>
        )}

        <ul className="space-y-3">
          {filtered.map((property) => (
            <li key={property.id}>
              <Link
                href={`/apply/${property.id}`}
                className="block rounded-2xl bg-surface p-4 shadow-warm-sm transition hover:shadow-warm"
              >
                <p className="font-medium">{formatPropertyAddress(property)}</p>
                <p className="text-sm text-muted">{formatPropertySummary(property)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
