export type UserRole = "homeowner" | "renter";

export type LandlordType = "private" | "company";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: number;
  phone?: string;
  salaryRange?: string;
  about?: string;
  landlordType?: LandlordType;
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
  street: string;
  zipCode: string;
  city: string;
  sizeSqm: number;
  rooms: number;
  rent: number;
  additionalCosts: number;
  availableFrom: string;
  description?: string;
  createdAt: number;
}

export function formatPropertyAddress(
  property: Pick<Property, "street" | "zipCode" | "city">
): string {
  return `${property.street}, ${property.zipCode} ${property.city}`;
}

export function formatPropertySummary(
  property: Pick<Property, "rooms" | "sizeSqm" | "rent" | "additionalCosts" | "availableFrom">
): string {
  return `${property.rooms} rooms · ${property.sizeSqm} m² · CHF ${property.rent} + ${property.additionalCosts} NK/month · available ${property.availableFrom}`;
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

export interface ApplicationWithProperty extends Application {
  property: Property | null;
}

// Labels as seen by the homeowner managing the pipeline.
export const PIPELINE_STATUS_LABELS: Record<PipelineStatus, string> = {
  viewing_requested: "Viewing requested",
  invited_to_viewing: "Invited to viewing",
  application_received: "Application received",
  under_review: "Under review",
  accepted: "Accepted",
  declined: "Declined",
};

// Same statuses as seen by the renter who submitted the application -
// "received" reads backwards from their side of it.
export const RENTER_STATUS_LABELS: Record<PipelineStatus, string> = {
  ...PIPELINE_STATUS_LABELS,
  application_received: "Application sent",
};

const PIPELINE_COLUMN_GROUPS: PipelineStatus[][] = [
  ["application_received"],
  ["viewing_requested"],
  ["invited_to_viewing"],
  ["under_review"],
  ["accepted", "declined"],
];

// Column titles are derived from the same label map used for each card's
// status badge, so a homeowner board and a renter board can never show
// mismatched wording for the same status again (e.g. a column titled
// "Application received" next to a card badge reading "Application sent").
export function getPipelineColumns(
  labels: Record<PipelineStatus, string>
): { title: string; statuses: PipelineStatus[] }[] {
  return PIPELINE_COLUMN_GROUPS.map((statuses) => ({
    statuses,
    title: statuses.map((status) => labels[status]).join(" / "),
  }));
}
