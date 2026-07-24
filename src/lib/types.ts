export type UserRole = "homeowner" | "renter";

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  createdAt: number;
}

export function isUserRole(value: string | null): value is UserRole {
  return value === "homeowner" || value === "renter";
}
