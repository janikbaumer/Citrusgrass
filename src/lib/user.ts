import { doc, getDoc, setDoc } from "firebase/firestore";
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
  name?: string
): Promise<void> {
  const profile: UserProfile = {
    name: name || user.displayName || "",
    email: user.email || "",
    role,
    createdAt: Date.now(),
  };
  await setDoc(doc(db, "users", user.uid), profile);
}
