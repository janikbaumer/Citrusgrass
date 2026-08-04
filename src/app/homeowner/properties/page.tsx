"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { formatPropertyAddress, formatPropertySummary } from "@/lib/types";
import type { Property } from "@/lib/types";

export default function PropertiesPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[] | null>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "properties"),
      where("ownerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snapshot) => {
      setProperties(
        snapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...(docSnapshot.data() as Omit<Property, "id">),
        }))
      );
    });
  }, [user]);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Properties</h1>
        <Link
          href="/homeowner/properties/new"
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition hover:bg-accent-hover"
        >
          Add property
        </Link>
      </div>

      {properties === null && <p className="text-muted">Loading...</p>}

      {properties?.length === 0 && (
        <p className="text-muted">
          You haven&apos;t added a property yet.{" "}
          <Link href="/homeowner/properties/new" className="text-accent underline underline-offset-2">
            Add your first one
          </Link>
          .
        </p>
      )}

      <ul className="space-y-3">
        {properties?.map((property) => (
          <li key={property.id}>
            <Link
              href={`/homeowner/properties/${property.id}`}
              className="block rounded-2xl bg-surface p-4 shadow-warm-sm transition hover:shadow-warm"
            >
              <p className="font-medium">{formatPropertyAddress(property)}</p>
              <p className="text-sm text-muted">{formatPropertySummary(property)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
