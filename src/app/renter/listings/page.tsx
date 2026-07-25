"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { getProperty } from "@/lib/property";
import { PIPELINE_STATUS_LABELS } from "@/lib/types";
import type { Application, Property } from "@/lib/types";

interface ApplicationWithProperty extends Application {
  property: Property | null;
}

export default function RenterListingsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithProperty[] | null>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "applications"),
      where("renterId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, async (snapshot) => {
      const withProperties = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const application = {
            id: docSnapshot.id,
            ...(docSnapshot.data() as Omit<Application, "id">),
          };
          const property = await getProperty(application.propertyId);
          return { ...application, property };
        })
      );
      setApplications(withProperties);
    });
  }, [user]);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Your Applications</h1>

      {applications === null && <p className="text-gray-500">Loading...</p>}

      {applications?.length === 0 && (
        <p className="text-gray-500">
          You haven&apos;t applied to anything yet. Applications you submit via a landlord&apos;s
          apply link will show up here.
        </p>
      )}

      <ul className="space-y-3">
        {applications?.map((application) => (
          <li
            key={application.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <p className="font-medium">
              {application.property?.address || "Listing no longer available"}
            </p>
            {application.property && (
              <p className="text-sm text-gray-500">
                {application.property.rooms} rooms &middot; CHF {application.property.rent}/month
              </p>
            )}
            <p className="mt-1 text-sm text-gray-600">
              Status: <span className="font-medium">{PIPELINE_STATUS_LABELS[application.status]}</span>
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
