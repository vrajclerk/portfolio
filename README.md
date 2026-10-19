# Developer Portfolio

> **Phase 1 — Application Foundation**
>
> This is a work-in-progress. Pages contain placeholder copy only.
> Real content will be added in Phase 7 after CMS integration (Phase 2–4).

A personal developer portfolio built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Payload CMS** (Phase 2+).

## Technology stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.4.2 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS v4 | 4.x |
| CMS | Payload CMS | 3.x (Phase 2) |
| Database | Neon PostgreSQL | — (Phase 2) |
| Media | Vercel Blob | — (Phase 2) |
| Hosting | Vercel Hobby | — (Phase 6) |
| Package manager | pnpm | 9.15.0 |
| Node.js | 22.x | 22.13.1+ |

## Getting started

### Prerequisites

- Node.js ≥ 20.18.1 (v22.x recommended)
- pnpm 9.15.0 (`npm install -g pnpm@9.15.0`)

### Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd portfolio

# 2. Install dependencies (use pnpm — do NOT use npm or yarn)
pnpm install

# 3. Create your local environment file
cp .env.example .env.local

# 4. Edit .env.local and fill in real values
#    Phase 1 only requires NEXT_PUBLIC_SITE_URL.
#    DATABASE_URL and PAYLOAD_SECRET are needed in Phase 2.

# 5. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the placeholder homepage.

## Available scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start the Next.js development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Run ESLint with auto-fix |
| `pnpm typecheck` | Run TypeScript type-checking (`tsc --noEmit`) |

## Project structure

```
src/
├── app/
│   ├── layout.tsx               # Root layout (thin shell: <html>/<body> only)
│   ├── (frontend)/              # Public-facing route group
│   │   ├── layout.tsx           # Frontend layout (Tailwind CSS, fonts, metadata)
│   │   ├── page.tsx             # Homepage (Phase 1 placeholder)
│   │   └── not-found.tsx        # 404 page for frontend routes
│   └── (payload)/               # Phase 2: Payload admin route group
│       └── (placeholder)
├── components/                  # Reusable UI components (Phase 3+)
├── config/
│   └── site.ts                  # Static site configuration and nav links
├── lib/
│   └── env.ts                   # Server-only environment variable validation
├── styles/
│   ├── globals.css              # Full Tailwind CSS (imported in (frontend) layout only)
│   └── payload-admin.css        # Tailwind without preflight (Phase 2, Payload admin)
└── types/
    └── index.ts                 # Shared TypeScript types
```

### Route group architecture (Tailwind CSS / Payload conflict isolation)

The app uses two route groups to prevent Tailwind's CSS preflight from
conflicting with Payload CMS's admin UI styles:

- **`(frontend)/`** — public pages. Its layout imports `globals.css` which
  includes the full `@import "tailwindcss"` (with preflight reset).
- **`(payload)/`** — Payload admin UI (Phase 2). Its layout will use
  `payload-admin.css` which imports only `tailwindcss/theme.css` and
  `tailwindcss/utilities.css` (no preflight).

See `DECISIONS_AND_ASSUMPTIONS.md §D5` for the detailed rationale.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Phase 1+ | Canonical public URL (e.g. `https://yourname.vercel.app`) |
| `PAYLOAD_SECRET` | Phase 2+ | Random secret for Payload CMS session signing |
| `DATABASE_URL` | Phase 2+ | Neon PostgreSQL connection string |
| `BLOB_READ_WRITE_TOKEN` | Phase 2+ | Vercel Blob token for media uploads |
| `SMTP_FROM_ADDRESS` | Phase 4+ | Gmail address for contact form delivery |
| `SMTP_PASS` | Phase 4+ | Gmail App Password (not your Google account password) |

Copy `.env.example` to `.env.local` and fill in values. Real `.env` files are
excluded from Git.

## CI

GitHub Actions runs on every push and pull request to `main`:

1. Install dependencies from the lockfile (`pnpm install --frozen-lockfile`)
2. Lint (`pnpm lint`)
3. Type-check (`pnpm typecheck`)
4. Production build (`pnpm build`)

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
| 2 | Payload CMS and PostgreSQL | ⏳ Pending |
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
