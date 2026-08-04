"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile } from "@/lib/user";
import { DeleteAccountSection } from "@/components/DeleteAccountSection";
import type { LandlordType } from "@/lib/types";

export default function HomeownerProfilePage() {
  const { user, profile } = useAuth();

  // The homeowner layout only renders this page once `profile` is loaded,
  // so these initial values are always accurate on first render.
  const [firstName, setFirstName] = useState(profile?.firstName || "");
  const [lastName, setLastName] = useState(profile?.lastName || "");
  const [landlordType, setLandlordType] = useState<LandlordType>(
    profile?.landlordType || "private"
  );
  const [phone, setPhone] = useState(profile?.phone || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await updateUserProfile(user.uid, { firstName, lastName, landlordType, phone });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-lg px-6 py-16">
      <h1 className="mb-6 text-center text-2xl font-semibold">Homeowner Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700">
              First name
            </label>
            <input
              id="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-gray-700">
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <span className="mb-1 block text-sm font-medium text-gray-700">Landlord type</span>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="landlordType"
                value="private"
                checked={landlordType === "private"}
                onChange={() => setLandlordType("private")}
                className="text-gray-900 focus:ring-gray-900"
              />
              Private
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="landlordType"
                value="company"
                checked={landlordType === "company"}
                onChange={() => setLandlordType("company")}
                className="text-gray-900 focus:ring-gray-900"
              />
              Company
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            disabled
            value={profile?.email || ""}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && !error && <p className="text-sm text-green-600">Saved.</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>

      <DeleteAccountSection />
    </main>
  );
}
