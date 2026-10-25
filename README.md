# Developer Portfolio

> **Phase 2 — Payload CMS and PostgreSQL Integration**
>
> This is a work-in-progress. CMS collections and globals are configured.
> Real portfolio content will be added in Phase 7 after frontend page integration (Phases 3–4).

A personal developer portfolio built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Payload CMS 3.91**.

## Technology stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.4.2 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS v4 | 4.x |
| CMS | Payload CMS | 3.91.0 |
| Database Adapter | `@payloadcms/db-vercel-postgres` | 3.91.0 (Neon PostgreSQL / Drizzle) |
| Rich Text | `@payloadcms/richtext-lexical` | 3.91.0 |
| Media Storage | `@payloadcms/storage-vercel-blob` | 3.91.0 (Vercel Blob in prod, local disk fallback in dev) |
| Hosting | Vercel Hobby | — (Phase 6) |
| Package manager | pnpm | 9.15.0 |
| Node.js | 22.x | 22.13.1+ |

## Getting started

### Prerequisites

- Node.js ≥ 20.18.1 (v22.x recommended)
- pnpm 9.15.0 (`npm install -g pnpm@9.15.0`)
- A PostgreSQL database (Neon free tier recommended, or local PostgreSQL)

### Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd portfolio

# 2. Install dependencies (use pnpm — do NOT use npm or yarn)
pnpm install

# 3. Create your local environment file
cp .env.example .env.local

# 4. Edit .env.local and fill in real values:
#    - NEXT_PUBLIC_SITE_URL=http://localhost:3000
#    - PAYLOAD_SECRET=your_long_random_secret_string
#    - DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
#    (Optional for local media uploads)
#    - BLOB_READ_WRITE_TOKEN=your_token

# 5. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the public homepage.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the Payload Admin Panel. On first launch with a fresh database, Payload will prompt you to create the initial administrator account.

## Available scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start the Next.js development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Run ESLint with auto-fix |
| `pnpm typecheck` | Run TypeScript type-checking (`tsc --noEmit`) |
| `pnpm test` | Run automated unit and access-control tests (`tsx --test`) |
| `pnpm payload` | Run Payload CMS CLI |
| `pnpm generate:types` | Regenerate TypeScript types for Collections & Globals (`src/payload-types.ts`) |
| `pnpm generate:importmap` | Regenerate Payload admin component import map (`src/app/(payload)/admin/importMap.js`) |

## Project structure

```
src/
├── access/                      # Access-control policies
│   ├── anyone.ts                # Public-read access policy
│   ├── authenticated.ts         # Admin-only access policy
│   └── authenticatedOrPublished.ts # Public published-only / Admin all access policy
├── app/
│   ├── (frontend)/              # Public-facing route group
│   │   ├── layout.tsx           # Frontend root layout (Tailwind CSS, fonts, metadata)
│   │   ├── page.tsx             # Homepage (Phase 1 placeholder)
│   │   └── not-found.tsx        # 404 page for frontend routes
│   └── (payload)/               # Payload CMS route group
│       ├── layout.tsx           # Payload admin root layout (imports importMap.js & payload-admin.css)
│       ├── admin/
│       │   ├── importMap.js     # Auto-generated Payload component import map
│       │   └── [[...segments]]/ # Catch-all dynamic admin panel views
│       │       ├── not-found.tsx
│       │       └── page.tsx
│       └── api/                 # Payload HTTP endpoints
│           ├── [...slug]/       # REST API handler
│           └── graphql/         # GraphQL API handler
├── collections/                 # Payload Collections
│   ├── Categories.ts            # Categories collection
│   ├── Media.ts                 # Upload collection with MIME/size limits & alt validation
│   ├── Posts.ts                 # Blog posts with drafts & Lexical rich text
│   ├── Projects.ts              # Portfolio projects with drafts, case studies & decisions
│   ├── Tags.ts                  # Tags collection
│   └── Users.ts                 # Admin user authentication & management
├── globals/                     # Payload Globals
│   ├── HomepageSettings.ts      # Homepage hero & featured item curation
│   ├── Profile.ts               # Headline, bio, experience, skills & social profiles
│   └── SiteSettings.ts          # Site-wide SEO, canonical URL & social links
├── lib/
│   └── env.ts                   # Server-only environment variable validation
├── migrations/                  # Database migrations
│   ├── 20261019_202934_initial.ts # Initial baseline migration
│   └── index.ts                 # Migration registry
├── styles/
│   ├── globals.css              # Full Tailwind CSS (imported in (frontend) layout only)
│   └── payload-admin.css        # Tailwind without preflight (imported in (payload) layout)
├── utilities/
│   └── slugify.ts               # URL-safe kebab-case slug generator
├── payload.config.ts            # Payload CMS root configuration
└── payload-types.ts             # Auto-generated TypeScript definitions

tests/
└── access.test.ts               # Access control and configuration test suite
```

### Route group architecture (Tailwind CSS / Payload conflict isolation)

The app uses two isolated route groups to prevent Tailwind's CSS preflight from
conflicting with Payload CMS's admin UI styles:

- **`(frontend)/`** — public pages. Its root layout imports `globals.css` which
  includes the full `@import "tailwindcss"` (with preflight reset).
- **`(payload)/`** — Payload admin UI. Its root layout wraps Payload's `RootLayout`
  and uses `payload-admin.css` which imports only `tailwindcss/theme.css` and
  `tailwindcss/utilities.css` (no preflight).

See `DECISIONS_AND_ASSUMPTIONS.md §D5` for the detailed rationale.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Phase 1+ | Canonical public URL (e.g. `https://yourname.vercel.app`) |
| `PAYLOAD_SECRET` | Phase 2+ | Random secret for Payload CMS session signing |
| `DATABASE_URL` | Phase 2+ | Neon PostgreSQL connection string (`?sslmode=require`) |
| `BLOB_READ_WRITE_TOKEN` | Phase 2+ | Vercel Blob token for media uploads (prod; optional in local dev) |
| `SMTP_FROM_ADDRESS` | Phase 4+ | Gmail address for contact form delivery |
| `SMTP_PASS` | Phase 4+ | Gmail App Password (not your Google account password) |

Copy `.env.example` to `.env.local` and fill in values. Real `.env` files are
excluded from Git.

## CI

GitHub Actions runs on every push and pull request to `main`:

1. Install dependencies from the lockfile (`pnpm install --frozen-lockfile`)
2. Lint (`pnpm lint`)
3. Type-check (`pnpm typecheck`)
4. Test (`pnpm test`)
5. Production build (`pnpm build`)

See `.github/workflows/ci.yml` for the full configuration.

## Deployment

Target deployment: **Vercel Hobby** (free, no credit card required).

Deployment steps are documented in `docs/portfolio-spec/DEPLOYMENT.md` and
will be executed in **Phase 6**. Do not deploy to production until Phase 6 is
approved.

## Implementation phases

| Phase | Description | Status |
|---|---|---|
| 0 | Repository and compatibility discovery | ✅ Complete |
| 1 | Application foundation | ✅ Complete |
| 2 | Payload CMS and PostgreSQL | ✅ Complete |
| 3 | CMS-driven public pages | ⏳ Pending |
| 4 | Editorial and media workflow | ⏳ Pending |
| 5 | SEO, RSS, accessibility, performance | ⏳ Pending |
| 6 | Zero-cost deployment preparation | ⏳ Pending |
| 7 | Content and polish | ⏳ Pending |

## Content notice

This repository contains **placeholder content only**. No biographical details,
project metrics, work history, testimonials, or personal information are
committed. Real content will be added with the owner's explicit approval in
Phase 7.

## License

Private — not for public distribution. See the owner for licensing terms.
