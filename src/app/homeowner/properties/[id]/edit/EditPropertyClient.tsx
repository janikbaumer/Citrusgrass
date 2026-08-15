"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProperty, updateProperty } from "@/lib/property";
import type { Property, PropertyStatus } from "@/lib/types";

export default function EditPropertyClient() {
  const params = useParams<{ id: string }>();
  const propertyId = params.id;
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [property, setProperty] = useState<Property | null | undefined>(undefined);
  const [street, setStreet] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [sizeSqm, setSizeSqm] = useState("");
  const [rooms, setRooms] = useState("");
  const [rent, setRent] = useState("");
  const [additionalCosts, setAdditionalCosts] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [description, setDescription] = useState("");
  const [isPubliclyListed, setIsPubliclyListed] = useState(true);
  const [status, setStatus] = useState<PropertyStatus>("active");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getProperty(propertyId).then((result) => {
      setProperty(result);
      if (result) {
        setStreet(result.street || "");
        setZipCode(result.zipCode || "");
        setCity(result.city || "");
        setSizeSqm(String(result.sizeSqm));
        setRooms(String(result.rooms));
        setRent(String(result.rent));
        setAdditionalCosts(String(result.additionalCosts));
        setAvailableFrom(result.availableFrom || "");
        setDescription(result.description || "");
        setIsPubliclyListed(result.isPubliclyListed ?? true);
        setStatus(result.status ?? "active");
      }
    });
  }, [propertyId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await updateProperty(propertyId, {
        street,
        zipCode,
        city,
        sizeSqm: Number(sizeSqm),
        rooms: Number(rooms),
        rent: Number(rent),
        additionalCosts: Number(additionalCosts),
        availableFrom,
        description,
        isPubliclyListed,
        status,
      });
      router.push(`/homeowner/properties/${propertyId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.somethingWrong"));
    } finally {
      setSubmitting(false);
    }
  }

  if (property === undefined) {
    return <p className="px-6 py-10 sm:py-16 text-center text-muted">{t("common.loading")}</p>;
  }

  if (property === null) {
    return <p className="px-6 py-10 sm:py-16 text-center text-muted">{t("common.propertyNotFound")}</p>;
  }

  if (user && property.ownerId !== user.uid) {
    return <p className="px-6 py-10 sm:py-16 text-center text-muted">{t("common.notYourProperty")}</p>;
  }

  return (
    <main className="mx-auto w-full max-w-md px-6 py-10 sm:py-16">
      <h1 className="mb-6 text-center text-2xl font-semibold">{t("homeownerPropertyEdit.title")}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="street" className="mb-1 block text-sm font-medium text-ink">
            {t("property.street")}
          </label>
          <input
            id="street"
            type="text"
            required
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Bahnhofstrasse 12"
            className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="zipCode" className="mb-1 block text-sm font-medium text-ink">
              {t("property.zip")}
            </label>
            <input
              id="zipCode"
              type="text"
              required
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="city" className="mb-1 block text-sm font-medium text-ink">
              {t("property.city")}
            </label>
            <input
              id="city"
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="rooms" className="mb-1 block text-sm font-medium text-ink">
              {t("property.rooms")}
            </label>
            <input
              id="rooms"
              type="number"
              min="0"
              step="0.5"
              required
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="sizeSqm" className="mb-1 block text-sm font-medium text-ink">
              {t("property.size")}
            </label>
            <input
              id="sizeSqm"
              type="number"
              min="0"
              required
              value={sizeSqm}
              onChange={(e) => setSizeSqm(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="rent" className="mb-1 block text-sm font-medium text-ink">
              {t("property.rent")}
            </label>
            <input
              id="rent"
              type="number"
              min="0"
              required
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="additionalCosts"
              className="mb-1 block text-sm font-medium text-ink"
            >
              {t("property.additionalCosts")}
            </label>
            <input
              id="additionalCosts"
              type="number"
              min="0"
              required
              value={additionalCosts}
              onChange={(e) => setAdditionalCosts(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="availableFrom" className="mb-1 block text-sm font-medium text-ink">
            {t("property.availableFrom")}
          </label>
          <input
            id="availableFrom"
            type="date"
            required
            value={availableFrom}
            onChange={(e) => setAvailableFrom(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-ink">
            {t("property.description")} <span className="font-normal text-muted">{t("property.optional")}</span>
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <span className="mb-1 block text-sm font-medium text-ink">{t("property.status")}</span>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="radio"
                name="status"
                value="active"
                checked={status === "active"}
                onChange={() => setStatus("active")}
                className="accent-accent"
              />
              {t("property.statusActive")}
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="radio"
                name="status"
                value="rented"
                checked={status === "rented"}
                onChange={() => setStatus("rented")}
                className="accent-accent"
              />
              {t("property.statusRented")}
            </label>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-line bg-surface px-3 py-3">
          <input
            id="isPubliclyListed"
            type="checkbox"
            checked={isPubliclyListed}
            onChange={(e) => setIsPubliclyListed(e.target.checked)}
            className="mt-0.5 accent-accent"
          />
          <label htmlFor="isPubliclyListed" className="text-sm text-ink">
            <span className="block font-medium">{t("property.publiclyListed")}</span>
            <span className="block text-xs text-muted">{t("property.publiclyListedHelp")}</span>
          </label>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? t("common.saving") : t("homeownerPropertyEdit.submit")}
        </button>
      </form>
    </main>
  );
}
