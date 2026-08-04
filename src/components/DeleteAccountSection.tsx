"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteUser,
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
} from "firebase/auth";
import { useAuth } from "@/contexts/AuthContext";
import { deleteAccountData } from "@/lib/account";

export function DeleteAccountSection() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");
  const [needsReauth, setNeedsReauth] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDelete = confirmText === "DELETE";
  const isGoogleAccount = user?.providerData[0]?.providerId === "google.com";

  async function deleteUserWithReauth() {
    if (!user) return;
    try {
      await deleteUser(user);
    } catch (err) {
      if ((err as { code?: string })?.code !== "auth/requires-recent-login") throw err;

      setNeedsReauth(true);
      if (isGoogleAccount) {
        await reauthenticateWithPopup(user, new GoogleAuthProvider());
      } else {
        if (!password) {
          throw new Error("Enter your password to confirm.");
        }
        await reauthenticateWithCredential(
          user,
          EmailAuthProvider.credential(user.email!, password)
        );
      }
      await deleteUser(user);
    }
  }

  async function handleDelete() {
    if (!user || !profile || !canDelete) return;
    setError(null);
    setDeleting(true);
    try {
      await deleteAccountData(user.uid, profile.role);
      await deleteUserWithReauth();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mt-12 rounded-2xl border border-danger/40 bg-danger-bg p-6">
      <h2 className="text-lg font-semibold text-danger">Delete account</h2>
      <p className="mt-1 text-sm text-ink">
        {profile?.role === "homeowner"
          ? "This permanently deletes your account, every property you've listed, and every application submitted to them."
          : "This permanently deletes your account and every application you've submitted."}{" "}
        This can&apos;t be undone.
      </p>

      <div className="mt-4 max-w-sm space-y-3">
        <div>
          <label htmlFor="confirmDelete" className="mb-1 block text-sm font-medium text-ink">
            Type DELETE to confirm
          </label>
          <input
            id="confirmDelete"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-danger focus:outline-none"
          />
        </div>

        {needsReauth && !isGoogleAccount && (
          <div>
            <label
              htmlFor="reauthPassword"
              className="mb-1 block text-sm font-medium text-ink"
            >
              Confirm your password to continue
            </label>
            <input
              id="reauthPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm focus:border-danger focus:outline-none"
            />
          </div>
        )}

        {needsReauth && isGoogleAccount && (
          <p className="text-sm text-muted">
            Click delete again to confirm your identity with Google.
          </p>
        )}

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          onClick={handleDelete}
          disabled={!canDelete || deleting}
          className="rounded-full bg-danger px-4 py-2.5 text-sm font-medium text-accent-ink transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting ? "Deleting..." : "Delete my account permanently"}
        </button>
      </div>
    </div>
  );
}
