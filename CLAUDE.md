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

## Deployment (live)

Citrusgrass is deployed at **citrusgrass.com**, as a Next.js **static export** (`output: "export"`) — this app has no server-side logic anywhere (every page is `"use client"`, all data access goes through the Firebase client SDK), so no persistently running Node.js server is needed in production. Node.js is only needed to *build* the app (`next build`), never to serve it. `next.config.ts` applies `output: "export"` only during the production build phase (via a phase-conditional config function, checking for `PHASE_PRODUCTION_BUILD`) — `next dev` deliberately does *not* set it, so dynamic routes remain freely testable locally with arbitrary IDs instead of being restricted to `generateStaticParams`'s param.

**Dynamic routes under static export**: `/apply/[propertyId]`, `/homeowner/properties/[id]`, and `/homeowner/properties/[id]/edit` can't know real Firestore IDs at build time, but static export requires `generateStaticParams` for every dynamic segment. Each of these three is split into a thin server-component `page.tsx` (exports `generateStaticParams` returning a single `{ ... : "placeholder" }` param) that renders a client component (`*Client.tsx` in the same folder) holding the actual page logic, unchanged. This produces one static HTML shell per route (e.g. `out/apply/placeholder.html`). The web server then rewrites *any* real ID under those paths to serve that same shell's bytes; the client bundle reads the real ID from the browser URL via `useParams()` at hydration, independent of which param built the shell. This also transparently handles in-app `<Link>` navigation to unlisted IDs — Next's client router falls back to a full page reload (`doMpaNavigation`) when a client-side transition's RSC-payload fetch 404s, which then hits the same server rewrite.

**Hosting**: the user's Hetzner VPS (hostname `flatGPTserverIPv4`, root, public IPv4 `167.235.245.41`) — this repo's working copy lives directly on this VPS, so building and deploying both happen locally on the same machine (no SSH hop needed). The VPS already runs **Caddy natively via systemd** (`/etc/caddy/Caddyfile`) for another project (flat-gpt.com) — no Docker needed for Citrusgrass itself, since it's pure static files. Citrusgrass has its own **purely-additive site block** in that same Caddyfile (`root * /var/www/citrusgrass`, plus `path_regexp` rewrite rules for the three dynamic-route shells, plus a `handle_errors` block for a real 404 status on genuinely missing paths) — the pre-existing `flat-gpt.com` block and catch-all blocks are untouched. Caddy auto-provisions/renews the Let's Encrypt cert; no manual cert steps. Domain is registered at Infomaniak, with its DNS A record pointed at the VPS IP; domain registration and hosting are fully independent — nothing moved away from Infomaniak. Firebase Auth's authorized domains list (Authentication → Settings → Authorized domains) must include `citrusgrass.com`, or sign-in fails in production even though the site itself loads.

**Making changes**: edit source in this repo (`/root/Citrusgrass`), never directly in `/var/www/citrusgrass` — that only holds built static output, not source, and any manual edit there would be overwritten by the next deploy. After editing, either ask Claude to deploy, or run `./scripts/deploy.sh` — which is just `npm run build` followed by a local `rsync --delete out/ /var/www/citrusgrass/` (no SSH involved, since the repo and the doc root are on the same box). The Caddyfile itself is infrastructure, not app code, so it isn't part of this repo and is only touched again if routing/hosting changes (new domain, new dynamic route pattern needing its own rewrite rule).

**When server-side logic will become necessary**: only once a feature needs a secret API key or a webhook — e.g. credit check (CRIF/Intrum/tilbago), e-signature (Skribble/Swisscom Sign), or an LLM-based listing-text parser. Decision made: don't preemptively switch to a dynamic Next.js server for this. When one of those is actually built, add it as a small separate service (e.g. FastAPI, matching existing Python/Docker experience) running alongside the static site on the same Hetzner box, rather than converting this app to run Node.js continuously on the server.
