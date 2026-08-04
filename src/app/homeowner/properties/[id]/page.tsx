"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { deleteProperty, getProperty } from "@/lib/property";
import { updateApplicationStatus } from "@/lib/application";
import { PipelineBoard } from "@/components/PipelineBoard";
import { formatPropertyAddress, formatPropertySummary } from "@/lib/types";
import type { Application, PipelineStatus, Property } from "@/lib/types";

export default function PropertyPipelinePage() {
  const params = useParams<{ id: string }>();
  const propertyId = params.id;
  const router = useRouter();
  const { user } = useAuth();

  const [property, setProperty] = useState<Property | null | undefined>(undefined);
  const [applications, setApplications] = useState<Application[]>([]);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  async function handleStatusChange(application: Application, status: PipelineStatus) {
    if (
      status === "accepted" &&
      !confirm(
        "Accepting this applicant will automatically decline every other applicant for this property. Continue?"
      )
    ) {
      return;
    }
    await updateApplicationStatus(application.id, propertyId, status);
  }

  function copyApplyLink() {
    const link = `${window.location.origin}/apply/${propertyId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDelete() {
    if (
      !confirm(
        "Delete this property? Its apply link will stop working. Existing applications aren't deleted, but they'll no longer show a matching listing. This can't be undone."
      )
    ) {
      return;
    }
    setDeleting(true);
    try {
      await deleteProperty(propertyId);
      router.push("/homeowner/properties");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong.");
      setDeleting(false);
    }
  }

  if (property === undefined) {
    return <p className="px-6 py-16 text-center text-muted">Loading...</p>;
  }

  if (property === null) {
    return <p className="px-6 py-16 text-center text-muted">Property not found.</p>;
  }

  if (user && property.ownerId !== user.uid) {
    return <p className="px-6 py-16 text-center text-muted">This isn&apos;t your property.</p>;
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{formatPropertyAddress(property)}</h1>
          <p className="text-sm text-muted">{formatPropertySummary(property)}</p>
          {property.description && (
            <p className="mt-2 max-w-xl text-sm text-ink">{property.description}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={copyApplyLink}
            className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition hover:bg-bg"
          >
            {copied ? "Link copied!" : "Copy apply link"}
          </button>
          <Link
            href={`/homeowner/properties/${propertyId}/edit`}
            className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition hover:bg-bg"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-full border border-danger/40 bg-danger-bg px-4 py-2 text-sm font-medium text-danger transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <PipelineBoard applications={applications} onStatusChange={handleStatusChange} />
    </main>
  );
}
