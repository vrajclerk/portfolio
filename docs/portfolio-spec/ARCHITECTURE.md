# Architecture and Technology Decisions

## 1. Fixed baseline

- Application: Next.js App Router + React + TypeScript.
- CMS: Payload CMS in the same Next.js application.
- Database: PostgreSQL using Payload's supported adapter.
- Styling: Tailwind CSS or existing repository styling conventions.
- Hosting target: one Oracle Cloud Always Free VM, if currently available and eligible, running the application and PostgreSQL.
- Media: local disk on the VM for the initial zero-cost version, with a documented backup/export procedure. Do not add paid object storage.
- Public URL: a free DuckDNS subdomain with HTTPS via Let's Encrypt. A custom domain is out of scope because domain registration normally costs money.
- CI: GitHub Actions free allowance, subject to current limits and repository eligibility.
- Tests: choose tools compatible with the existing repository; if greenfield, use lightweight unit/integration tests and Playwright for critical browser flows.
- No separate FastAPI service for MVP.

## 2. Zero-cost constraints

- Target infrastructure spend is ₹0/month.
- Never provision a paid resource, upgrade a plan, enable pay-as-you-go, or add a paid domain.
- Do not assume a free tier is guaranteed. Verify current official eligibility, limits, account verification requirements, and region capacity.
- Do not store a payment method or create an account if the user has explicitly prohibited that.
- If the selected free VM is unavailable, stop and report options. Do not quietly switch to a paid service.
- If the user requires no payment method at all, recommend static GitHub Pages hosting with Markdown/JSON content and local Payload editing/export. A fully hosted Payload admin requires a running server and cannot be guaranteed at ₹0 without a suitable free compute host or an existing machine.

## 3. Architecture boundaries

### Public frontend

- Reads published content only.
- Uses server-side data access or server-only Payload Local API where appropriate.
- Never exposes Payload secret keys, database credentials, or privileged tokens to the browser.
- Uses server rendering/static rendering/revalidation based on route needs.
- Avoids client components unless interaction requires them.

### CMS

- Authenticated Payload admin.
- Collection access rules are enforced on the server.
- Public access to Posts and Projects is read-only and published-only.
- Mutations require authenticated admin access.
- Preview access is explicitly protected.
- No public registration.

### Database

- PostgreSQL is the persistent content database on the same VM for the initial setup.
- Bind PostgreSQL to localhost/private interface only. Do not expose its port publicly.
- Schema changes are committed as migrations using the documented workflow for the chosen Payload version.
- Do not edit production schema manually.
- Do not run migrations against production from an agent without explicit approval.

### Media

- Store uploads on a persistent VM directory, not a temporary directory.
- Configure upload size and MIME restrictions and ensure the directory survives application restarts and deployments.
- Document how to export media and include it in backups.
- If the VM's free storage is insufficient, stop and ask before adding external storage.

## 4. Data flow

1. Editor authenticates to Payload admin.
2. Editor creates or updates content in draft state.
3. Preview route validates a protected preview token/session and reads draft content server-side.
4. Editor publishes content.
5. Public queries return only published records.
6. Publishing/unpublishing invalidates affected route caches and sitemap/RSS output.
7. Media is stored on persistent local disk and referenced by CMS records.

## 5. Rendering and caching

- Homepage and indexes may be statically rendered or cached.
- Article and project detail pages should use server-side data access with an explicit cache/revalidation strategy.
- Never allow draft data to enter a shared public cache.
- Publishing and unpublishing must invalidate affected content routes.
- Admin and preview routes must not be publicly cached.
- Use Next.js conventions appropriate to the selected version; verify APIs before implementation.

## 6. Error handling

- Missing published slug: return 404.
- Database/CMS failure: show a safe error state; do not expose stack traces.
- Preview authentication failure: deny access.
- Contact delivery failure: report a generic failure to the visitor and log a safe diagnostic server-side.
- Never log secrets, full contact message bodies unnecessarily, or private user data.

## 7. Dependency policy

Before choosing versions: 1. Check current official Payload and Next.js compatibility requirements. 2. Check supported Node.js runtime versions for the selected deployment. 3. Choose mutually compatible stable versions. 4. Pin dependency ranges and commit the package manager lockfile. 5. Record exact selected versions in `DECISIONS_AND_ASSUMPTIONS.md`.

Do not blindly copy version numbers from this brief or an old tutorial.
