import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import type { UserProfile, UserRole } from "@/lib/types";

export async function userProfileExists(uid: string): Promise<boolean> {
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.exists();
}

export async function createUserProfile(
  user: User,
  role: UserRole,
  firstName?: string,
  lastName?: string
): Promise<void> {
  const [derivedFirst, ...derivedRest] = (user.displayName || "")
    .trim()
    .split(" ")
    .filter(Boolean);

  const profile: UserProfile = {
    firstName: firstName || derivedFirst || "",
    lastName: lastName || derivedRest.join(" "),
    email: user.email || "",
    role,
    createdAt: Date.now(),
  };
  await setDoc(doc(db, "users", user.uid), profile);
}

export async function updateUserProfile(
  uid: string,
  data: Partial<
    Pick<
      UserProfile,
      "firstName" | "lastName" | "phone" | "salaryRange" | "about" | "landlordType"
    >
  >
): Promise<void> {
  await updateDoc(doc(db, "users", uid), data);
}
