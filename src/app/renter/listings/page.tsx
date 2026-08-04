"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRenterApplications } from "@/hooks/useRenterApplications";
import { formatPropertyAddress, formatPropertySummary, RENTER_STATUS_LABELS } from "@/lib/types";
import { EmptyStateIllustration } from "@/components/illustrations/EmptyStateIllustration";

export default function RenterListingsPage() {
  const { user } = useAuth();
  const applications = useRenterApplications(user?.uid);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Your Applications</h1>

      {applications === null && <p className="text-muted">Loading...</p>}

      {applications?.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <EmptyStateIllustration className="h-24 w-auto" />
          <p className="text-muted">
            You haven&apos;t applied to anything yet. Applications you submit via a landlord&apos;s
            apply link will show up here.
          </p>
        </div>
      )}

      <ul className="space-y-3">
        {applications?.map((application) => (
          <li
            key={application.id}
            className="rounded-2xl bg-surface p-4 shadow-warm-sm"
          >
            <p className="font-medium">
              {application.property
                ? formatPropertyAddress(application.property)
                : "Listing no longer available"}
            </p>
            {application.property && (
              <p className="text-sm text-muted">
                {formatPropertySummary(application.property)}
              </p>
            )}
            <p className="mt-1 text-sm text-ink">
              Status: <span className="font-medium">{RENTER_STATUS_LABELS[application.status]}</span>
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
