# Vraj Clerk — Python & Backend Systems Software Engineer Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Payload CMS](https://img.shields.io/badge/Payload_CMS-3.91.0-white?style=flat&logo=payloadcms)](https://payloadcms.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=flat&logo=postgresql)](https://neon.tech/)
[![PageSpeed](https://img.shields.io/badge/PageSpeed-100%2F100-emerald?style=flat&logo=lighthouse)](https://pagespeed.web.dev/)

A high-performance, precision-crafted developer portfolio and case-study platform built for a **Python & Backend Systems Engineer**. Designed with modern spatial aesthetics, tactical developer tooling, headless CMS capabilities, and 100/100 Lighthouse performance engineering.

---

## Engineering Highlights & Features

### 🧊 Spatial 3D Holographic Scroll Reveal Engine
* **GPU-Compositor Offloading:** Runs on `perspective(1200px) rotateX(...)` and `translate3d` with **zero layout shift (CLS = 0)**.
* **One-Shot Telemetry Observer:** A custom client wrapper (`RevealOnScroll.tsx`) monitors viewport entry via `IntersectionObserver` and immediately disconnects once triggered, ensuring **0 background CPU cycles** while reading.
* **Equalized Card Grids:** Grid containers enforce strict 3D perspective boundaries (`[perspective:1400px]`) and full-height flex inheritance so sibling cards in every row align with laser-straight horizontal baselines.
* **LCP Immunity:** The Hero section paints immediately at 0ms without waiting for JavaScript hydration or scroll observers, protecting Largest Contentful Paint.

### 💻 Interactive Developer Terminal Drawer
* **Embedded CLI Console (`TerminalDrawer.tsx`):** Accessible site-wide from the bottom footer and floating triggers.
* **Built-In Commands:**
  * `whoami` — Architectural summary, focus areas, and current systems engineering profile.
  * `skills` — Core production competencies across backend, databases, and cloud.
  * `projects` — Quick listing of production systems and case studies.
  * `contact` — Direct channels and public encryption/email endpoints.
  * `clear` / `help` — Terminal buffer management and command documentation.
* **Command History & Keyboard Navigation:** Full arrow-key (`↑` / `↓`) history navigation and auto-scrolling terminal output.

### 🎯 Tactical Crosshair Reticle Cursor
* **Hardware-Accelerated Reticle (`CustomCursor.tsx`):** A custom SVG reticle cursor with subpixel tracking (`requestAnimationFrame`), dynamic hover scaling, and click feedback.
* **Smart Pointer Detection:** Automatically activates only on fine pointer devices (`@media (pointer: fine)`), leaving touchscreens on native behaviors.
* **Text Selection Integrity:** Seamlessly preserves native text I-beams over inputs, textareas, and prose copy.

### 🌗 Default Dark Mode & Zero-Flash Hydration
* **Matte Carbon & Hyper Blaze Orange Theme:** Signature palette tuned for systems telemetry (`--bg: #0E1013`, `--accent: #FF6B00`).
* **Instant Inline Script Injection:** Pre-paints theme classes before first browser render in `layout.tsx`, eliminating light-mode flashes.
* **`useSyncExternalStore` Synchronization:** Refactored `ThemeToggle.tsx` directly to React 19's external store pattern, eliminating cascading re-renders and hydration mismatch warnings.

### 📄 One-Click Curriculum Vitae Download
* **Dedicated PDF Action (`/resume`):** Integrated one-click resume download button directly serving the authenticated PDF asset (`/media/VRAJ_Python_Developer.pdf`) alongside the interactive web CV.

### 🗄️ Headless Payload CMS + PostgreSQL Core
* **Full Local API Layer (`src/lib/cms.ts`):** Resilient data access with in-memory TTL caching, tag-based invalidation, and fallback to verified schema fixtures.
* **Collections & Globals:**
  * `Projects` — Architectural case studies, technical constraints, design decisions, and telemetry metrics.
  * `Profile` — Capabilities, categorizations, and professional background.
  * `Posts` — In-depth technical articles with Lexical rich-text editing.
  * `SiteSettings` & `HomepageSettings` — Site-wide SEO, canonical URLs, and section toggles.

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | Next.js (App Router) | 16.4.2 | Server Components, Streaming SSR, and Static Route Generation |
| **Language** | TypeScript | 5.x | Strict type safety across CMS schemas and UI |
| **Styling** | Tailwind CSS v4 | 4.x | Design tokens, dynamic island dock, and theme variables |
| **CMS** | Payload CMS | 3.91.0 | Headless content management and local Node.js API |
| **Database** | Neon PostgreSQL / Drizzle | Serverless | Scalable relational storage for Payload CMS |
| **Rich Text** | Lexical | 3.91.0 | Extensible structured editor for technical case studies |
| **Media** | Vercel Blob / Local Disk | 3.91.0 | High-speed asset delivery |
| **Icons & Fonts** | Plus Jakarta Sans, Geist Mono, Fraunces | Google Fonts | Engineered typography hierarchy |

---

## Project Structure

```
portfolio/
├── docs/
│   └── design-previews/         # Standalone interactive HTML prototypes
│       ├── scroll-reveal-preview.html            # Scroll Reveal Animation Lab (HUD + live tuning)
│       ├── customization-enhancements-preview.html # Terminal drawer & reticle cursor previews
│       ├── developer-identity-concepts.html      # Visual identity exploration
│       └── about-location-preview.html           # Location & profile layout preview
├── public/
│   ├── media/                   # Static PDF resumes and avatars
│   └── favicon.ico              # Signature VC logo favicon
├── src/
│   ├── access/                  # Payload CMS RBAC & public read policies
│   ├── app/
│   │   ├── (frontend)/          # Public-facing Next.js App Router group
│   │   │   ├── about/           # About & engineering journey
│   │   │   ├── blog/            # Technical articles & deep dives
│   │   │   ├── contact/         # Contact endpoint & communication channels
│   │   │   ├── projects/        # Featured engineering case studies
│   │   │   ├── resume/          # Interactive CV & dedicated PDF download
│   │   │   ├── layout.tsx       # Root frontend layout (HUD dock, terminal, cursor)
│   │   │   └── page.tsx         # Homepage with 3D spatial docking sections
│   │   └── (payload)/           # Payload CMS admin interface (/admin)
│   ├── collections/             # Payload Collections (Projects, Posts, Categories, Media, Tags, Users)
│   ├── components/              # Modular UI components
│   │   ├── CustomCursor.tsx     # Precision crosshair reticle cursor
│   │   ├── RevealOnScroll.tsx   # Concept 2 Spatial 3D docking observer wrapper
│   │   ├── TerminalDrawer.tsx   # Developer CLI terminal drawer
│   │   ├── ProjectCard.tsx      # Equal-height case study card
│   │   ├── SkillCard.tsx        # Equal-height capability card
│   │   ├── PostCard.tsx         # Technical writing card
│   │   ├── ThemeToggle.tsx      # useSyncExternalStore theme switcher
│   │   └── HeroSection.tsx      # Zero-hydration instant LCP hero
│   ├── globals/                 # Payload CMS Globals (Profile, SiteSettings, HomepageSettings)
│   ├── lib/                     # CMS data access layer & fallback fixtures
│   ├── styles/
│   │   ├── globals.css          # Frontend Tailwind v4 theme, animations & 3D docking
│   │   └── payload-admin.css    # Isolated admin styles (no preflight conflict)
│   └── utilities/               # Structured data schemas & reading time utilities
├── payload.config.ts            # Payload CMS configuration
└── eslint.config.mjs            # Flat ESLint configuration with Next.js & TypeScript rules
```

---

## Getting Started

### Prerequisites
* **Node.js:** `≥ 20.18.1` (v22.x recommended)
* **Package Manager:** `pnpm 9.15.0+`
* **PostgreSQL Database:** Neon serverless PostgreSQL or local PostgreSQL

### Installation & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/vrajclerk/portfolio.git
cd portfolio

# 2. Install dependencies via pnpm
pnpm install

# 3. Configure local environment variables
cp .env.example .env.local

# 4. Fill in .env.local:
#    NEXT_PUBLIC_SITE_URL=http://localhost:3000
#    PAYLOAD_SECRET=your_secure_random_secret_string
#    DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# 5. Launch the local development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the live site, or [http://localhost:3000/admin](http://localhost:3000/admin) to manage content via the Payload Admin Panel.

---

## Available Scripts

| Script | Command | Purpose |
|---|---|---|
| **Development** | `pnpm dev` | Starts Next.js development server with Turbopack on port 3000 |
| **Lint** | `pnpm lint` | Runs ESLint 9 across all TypeScript & React files (0 errors, 0 warnings) |
| **Lint Fix** | `pnpm lint:fix` | Automatically fixes auto-fixable ESLint rules |
| **Typecheck** | `pnpm typecheck` | Validates TypeScript compilation (`tsc --noEmit`) |
| **Production Build** | `pnpm build` | Compiles optimized production bundle |
| **Production Start** | `pnpm start` | Starts production server |
| **CMS Types** | `pnpm generate:types` | Regenerates `src/payload-types.ts` from CMS schema |
| **CMS Import Map** | `pnpm generate:importmap` | Rebuilds Payload admin component import map |

---

## Standalone Design Laboratories

The repository includes interactive prototypes located in `docs/design-previews/` that allow real-time tuning and visual evaluation without rebuilding:
* **[scroll-reveal-preview.html](docs/design-previews/scroll-reveal-preview.html)**: Live interactive physics laboratory to test **Spatial 3D Docking**, **Laser Beam Sweeps**, **Byte Decryption**, and **Radar Pings** with sliders for duration, travel distance, and stagger delay.
* **[customization-enhancements-preview.html](docs/design-previews/customization-enhancements-preview.html)**: Interactive prototypes of the CLI Terminal Drawer and Crosshair Reticle modes.

---

## License & Attribution

Designed and engineered by **Vraj Clerk**. Private and personal portfolio repository. All rights reserved.
