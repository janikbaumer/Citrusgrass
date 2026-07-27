"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRenterApplications } from "@/hooks/useRenterApplications";
import { formatPropertyAddress, formatPropertySummary, RENTER_STATUS_LABELS } from "@/lib/types";

export default function RenterListingsPage() {
  const { user } = useAuth();
  const applications = useRenterApplications(user?.uid);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Your Applications</h1>

      {applications === null && <p className="text-gray-500">Loading...</p>}

      {applications?.length === 0 && (
        <p className="text-gray-500">
          You haven&apos;t applied to anything yet. Applications you submit via a landlord&apos;s
          apply link will show up here.
        </p>
      )}

      <ul className="space-y-3">
        {applications?.map((application) => (
          <li
            key={application.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <p className="font-medium">
              {application.property
                ? formatPropertyAddress(application.property)
                : "Listing no longer available"}
            </p>
            {application.property && (
              <p className="text-sm text-gray-500">
                {formatPropertySummary(application.property)}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-600">
              Status: <span className="font-medium">{RENTER_STATUS_LABELS[application.status]}</span>
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
