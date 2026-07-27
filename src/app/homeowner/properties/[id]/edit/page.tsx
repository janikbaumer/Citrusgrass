"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getProperty, updateProperty } from "@/lib/property";
import type { Property } from "@/lib/types";

export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();
  const propertyId = params.id;
  const router = useRouter();
  const { user } = useAuth();

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
      });
      router.push(`/homeowner/properties/${propertyId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (property === undefined) {
    return <p className="px-6 py-16 text-center text-gray-500">Loading...</p>;
  }

  if (property === null) {
    return <p className="px-6 py-16 text-center text-gray-500">Property not found.</p>;
  }

  if (user && property.ownerId !== user.uid) {
    return <p className="px-6 py-16 text-center text-gray-500">This isn&apos;t your property.</p>;
  }

  return (
    <main className="mx-auto w-full max-w-md px-6 py-16">
      <h1 className="mb-6 text-center text-2xl font-semibold">Edit property</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="street" className="mb-1 block text-sm font-medium text-gray-700">
            Street (+ house number)
          </label>
          <input
            id="street"
            type="text"
            required
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Bahnhofstrasse 12"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="zipCode" className="mb-1 block text-sm font-medium text-gray-700">
              PLZ (zip code)
            </label>
            <input
              id="zipCode"
              type="text"
              required
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="city" className="mb-1 block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              id="city"
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="rooms" className="mb-1 block text-sm font-medium text-gray-700">
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="sizeSqm" className="mb-1 block text-sm font-medium text-gray-700">
              Size (m²)
            </label>
            <input
              id="sizeSqm"
              type="number"
              min="0"
              required
              value={sizeSqm}
              onChange={(e) => setSizeSqm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="rent" className="mb-1 block text-sm font-medium text-gray-700">
              Rent (CHF/month)
            </label>
            <input
              id="rent"
              type="number"
              min="0"
              required
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="additionalCosts"
              className="mb-1 block text-sm font-medium text-gray-700"
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="availableFrom" className="mb-1 block text-sm font-medium text-gray-700">
            Available from
          </label>
          <input
            id="availableFrom"
            type="date"
            required
            value={availableFrom}
            onChange={(e) => setAvailableFrom(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
            Description <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </main>
  );
}
