"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRenterApplications } from "@/hooks/useRenterApplications";
import { RenterPipelineBoard } from "@/components/RenterPipelineBoard";
import { displayName } from "@/lib/types";

export default function RenterDashboardPage() {
  const { user, profile } = useAuth();
  const applications = useRenterApplications(user?.uid);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold">
          Welcome, {profile && displayName(profile)}
        </h1>
        <p className="text-gray-500">Here&apos;s where your applications stand.</p>
      </div>

      {applications === null && <p className="text-center text-gray-500">Loading...</p>}

      {applications?.length === 0 && (
        <p className="text-center text-gray-500">
          You haven&apos;t applied to anything yet. Applications you submit via a landlord&apos;s
          apply link will show up here.
        </p>
      )}

      {applications && applications.length > 0 && (
        <RenterPipelineBoard applications={applications} />
      )}
    </main>
  );
}
