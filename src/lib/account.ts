import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
  type DocumentReference,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserRole } from "@/lib/types";

const BATCH_CHUNK_SIZE = 450;

async function deleteRefs(refs: DocumentReference[]): Promise<void> {
  for (let i = 0; i < refs.length; i += BATCH_CHUNK_SIZE) {
    const batch = writeBatch(db);
    for (const ref of refs.slice(i, i + BATCH_CHUNK_SIZE)) {
      batch.delete(ref);
    }
    await batch.commit();
  }
}

export async function deleteAccountData(uid: string, role: UserRole): Promise<void> {
  if (role === "homeowner") {
    const propertiesSnapshot = await getDocs(
      query(collection(db, "properties"), where("ownerId", "==", uid))
    );
    const propertyIds = propertiesSnapshot.docs.map((d) => d.id);

    const applicationRefs: DocumentReference[] = [];
    for (const propertyId of propertyIds) {
      const applicationsSnapshot = await getDocs(
        query(collection(db, "applications"), where("propertyId", "==", propertyId))
      );
      applicationRefs.push(...applicationsSnapshot.docs.map((d) => d.ref));
    }
    await deleteRefs(applicationRefs);
    await deleteRefs(propertiesSnapshot.docs.map((d) => d.ref));
  } else {
    const applicationsSnapshot = await getDocs(
      query(collection(db, "applications"), where("renterId", "==", uid))
    );
    await deleteRefs(applicationsSnapshot.docs.map((d) => d.ref));
  }

  await deleteDoc(doc(db, "users", uid));
}
