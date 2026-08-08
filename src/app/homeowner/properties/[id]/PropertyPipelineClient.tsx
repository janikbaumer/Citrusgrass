"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { deleteProperty, getProperty } from "@/lib/property";
import { updateApplicationStatus } from "@/lib/application";
import { PipelineBoard } from "@/components/PipelineBoard";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { formatPropertyAddress, formatPropertySummary } from "@/lib/types";
import type { Application, PipelineStatus, Property } from "@/lib/types";

export default function PropertyPipelineClient() {
  const params = useParams<{ id: string }>();
  const propertyId = params.id;
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [property, setProperty] = useState<Property | null | undefined>(undefined);
  const [applications, setApplications] = useState<Application[]>([]);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingAccept, setPendingAccept] = useState<{
    application: Application;
    status: PipelineStatus;
  } | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    getProperty(propertyId).then(setProperty);
  }, [propertyId]);

  useEffect(() => {
    if (!user) return;
    // Filters on both fields because the security rule checks ownerId, and
    // Firestore can only allow a list query if it can prove safety directly
    // from the query's where clauses matching the rule.
    const q = query(
      collection(db, "applications"),
      where("propertyId", "==", propertyId),
      where("ownerId", "==", user.uid),
      orderBy("createdAt", "asc")
    );
    return onSnapshot(q, (snapshot) => {
      setApplications(
        snapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...(docSnapshot.data() as Omit<Application, "id">),
        }))
      );
    });
  }, [propertyId, user]);

  async function copyApplyLink() {
    const link = `${window.location.origin}/apply/${propertyId}`;
    // navigator.clipboard only exists in a secure context (HTTPS, or
    // http://localhost) - fall back to the legacy copy command elsewhere
    // (e.g. testing over the dev server's plain-HTTP network address).
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(link);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = link;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function confirmDelete() {
    setConfirmingDelete(false);
    setError(null);
    setDeleting(true);
    try {
      await deleteProperty(propertyId);
      router.push("/homeowner/properties");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.somethingWrong"));
      setDeleting(false);
    }
  }

  if (property === undefined) {
    return <p className="px-6 py-10 sm:py-16 text-center text-muted">{t("common.loading")}</p>;
  }

  if (property === null) {
    return <p className="px-6 py-10 sm:py-16 text-center text-muted">{t("common.propertyNotFound")}</p>;
  }

  if (user && property.ownerId !== user.uid) {
    return <p className="px-6 py-10 sm:py-16 text-center text-muted">{t("common.notYourProperty")}</p>;
  }

  function handleStatusChange(application: Application, status: PipelineStatus) {
    if (status === "accepted") {
      setPendingAccept({ application, status });
      return;
    }
    if (!property) return;
    updateApplicationStatus(application.id, propertyId, property.ownerId, status);
  }

  async function confirmAccept() {
    if (!pendingAccept || !property) return;
    const { application, status } = pendingAccept;
    setPendingAccept(null);
    await updateApplicationStatus(application.id, propertyId, property.ownerId, status);
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-16">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{formatPropertyAddress(property)}</h1>
          <p className="text-sm text-muted">{formatPropertySummary(property)}</p>
          {property.description && (
            <p className="mt-2 max-w-xl text-sm text-ink">{property.description}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={copyApplyLink}
              className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition hover:bg-bg"
            >
              {copied ? t("homeownerPropertyDetail.linkCopied") : t("homeownerPropertyDetail.copyApplyLink")}
            </button>
            <Link
              href={`/homeowner/properties/${propertyId}/edit`}
              className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition hover:bg-bg"
            >
              {t("homeownerPropertyDetail.edit")}
            </Link>
            <button
              onClick={() => setConfirmingDelete(true)}
              disabled={deleting}
              className="rounded-full border border-danger/40 bg-danger-bg px-4 py-2 text-sm font-medium text-danger transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? t("homeownerPropertyDetail.deleting") : t("homeownerPropertyDetail.delete")}
            </button>
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      </div>

      <PipelineBoard applications={applications} onStatusChange={handleStatusChange} />

      <ConfirmDialog
        open={pendingAccept !== null}
        message={t("homeownerPropertyDetail.confirmAccept")}
        confirmLabel={t("homeownerPropertyDetail.confirmAcceptButton")}
        onConfirm={confirmAccept}
        onCancel={() => setPendingAccept(null)}
      />
      <ConfirmDialog
        open={confirmingDelete}
        message={t("homeownerPropertyDetail.confirmDelete")}
        confirmLabel={t("homeownerPropertyDetail.delete")}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmingDelete(false)}
        danger
      />
    </main>
  );
}
