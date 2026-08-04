# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start the dev server (localhost:3000)
- `npm run build` — production build (also runs the TypeScript check)
- `npx tsc --noEmit` — typecheck only
- `npm run lint` — ESLint (flat config, `eslint-config-next`)
- No test framework is set up in this repo.

There is no CI — after any change, run `npx tsc --noEmit`, `npm run lint`, and `npm run build` locally before considering work done, and restart the dev server (`pkill -f "next dev"` then `npm run dev`) to sanity-check routes.

## Architecture

**Stack**: Next.js App Router (TypeScript), Tailwind v4 (CSS-first config, no `tailwind.config.*` file — see `src/app/globals.css`), Firebase (Auth + Firestore) as the entire backend. There is no custom server/API layer — every page is a `"use client"` component that talks to Firebase directly from the browser. `src/lib/firebase.ts` initializes the singleton `auth`/`db` clients from `NEXT_PUBLIC_FIREBASE_*` env vars (`.env.local`, gitignored; `.env.local.example` documents the required keys).

**Firestore collections** (types in `src/lib/types.ts`):
- `users/{uid}` — profile doc keyed by Firebase Auth uid, holds `role: "homeowner" | "renter"` plus shared profile fields.
- `properties/{id}` — a homeowner's listing (`ownerId`, address split into `street`/`zipCode`/`city`, `rooms`, `sizeSqm`, `rent`, `additionalCosts`, `availableFrom`, optional `description`).
- `applications/{id}` — a renter's application to one property (`propertyId`, `ownerId`, `renterId`, a **snapshot** of the renter's profile at time of applying — not a live reference — plus a `status` from the shared `PipelineStatus` pipeline).

Security rules live in `firestore.rules`, composite indexes in `firestore.indexes.json` — **neither is deployed automatically**; changes to either must be manually pasted into the Firebase console (Firestore → Rules / Indexes) and published.

**Auth flow**: `AuthContext` (`src/contexts/AuthContext.tsx`) listens to Firebase auth state and the user's Firestore profile doc, exposing `{ user, profile, loading, signOut }` app-wide via `useAuth()`. `loading` is derived (not manually toggled) by comparing `profileForUid` against the current user's uid, specifically to avoid the `react-hooks/set-state-in-effect` anti-pattern. Registration/login/onboarding all support a `?next=` query param (validated by `src/lib/safeRedirect.ts`) so a deep link (e.g. an apply link) survives an auth detour. Already-authenticated visitors are redirected away from `/`, `/login`, and `/register` straight to their dashboard rather than being shown those forms again.

**Role-based routing**: `/renter/*` and `/homeowner/*` are separate route groups, each with a `layout.tsx` that calls `useRequireRole(role)` (`src/hooks/useRequireRole.ts`) to redirect based on auth/profile state before rendering children, and renders the shared `RoleNav` component. `/dashboard` is a pure client-side redirector to `/renter/dashboard` or `/homeowner/dashboard` based on `profile.role` — it has no content of its own.

**The core product constraint** (from the original project briefing — see memory `project-vision-guardrail`): a renter must never be able to browse or search across multiple landlords' properties without first receiving a specific apply link from a listing. This is why `/apply/[propertyId]` is a standalone public page reachable only by direct link (not linked from anywhere browsable in the app), rather than the app having any kind of property search/listing index. Keep this in mind before adding any renter-facing "browse" or "search" feature.

**Pipeline status labels**: `PipelineStatus` has one shared set of values, but two label maps in `src/lib/types.ts` — `PIPELINE_STATUS_LABELS` (homeowner-facing, e.g. "Application received") and `RENTER_STATUS_LABELS` (renter-facing, e.g. "Application sent" for the same status). Kanban column titles are derived from whichever label map is passed to `getPipelineColumns(labels)`, rather than being hardcoded — this was a real bug once (a shared hardcoded column-title list caused the renter board to show a homeowner-worded header over a renter-worded card). When adding new pipeline UI, always go through `getPipelineColumns()` with the correct label map for that audience, never a separate hardcoded title list.

**Firestore list-query rules gotcha**: security rules can only allow a `list` (collection query) if the rule's condition can be proven directly from the query's own `where` clauses — Firestore won't evaluate the rule per-returned-document for list operations the way it does for `get`. Concretely, `src/app/homeowner/properties/[id]/page.tsx` queries applications by `where("propertyId", "==", id)` *and* `where("ownerId", "==", user.uid)` together, even though `ownerId` is redundant given the data model, because the security rule checks `ownerId` and Firestore can't otherwise statically verify the query is safe. Follow this pattern (filter on whatever field the rule actually checks) for any new list query.

**Data writes and `undefined`**: Firestore rejects `undefined` field values, and `updateDoc` leaves omitted keys untouched (it doesn't clear them). Optional fields are normalized to `""` before writing (see `src/lib/property.ts`'s `description` handling) rather than being conditionally omitted.

## Deployment (planned, not yet implemented)

This app has no server-side logic anywhere (every page is `"use client"`, all data access goes through the Firebase client SDK), so it's a valid candidate for Next.js **static export** (`output: "export"` in `next.config.ts`) rather than needing a persistently running Node.js server. Node.js is only needed to *build* the app (`next build`), never to serve it.

Planned hosting: the user's existing Hetzner VPS (already runs Docker there for other projects), served by nginx or Caddy, with the domain (registered at Infomaniak) pointed at it via a DNS A record — domain registration and hosting are fully independent; nothing needs to move away from Infomaniak. Dynamic routes (`/apply/[propertyId]`, `/homeowner/properties/[id]`) need a web-server rewrite rule under static export, since the specific IDs don't exist at build time — any request under those paths must still serve the app's HTML shell so the client-side code can read the ID from the URL. Before going live: add the real domain to Firebase Auth's authorized domains list (Authentication → Settings → Authorized domains — currently only `localhost`), or sign-in will fail in production.

**When server-side logic will become necessary**: only once a feature needs a secret API key or a webhook — e.g. credit check (CRIF/Intrum/tilbago), e-signature (Skribble/Swisscom Sign), or an LLM-based listing-text parser. Decision made: don't preemptively switch to a dynamic Next.js server for this. When one of those is actually built, add it as a small separate service (e.g. FastAPI, matching existing Python/Docker experience) running alongside the static site on the same Hetzner box, rather than converting this app to run Node.js continuously on the server.
