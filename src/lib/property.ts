import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Property } from "@/lib/types";

type PropertyInput = Pick<
  Property,
  | "street"
  | "zipCode"
  | "city"
  | "sizeSqm"
  | "rooms"
  | "rent"
  | "additionalCosts"
  | "availableFrom"
  | "description"
>;

export async function createProperty(
  ownerId: string,
  data: PropertyInput
): Promise<string> {
  const ref = await addDoc(collection(db, "properties"), {
    ownerId,
    ...data,
    description: data.description || "",
    createdAt: Date.now(),
  });
  return ref.id;
}

export async function getProperty(propertyId: string): Promise<Property | null> {
  const snapshot = await getDoc(doc(db, "properties", propertyId));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...(snapshot.data() as Omit<Property, "id">) };
}

export async function updateProperty(
  propertyId: string,
  data: PropertyInput
): Promise<void> {
  await updateDoc(doc(db, "properties", propertyId), {
    ...data,
    description: data.description || "",
  });
}

export async function deleteProperty(propertyId: string): Promise<void> {
  await deleteDoc(doc(db, "properties", propertyId));
}
