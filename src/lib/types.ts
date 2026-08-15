import type { TranslationKey } from "./i18n/en";

export type UserRole = "homeowner" | "renter";

export type LandlordType = "private" | "company";

export type Language = "en" | "de";

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
  preferredLanguage?: Language;
  photoURL?: string;
  jobTitle?: string;
  hasDebtRegisterDocument?: boolean;
  hasIdDocument?: boolean;
  hasSalaryStatement?: boolean;
}

export function isUserRole(value: string | null): value is UserRole {
  return value === "homeowner" || value === "renter";
}

export function displayName(profile: Pick<UserProfile, "firstName" | "lastName" | "email">): string {
  const fullName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
  return fullName || profile.email;
}

// Includes the mandatory signup fields alongside the optional ones -
// deliberate, not an oversight: it gives every profile a "free" baseline
// right after signup instead of starting at 0%. To add a newly-introduced
// optional field to the completion calculation, add it to the matching
// list below - nothing else needs to change.
const RENTER_COMPLETION_FIELDS: (keyof UserProfile)[] = [
  "firstName",
  "lastName",
  "email",
  "photoURL",
  "jobTitle",
  "phone",
  "salaryRange",
  "about",
  "hasDebtRegisterDocument",
  "hasIdDocument",
  "hasSalaryStatement",
];

const HOMEOWNER_COMPLETION_FIELDS: (keyof UserProfile)[] = [
  "firstName",
  "lastName",
  "email",
  "photoURL",
  "phone",
  "landlordType",
];

export function getProfileCompletion(profile: UserProfile): number {
  const fields = profile.role === "renter" ? RENTER_COMPLETION_FIELDS : HOMEOWNER_COMPLETION_FIELDS;
  const filled = fields.filter((field) => !!profile[field]).length;
  return Math.round((filled / fields.length) * 100);
}

export type PropertyStatus = "active" | "rented";

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
  // Both optional: properties created before these fields existed won't
  // have them set, and simply won't match the public /browse query's
  // where clauses until their owner next saves the edit form (which
  // always writes an explicit value going forward - see property.ts).
  isPubliclyListed?: boolean;
  status?: PropertyStatus;
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

// A snapshot of the property's address/details at the time a renter applied,
// mirroring RenterSnapshot below - so an application still shows which
// listing it was for even after the homeowner deletes the property (only
// the properties/{id} doc is deleted, not the application - see
// src/lib/property.ts's deleteProperty). Optional because applications
// created before this field existed won't have it.
export type PropertySnapshot = Pick<
  Property,
  "street" | "zipCode" | "city" | "sizeSqm" | "rooms" | "rent" | "additionalCosts" | "availableFrom"
>;

export interface RenterSnapshot {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  salaryRange?: string;
  about?: string;
  jobTitle?: string;
  hasDebtRegisterDocument?: boolean;
  hasIdDocument?: boolean;
  hasSalaryStatement?: boolean;
}

export type PipelineStatus =
  | "viewing_requested"
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
  propertySnapshot?: PropertySnapshot;
  status: PipelineStatus;
  createdAt: number;
  updatedAt: number;
}

export interface ApplicationWithProperty extends Application {
  property: Property | null;
}

type Translate = (key: TranslationKey) => string;

// Labels as seen by the homeowner managing the pipeline.
export function getPipelineStatusLabels(t: Translate): Record<PipelineStatus, string> {
  return {
    viewing_requested: t("pipeline.viewingRequested"),
    application_received: t("pipeline.applicationReceived"),
    under_review: t("pipeline.underReview"),
    accepted: t("pipeline.accepted"),
    declined: t("pipeline.declined"),
  };
}

// Same statuses as seen by the renter who submitted the application -
// "received" reads backwards from their side of it.
export function getRenterStatusLabels(t: Translate): Record<PipelineStatus, string> {
  return {
    ...getPipelineStatusLabels(t),
    application_received: t("pipeline.applicationSent"),
  };
}

const PIPELINE_COLUMN_GROUPS: PipelineStatus[][] = [
  ["viewing_requested"],
  ["application_received"],
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
