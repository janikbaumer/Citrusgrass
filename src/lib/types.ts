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

export interface Property {
  id: string;
  ownerId: string;
  address: string;
  rooms: number;
  rent: number;
  availableFrom: string;
  createdAt: number;
}

export interface RenterSnapshot {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  salaryRange?: string;
  about?: string;
}

export type PipelineStatus =
  | "viewing_requested"
  | "invited_to_viewing"
  | "application_received"
  | "under_review"
  | "accepted"
  | "declined";

export interface Application {
  id: string;
  propertyId: string;
  ownerId: string;
  renterId: string;
  renter: RenterSnapshot;
  status: PipelineStatus;
  createdAt: number;
  updatedAt: number;
}

export const PIPELINE_STATUS_LABELS: Record<PipelineStatus, string> = {
  viewing_requested: "Viewing requested",
  invited_to_viewing: "Invited to viewing",
  application_received: "Application received",
  under_review: "Under review",
  accepted: "Accepted",
  declined: "Declined",
};

export const PIPELINE_COLUMNS: { title: string; statuses: PipelineStatus[] }[] = [
  { title: "Application received", statuses: ["application_received"] },
  { title: "Viewing requests", statuses: ["viewing_requested"] },
  { title: "Invited to viewing", statuses: ["invited_to_viewing"] },
  { title: "Under review", statuses: ["under_review"] },
  { title: "Accepted / Declined", statuses: ["accepted", "declined"] },
];
