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
import type { Application, PipelineStatus, RenterSnapshot, UserProfile } from "@/lib/types";

export function buildRenterSnapshot(profile: UserProfile): RenterSnapshot {
  const snapshot: RenterSnapshot = {
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
  };
  if (profile.phone) snapshot.phone = profile.phone;
  if (profile.salaryRange) snapshot.salaryRange = profile.salaryRange;
  if (profile.about) snapshot.about = profile.about;
  return snapshot;
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

export async function createApplication(
  propertyId: string,
  ownerId: string,
  renterId: string,
  renter: RenterSnapshot
): Promise<string> {
  const now = Date.now();
  const ref = await addDoc(collection(db, "applications"), {
    propertyId,
    ownerId,
    renterId,
    renter,
    status: "application_received" satisfies PipelineStatus,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function updateApplicationStatus(
  applicationId: string,
  propertyId: string,
  status: PipelineStatus
): Promise<void> {
  await updateDoc(doc(db, "applications", applicationId), {
    status,
    updatedAt: Date.now(),
  });

  if (status !== "accepted") return;

  const q = query(collection(db, "applications"), where("propertyId", "==", propertyId));
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
