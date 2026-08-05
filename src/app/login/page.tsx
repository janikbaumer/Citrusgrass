"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { userProfileExists } from "@/lib/user";
import { isSafeRedirect } from "@/lib/safeRedirect";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleButton } from "@/components/GoogleButton";
import { PublicHeader } from "@/components/PublicHeader";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const nextParam = isSafeRedirect(next) ? next : null;
  const { user, profile, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    router.replace(profile ? (nextParam ?? `/${profile.role}/dashboard`) : "/onboarding");
  }, [authLoading, user, profile, nextParam, router]);

  if (authLoading || user) {
    return null;
  }

  async function routeAfterSignIn(uid: string) {
    const exists = await userProfileExists(uid);
    if (!exists) {
      router.push(isSafeRedirect(next) ? `/onboarding?next=${encodeURIComponent(next)}` : "/onboarding");
      return;
    }
    router.push(isSafeRedirect(next) ? next : "/dashboard");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      await routeAfterSignIn(credential.user.uid);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setSubmitting(true);
    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      await routeAfterSignIn(credential.user.uid);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PublicHeader />

      <div className="mx-auto max-w-md space-y-6 px-6 py-16">
        <h1 className="text-center text-2xl font-semibold">Log in</h1>

        <GoogleButton
          onClick={handleGoogleSignIn}
          disabled={submitting}
          label="Sign in with Google"
        />

        <div className="flex items-center gap-3 text-xs uppercase text-muted">
          <div className="h-px flex-1 bg-line" />
          or
          <div className="h-px flex-1 bg-line" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/" className="font-medium text-accent underline underline-offset-2">
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
