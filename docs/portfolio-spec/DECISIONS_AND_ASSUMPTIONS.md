# Decisions and Assumptions Log

## Confirmed project constraints

- The site is a developer portfolio with projects, writing/blog content, profile/about information, and a CMS-managed publishing workflow.
- The stack should use Next.js, React, TypeScript, and Payload CMS unless compatibility research shows a material blocker.
- Target infrastructure spend is ₹0/month.
- No paid domain: use a free subdomain.
- No paid database, object storage, analytics, email, or monitoring subscriptions.
- The coding agent must not provision cloud infrastructure, deploy, commit, or push without explicit user authorization.

## Approved deployment (2026-10-18)

**Vercel Hobby + Neon PostgreSQL + Vercel Blob** — all card-free, verified 2026-10-18.

Oracle Cloud path is permanently closed: user declined to provide a payment card (D1).

| Service | Free tier | Card required? |
|---|---|---|
| Vercel Hobby | Personal/non-commercial; GitHub OAuth; throttles on overuse (no charges) | No |
| Neon PostgreSQL (Free) | Permanent free; ~0.5 GB storage; email/GitHub signup | No |
| Vercel Blob (Hobby) | 1 GB storage · 10 GB/month bandwidth; throttles on overuse | No |

**Key architectural implications vs. Oracle path:**

| Concern | Oracle VM | Vercel + Neon (chosen) |
|---|---|---|
| Media storage | Local disk on VM | Vercel Blob via `@payloadcms/storage-vercel-blob` + `clientUploads: true` |
| Database adapter | `@payloadcms/db-postgres` | `@payloadcms/db-vercel-postgres` (Drizzle + Neon HTTP driver) |
| Availability | Single VM; manual restart | Vercel-managed; no single-VM concern |
| Subdomain / HTTPS | DuckDNS + Caddy + Let's Encrypt | Auto-provisioned `projectname.vercel.app` with HTTPS |
| Background jobs | Native Node.js server | Must disable `autoRun`; offload to Vercel Cron (free: 2 jobs) |
| Upload size limit | Configurable | 4.5 MB per request body; larger uploads use client-side direct-to-Blob |
| Backups | Manual `pg_dump` | Neon 7-day restore history + documented `pg_dump` procedure |

**Vercel Hobby ToS:** Strictly personal/non-commercial. A personal portfolio with no revenue qualifies.

## Phase 0 verified facts (2026-10-18)

All checks listed here were actually performed. Sources are in the Phase 0 report.

### Runtime and dependency versions

| Package | Latest stable | Constraint verified |
|---|---|---|
| Node.js (system) | v22.13.1 | Satisfies Payload >= 20.18.1 and Next.js >= 18.18.0 |
| pnpm (system) | to be installed if absent; `npm install -g pnpm` | Payload-recommended package manager |
| `payload` | 3.91.0 | Latest stable on npm registry |
| `next` | 16.4.2 | Latest stable on npm registry |
| Payload + Next.js | Payload supports Next.js 16.2.6+ | 16.4.2 qualifies |
| Payload + Node.js | Payload requires >= 20.18.1 | v22.13.1 qualifies |
| Postgres adapter | `@payloadcms/db-vercel-postgres` | Official Payload adapter for Vercel/Neon |

Source: payloadcms.com/docs/getting-started/installation - payloadcms.com/docs/database/postgres - npm registry

### Repository state

- No git repository initialised.
- No application code exists. The repository contains only `docs/portfolio-spec/`.
- Greenfield project — no existing user changes to preserve.

## Phase 0 exit gate — confirmed decisions

| ID | Question | Answer | Status |
|---|---|---|---|
| D1 | Payment card for Oracle Cloud? | No — Oracle path closed | Resolved |
| D2 | Oracle home region? | N/A — Oracle closed | N/A |
| D3 | Single-VM limitations? | N/A — Vercel chosen; platform-managed availability | N/A |
| D4 | Package manager? | **pnpm** (Payload-recommended; no --legacy-peer-deps needed) | Resolved |
| D5 | Tailwind CSS styling? | Tailwind CSS v4, scoped to (frontend) route group | Resolved |
| D6 | Contact form mail delivery? | Yes, credentials to be supplied before Phase 4 | Resolved |

### D5 detail — Tailwind CSS v4 configuration

Tailwind's global `preflight` resets conflict with Payload's admin UI. Verified mitigation (from official Payload guidance at payloadcms.com/docs):

1. Create `src/styles/payload-admin.css` — imports only `tailwindcss/theme.css` and `tailwindcss/utilities.css` (no preflight). Register this in `payload.config.ts` via `admin.css`.
2. Create `src/styles/globals.css` — uses full `@import "tailwindcss"`. Import only in the `(frontend)` route group layout, not the root layout.
3. PostCSS config uses `@tailwindcss/postcss` plugin.

ASSUMPTION-6: `@tailwindcss/typography` (needed for blog rich text) is compatible with Tailwind v4. Must be verified when setting up rich text rendering in Phase 3.

## Unresolved decisions (blocking later phases)

| ID | Question | Blocks |
|---|---|---|
| D7 | Mail provider? | **Gmail SMTP with App Password** (requires 2FA on Google account; credentials supplied before Phase 4) | Resolved |
| D8 | Subdomain? | **`*.vercel.app`** — Vercel auto-provisions free HTTPS subdomain; DuckDNS not needed | Resolved |
| D9 | Personal content: name, headline, project descriptions, resume PDF, social links | Phase 7 content |

## Explicit non-assumptions

- Do not assume a custom domain is free.
- Do not assume any provider's free tier is permanent, available in every region, or immune to billing configuration errors.
- Do not claim a payment method is or is not required until verified from current official documentation.
- Do not fabricate experience, business impact, metrics, testimonials, or project outcomes.
- Do not add paid email delivery, paid analytics, paid object storage, or paid monitoring.
- Do not create cloud resources without explicit user authorization.

## Assumptions (explicitly labeled)

| ID | Assumption | Can be overridden by |
|---|---|---|
| ASSUMPTION-1 | Neon PostgreSQL (free tier) replaces self-hosted PostgreSQL (Oracle closed). | User specifying an alternative DB |
| ASSUMPTION-2 | pnpm is the package manager; no --legacy-peer-deps flag needed (confirmed D4). | N/A — confirmed |
| ASSUMPTION-3 | Tailwind CSS v4 scoped to (frontend) route group (confirmed D5). | N/A — confirmed |
| ASSUMPTION-4 | Oracle Cloud path is permanently closed for this project (confirmed D1). | User changing D1 |
| ASSUMPTION-5 | Vercel Hobby plan qualifies as personal/non-commercial (personal portfolio, no revenue). | If site earns revenue — must upgrade |
| ASSUMPTION-6 | @tailwindcss/typography v4 is compatible with Tailwind v4. Verify during Phase 3. | Phase 3 verification |
| ASSUMPTION-7 | Vercel Blob 1 GB / 10 GB bandwidth is sufficient for initial portfolio media. | If media exceeds limit — document upgrade path |
| ASSUMPTION-8 | The *.vercel.app subdomain is used (DuckDNS not needed on Vercel; confirmed D8). | N/A — confirmed |

## Decision log

| Date | Decision | Status |
|---|---|---|
| 2026-10-13 | Target Rs.0/month; Oracle Always Free candidate proposed. | Superseded |
| 2026-10-18 | Phase 0 completed. All versions verified. Oracle payment-card requirement confirmed. | Done |
| 2026-10-18 | D1: No card — Oracle closed. Deployment changed to Vercel Hobby + Neon + Vercel Blob (all card-free). | Approved |
| 2026-10-18 | D4: Package manager = **pnpm** (Payload-recommended; cleaner peer dep resolution). | Approved |
| 2026-10-18 | D5: Styling = Tailwind CSS v4, scoped to (frontend) route group. | Approved |
| 2026-10-18 | D6: Contact form with mail delivery; credentials TBD before Phase 4. | Pending credentials |
| 2026-10-18 | D7: Mail provider = **Gmail SMTP with App Password**. Credentials supplied before Phase 4. | Pending credentials |
| 2026-10-18 | Phase 0 exit gate fully closed. **Phase 1 approved to begin.** | Phase 1 approved |
| 2026-10-19 | Phase 1 exit gate verified (lint, typecheck, build pass). **Phase 2 approved to begin.** | Phase 1 complete |
| 2026-10-19 | D10: Payload CMS 3.91.0 integrated via `@payloadcms/next`, `@payloadcms/db-vercel-postgres`, `@payloadcms/richtext-lexical`, and `@payloadcms/storage-vercel-blob`. Strict access control, initial migration, and type generation verified. | Phase 2 complete |
