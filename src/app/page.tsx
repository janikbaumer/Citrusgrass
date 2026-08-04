"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { HandoffIllustration } from "@/components/illustrations/HandoffIllustration";
import { HouseIcon } from "@/components/illustrations/HouseIcon";
import { KeyIcon } from "@/components/illustrations/KeyIcon";

export default function Home() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;
    router.replace(profile ? `/${profile.role}/dashboard` : "/onboarding");
  }, [loading, user, profile, router]);

  if (loading || user) {
    return null;
  }

  return (
    <>
      <header className="flex items-center justify-between px-6 py-5">
        <span className="text-lg font-semibold text-ink">Citrusgrass</span>
        <nav className="flex gap-5 text-sm font-medium text-muted">
          <Link href="/about" className="hover:text-ink">
            About us
          </Link>
          <Link href="/faq" className="hover:text-ink">
            FAQ
          </Link>
          <Link href="/contact" className="hover:text-ink">
            Contact
          </Link>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-16 text-center">
        <HandoffIllustration className="h-auto w-full max-w-md" />

        <div className="max-w-xl space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome to Citrusgrass
          </h1>
          <p className="text-muted">To get started, tell us who you are.</p>
        </div>

        <div className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
          <Link
            href="/register?role=homeowner"
            className="group flex flex-col items-center gap-2 rounded-2xl bg-surface p-8 shadow-warm-sm transition hover:shadow-warm"
          >
            <HouseIcon className="h-10 w-10" />
            <span className="text-lg font-medium">I&apos;m a Homeowner</span>
            <span className="text-sm text-muted">
              List and manage your property
            </span>
          </Link>

          <Link
            href="/register?role=renter"
            className="group flex flex-col items-center gap-2 rounded-2xl bg-surface p-8 shadow-warm-sm transition hover:shadow-warm"
          >
            <KeyIcon className="h-10 w-10" />
            <span className="text-lg font-medium">I&apos;m a Renter</span>
            <span className="text-sm text-muted">
              Find a place to call home
            </span>
          </Link>
        </div>

        <p className="text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent underline underline-offset-2">
            Log in
          </Link>
        </p>
      </main>
    </>
  );
}
