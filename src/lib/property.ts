import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Property } from "@/lib/types";

export async function createProperty(
  ownerId: string,
  data: Pick<Property, "address" | "rooms" | "rent" | "availableFrom">
): Promise<string> {
  const ref = await addDoc(collection(db, "properties"), {
    ownerId,
    ...data,
    createdAt: Date.now(),
  });
  return ref.id;
}

export async function getProperty(propertyId: string): Promise<Property | null> {
  const snapshot = await getDoc(doc(db, "properties", propertyId));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...(snapshot.data() as Omit<Property, "id">) };
}
