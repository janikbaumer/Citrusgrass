"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getProperty } from "@/lib/property";
import { buildRenterSnapshot, createApplication, findExistingApplication } from "@/lib/application";
import { RENTER_STATUS_LABELS } from "@/lib/types";
import type { Application, Property } from "@/lib/types";

export default function ApplyPage() {
  const params = useParams<{ propertyId: string }>();
  const propertyId = params.propertyId;
  const { user, profile, loading, signOut } = useAuth();

  const [property, setProperty] = useState<Property | null | undefined>(undefined);
  const [existingApplication, setExistingApplication] = useState<Application | null | undefined>(
    undefined
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProperty(propertyId).then(setProperty);
  }, [propertyId]);

  useEffect(() => {
    if (!user || !profile || profile.role !== "renter") return;
    findExistingApplication(propertyId, user.uid).then(setExistingApplication);
  }, [propertyId, user, profile]);

  async function handleApply() {
    if (!user || !property) return;
    setError(null);
    setSubmitting(true);
    try {
      const snapshot = buildRenterSnapshot(profile!);
      const id = await createApplication(propertyId, property.ownerId, user.uid, snapshot);
      setExistingApplication({
        id,
        propertyId,
        ownerId: property.ownerId,
        renterId: user.uid,
        renter: snapshot,
        status: "application_received",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (property === undefined || loading) {
    return <p className="px-6 py-16 text-center text-gray-500">Loading...</p>;
  }

  if (property === null) {
    return <p className="px-6 py-16 text-center text-gray-500">This listing wasn&apos;t found.</p>;
  }

  const next = `/apply/${propertyId}`;

  return (
    <main className="mx-auto w-full max-w-lg px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">{property.address}</h1>
      <p className="mt-1 text-gray-500">
        {property.rooms} rooms &middot; CHF {property.rent}/month &middot; available{" "}
        {property.availableFrom}
      </p>

      <div className="mt-8">
        {!user && (
          <div className="space-y-3">
            <p className="text-gray-600">Log in or create a renter account to apply.</p>
            <div className="flex justify-center gap-3">
              <Link
                href={`/login?next=${encodeURIComponent(next)}`}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Log in
              </Link>
              <Link
                href={`/register?role=renter&next=${encodeURIComponent(next)}`}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Sign up as a renter
              </Link>
            </div>
          </div>
        )}

        {user && !profile && (
          <div className="space-y-3">
            <p className="text-gray-600">Finish setting up your account to apply.</p>
            <Link
              href={`/onboarding?next=${encodeURIComponent(next)}`}
              className="inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Continue
            </Link>
          </div>
        )}

        {user && profile && profile.role !== "renter" && (
          <div className="space-y-3">
            <p className="text-gray-600">
              You&apos;re signed in as a homeowner. Log in with a renter account to apply.
            </p>
            <button
              onClick={() => signOut()}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Log out
            </button>
          </div>
        )}

        {user && profile && profile.role === "renter" && existingApplication === undefined && (
          <p className="text-gray-500">Checking your application status...</p>
        )}

        {user && profile && profile.role === "renter" && existingApplication === null && (
          <div className="space-y-3">
            <p className="text-gray-600">
              Apply using your existing renter profile ({profile.firstName} {profile.lastName}).
            </p>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              onClick={handleApply}
              disabled={submitting}
              className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Applying..." : "Apply now"}
            </button>
          </div>
        )}

        {user && profile && profile.role === "renter" && existingApplication && (
          <p className="text-gray-600">
            You already applied. Status:{" "}
            <span className="font-medium">
              {RENTER_STATUS_LABELS[existingApplication.status]}
            </span>
          </p>
        )}
      </div>
    </main>
  );
}
