import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  Application,
  PipelineStatus,
  Property,
  PropertySnapshot,
  RenterSnapshot,
  UserProfile,
} from "@/lib/types";

export function buildRenterSnapshot(
  profile: Pick<
    UserProfile,
    | "firstName"
    | "lastName"
    | "email"
    | "phone"
    | "salaryRange"
    | "about"
    | "jobTitle"
    | "hasDebtRegisterDocument"
    | "hasIdDocument"
    | "hasSalaryStatement"
  >
): RenterSnapshot {
  const snapshot: RenterSnapshot = {
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
  };
  if (profile.phone) snapshot.phone = profile.phone;
  if (profile.salaryRange) snapshot.salaryRange = profile.salaryRange;
  if (profile.about) snapshot.about = profile.about;
  if (profile.jobTitle) snapshot.jobTitle = profile.jobTitle;
  if (profile.hasDebtRegisterDocument) snapshot.hasDebtRegisterDocument = true;
  if (profile.hasIdDocument) snapshot.hasIdDocument = true;
  if (profile.hasSalaryStatement) snapshot.hasSalaryStatement = true;
  return snapshot;
}

export function buildPropertySnapshot(property: Property): PropertySnapshot {
  return {
    street: property.street,
    zipCode: property.zipCode,
    city: property.city,
    sizeSqm: property.sizeSqm,
    rooms: property.rooms,
    rent: property.rent,
    additionalCosts: property.additionalCosts,
    availableFrom: property.availableFrom,
  };
}

export async function findExistingApplication(
  propertyId: string,
  renterId: string
): Promise<Application | null> {
  const q = query(
    collection(db, "applications"),
    where("propertyId", "==", propertyId),
    where("renterId", "==", renterId),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const found = snapshot.docs[0];
  return { id: found.id, ...(found.data() as Omit<Application, "id">) };
}

// Re-syncs a renter's snapshot on every application they've submitted,
// called whenever they save their own profile (see src/app/renter/profile/page.tsx).
// Not a live join - the applications security rule only lets a renter
// update this one field on their own applications - but keeps the
// homeowner-visible data as fresh as the renter's last profile save
// instead of permanently frozen at apply-time.
export async function resyncRenterSnapshot(renterId: string, renter: RenterSnapshot): Promise<void> {
  const q = query(collection(db, "applications"), where("renterId", "==", renterId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return;
  const batch = writeBatch(db);
  snapshot.docs.forEach((docSnapshot) => {
    batch.update(docSnapshot.ref, { renter });
  });
  await batch.commit();
}

export async function createApplication(
  propertyId: string,
  ownerId: string,
  renterId: string,
  renter: RenterSnapshot,
  propertySnapshot: PropertySnapshot
): Promise<string> {
  const now = Date.now();
  const ref = await addDoc(collection(db, "applications"), {
    propertyId,
    ownerId,
    renterId,
    renter,
    propertySnapshot,
    status: "application_received" satisfies PipelineStatus,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function updateApplicationStatus(
  applicationId: string,
  propertyId: string,
  ownerId: string,
  status: PipelineStatus
): Promise<void> {
  await updateDoc(doc(db, "applications", applicationId), {
    status,
    updatedAt: Date.now(),
  });

  if (status !== "accepted") return;

  // Filters on both fields because the security rule checks ownerId, and
  // Firestore can only allow a list query if it can prove safety directly
  // from the query's where clauses matching the rule (see CLAUDE.md).
  const q = query(
    collection(db, "applications"),
    where("propertyId", "==", propertyId),
    where("ownerId", "==", ownerId)
  );
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);
  let hasDeclines = false;
  snapshot.docs.forEach((docSnapshot) => {
    if (docSnapshot.id === applicationId) return;
    const current = docSnapshot.data().status as PipelineStatus;
    if (current === "accepted" || current === "declined") return;
    hasDeclines = true;
    batch.update(docSnapshot.ref, { status: "declined", updatedAt: Date.now() });
  });
  if (hasDeclines) {
    await batch.commit();
  }
}
