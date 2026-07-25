"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createUserProfile } from "@/lib/user";
import { isSafeRedirect } from "@/lib/safeRedirect";
import type { UserRole } from "@/lib/types";

function Onboarding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <p className="px-6 py-16 text-center text-gray-500">Loading...</p>;
  }

  if (!user) {
    router.replace("/login");
    return null;
  }

  async function chooseRole(role: UserRole) {
    if (!user) return;
    setSubmitting(true);
    await createUserProfile(user, role);
    router.push(isSafeRedirect(next) ? next : "/dashboard");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <div className="max-w-xl space-y-2">
        <h1 className="text-2xl font-semibold">One more step</h1>
        <p className="text-gray-600">
          Are you here as a homeowner or a renter?
        </p>
      </div>
      <div className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
        <button
          onClick={() => chooseRole("homeowner")}
          disabled={submitting}
          className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:border-gray-900 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="text-4xl" aria-hidden>
            🏠
          </span>
          <span className="text-lg font-medium">I&apos;m a Homeowner</span>
        </button>
        <button
          onClick={() => chooseRole("renter")}
          disabled={submitting}
          className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:border-gray-900 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="text-4xl" aria-hidden>
            🔑
          </span>
          <span className="text-lg font-medium">I&apos;m a Renter</span>
        </button>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <Onboarding />
    </Suspense>
  );
}
