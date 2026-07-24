export type UserRole = "homeowner" | "renter";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: number;
  phone?: string;
  salaryRange?: string;
  about?: string;
}

export function isUserRole(value: string | null): value is UserRole {
  return value === "homeowner" || value === "renter";
}

export function displayName(profile: Pick<UserProfile, "firstName" | "lastName" | "email">): string {
  const fullName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
  return fullName || profile.email;
}
