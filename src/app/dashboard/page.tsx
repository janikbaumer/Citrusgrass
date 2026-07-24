"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!profile) {
      router.replace("/onboarding");
    }
  }, [loading, user, profile, router]);

  if (loading || !user || !profile) {
    return <p className="px-6 py-16 text-center text-gray-500">Loading...</p>;
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">
        Welcome, {profile.name || profile.email}
      </h1>
      <p className="text-gray-600">
        You&apos;re signed in as a{" "}
        <span className="font-medium">{profile.role}</span>.
      </p>
      <p className="text-sm text-gray-400">More features coming soon.</p>
      <button
        onClick={() => signOut()}
        className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        Sign out
      </button>
    </main>
  );
}
