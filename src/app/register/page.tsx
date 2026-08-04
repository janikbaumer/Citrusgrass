"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserProfile, userProfileExists } from "@/lib/user";
import { isUserRole } from "@/lib/types";
import { isSafeRedirect } from "@/lib/safeRedirect";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleButton } from "@/components/GoogleButton";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const role = isUserRole(roleParam) ? roleParam : null;
  const next = searchParams.get("next");
  const nextParam = isSafeRedirect(next) ? next : null;
  const { user, profile, loading: authLoading } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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

  if (!role) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold">Which are you?</h1>
        <p className="text-muted">
          Pick a role first so we can set up your account correctly.
        </p>
        <Link
          href="/"
          className="inline-block rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:bg-accent-hover"
        >
          Choose homeowner or renter
        </Link>
      </div>
    );
  }

  const otherRole = role === "homeowner" ? "renter" : "homeowner";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(credential.user, role!, firstName, lastName);
      router.push(isSafeRedirect(next) ? next : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignUp() {
    setError(null);
    setSubmitting(true);
    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      const exists = await userProfileExists(credential.user.uid);
      if (!exists) {
        await createUserProfile(credential.user, role!);
      }
      router.push(isSafeRedirect(next) ? next : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 px-6 py-16">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">
          Create your {role} account
        </h1>
        <p className="text-sm text-muted">
          Not a {role}?{" "}
          <Link
            href={`/register?role=${otherRole}${nextParam ? `&next=${encodeURIComponent(nextParam)}` : ""}`}
            className="text-accent underline underline-offset-2"
          >
            Switch
          </Link>
        </p>
      </div>

      <GoogleButton
        onClick={handleGoogleSignUp}
        disabled={submitting}
        label="Sign up with Google"
      />

      <div className="flex items-center gap-3 text-xs uppercase text-muted">
        <div className="h-px flex-1 bg-line" />
        or
        <div className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-ink">
              First name
            </label>
            <input
              id="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-ink">
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
        </div>
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
            minLength={6}
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
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href={`/login${nextParam ? `?next=${encodeURIComponent(nextParam)}` : ""}`}
          className="font-medium text-accent underline underline-offset-2"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
