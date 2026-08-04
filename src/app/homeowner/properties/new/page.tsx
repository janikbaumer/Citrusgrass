"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createProperty } from "@/lib/property";

export default function NewPropertyPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [street, setStreet] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [sizeSqm, setSizeSqm] = useState("");
  const [rooms, setRooms] = useState("");
  const [rent, setRent] = useState("");
  const [additionalCosts, setAdditionalCosts] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSubmitting(true);
    try {
      const propertyId = await createProperty(user.uid, {
        street,
        zipCode,
        city,
        sizeSqm: Number(sizeSqm),
        rooms: Number(rooms),
        rent: Number(rent),
        additionalCosts: Number(additionalCosts),
        availableFrom,
        description,
      });
      router.push(`/homeowner/properties/${propertyId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-md px-6 py-16">
      <h1 className="mb-6 text-center text-2xl font-semibold">Add a property</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="street" className="mb-1 block text-sm font-medium text-ink">
            Street (+ house number)
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
              PLZ (zip code)
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
              City
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
              Rooms
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
              Size (m²)
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
              Rent (CHF/month)
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
              Additional costs (Nebenkosten, CHF/month)
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
            Available from
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
            Description <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Adding..." : "Add property"}
        </button>
      </form>
    </main>
  );
}
