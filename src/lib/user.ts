import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import type { User } from "firebase/auth";
import { db, storage } from "@/lib/firebase";
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
      | "firstName"
      | "lastName"
      | "phone"
      | "salaryRange"
      | "about"
      | "landlordType"
      | "preferredLanguage"
      | "photoURL"
    >
  >
): Promise<void> {
  await updateDoc(doc(db, "users", uid), data);
}

export async function uploadProfilePicture(uid: string, file: File): Promise<string> {
  const pictureRef = ref(storage, `profile-pictures/${uid}`);
  await uploadBytes(pictureRef, file, { contentType: file.type });
  return getDownloadURL(pictureRef);
}

export async function deleteProfilePicture(uid: string): Promise<void> {
  await deleteObject(ref(storage, `profile-pictures/${uid}`));
}
