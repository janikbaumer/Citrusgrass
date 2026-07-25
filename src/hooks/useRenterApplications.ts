"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getProperty } from "@/lib/property";
import type { Application, ApplicationWithProperty } from "@/lib/types";

export function useRenterApplications(renterId: string | undefined) {
  const [applications, setApplications] = useState<ApplicationWithProperty[] | null>(null);

  useEffect(() => {
    if (!renterId) return;
    const q = query(
      collection(db, "applications"),
      where("renterId", "==", renterId),
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
  }, [renterId]);

  return applications;
}
