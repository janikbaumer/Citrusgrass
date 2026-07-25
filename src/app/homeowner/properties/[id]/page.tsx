"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { getProperty } from "@/lib/property";
import { updateApplicationStatus } from "@/lib/application";
import { PipelineBoard } from "@/components/PipelineBoard";
import type { Application, PipelineStatus, Property } from "@/lib/types";

export default function PropertyPipelinePage() {
  const params = useParams<{ id: string }>();
  const propertyId = params.id;
  const { user } = useAuth();

  const [property, setProperty] = useState<Property | null | undefined>(undefined);
  const [applications, setApplications] = useState<Application[]>([]);
  const [copied, setCopied] = useState(false);

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

  if (property === undefined) {
    return <p className="px-6 py-16 text-center text-gray-500">Loading...</p>;
  }

  if (property === null) {
    return <p className="px-6 py-16 text-center text-gray-500">Property not found.</p>;
  }

  if (user && property.ownerId !== user.uid) {
    return <p className="px-6 py-16 text-center text-gray-500">This isn&apos;t your property.</p>;
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{property.address}</h1>
          <p className="text-sm text-gray-500">
            {property.rooms} rooms &middot; CHF {property.rent}/month &middot; available{" "}
            {property.availableFrom}
          </p>
        </div>
        <button
          onClick={copyApplyLink}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          {copied ? "Link copied!" : "Copy apply link"}
        </button>
      </div>

      <PipelineBoard applications={applications} onStatusChange={handleStatusChange} />
    </main>
  );
}
