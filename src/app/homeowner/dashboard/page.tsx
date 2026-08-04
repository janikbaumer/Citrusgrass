"use client";

import { useAuth } from "@/contexts/AuthContext";
import { displayName } from "@/lib/types";

export default function HomeownerDashboardPage() {
  const { profile } = useAuth();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">
        Welcome, {profile && displayName(profile)}
      </h1>
      <p className="text-muted">Your homeowner dashboard.</p>
      <p className="text-sm text-muted">More coming soon.</p>
    </main>
  );
}
