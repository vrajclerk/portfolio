# Implementation Plan (Gated Phases)

The agent must execute one phase at a time. Stop at each exit gate and report results. Do not automatically continue to the next phase.

## Phase 0: Repository and Compatibility Discovery

1. Inspect the repository, existing conventions, and uncommitted changes.
2. Read all specification files.
3. Verify current official compatibility requirements for Next.js, Payload, Node.js, and PostgreSQL.
4. Research the zero-cost deployment candidate using official provider docs only: Always Free eligibility, region capacity, payment-method requirement, resource limits, storage, bandwidth, public networking, and any conditions that could cause charges.
5. Verify DuckDNS and Let's Encrypt requirements.
6. Provide source URLs, exact risks, and a resource inventory.
7. Propose the static GitHub Pages fallback if a live Payload deployment cannot be achieved within the user's constraints.
8. Do not create cloud resources, install dependencies, build features, run production migrations, commit, push, or deploy.

**Exit gate:** user reviews and explicitly approves the architecture and deployment assumptions.

## Phase 1: Application Foundation

1. Create or adapt the Next.js App Router project.
2. Set up TypeScript, styling, linting, and formatting based on verified current compatibility.
3. Add error handling, metadata defaults, and reusable layout components.
4. Add `.env.example` with placeholders only.
5. Add basic CI checks.

**Exit gate:** clean install, lint, type-check, and production build pass.

## Phase 2: Payload and PostgreSQL

1. Integrate Payload into the same Next.js application.
2. Configure the supported PostgreSQL adapter.
3. Add Users, Posts, Projects, Categories, Tags, and Media collections plus SiteSettings, Profile, and HomepageSettings globals as specified in `DATA_MODEL.md`.
4. Implement role-based access and published-only public reads.
5. Add migrations and local seed fixtures.
6. Verify draft/publish behavior and admin authentication.

**Exit gate:** local CMS workflows and access-control tests pass.

## Phase 3: CMS-Driven Public Pages

Implement the homepage, project index/detail, blog index/detail, about page, and contact page. Read all editable content from Payload or the approved static export workflow. Do not hardcode content that should be editable in CMS.

**Exit gate:** pages render correctly with real schema-backed fixtures, including empty, draft, missing-slug, and error states.

## Phase 4: Editorial and Media Workflow

Implement draft editing, preview, publishing, slug handling, media upload, alt text, and cache invalidation. Ensure local media storage is persistent in the self-hosted deployment design.

**Exit gate:** preview is protected, unpublished content is not public, and media survives application restarts.

## Phase 5: SEO, RSS, Accessibility, and Performance

Implement metadata, canonical URLs, sitemap, robots, RSS, Open Graph, structured data where appropriate, semantic HTML, keyboard navigation, and responsive performance.

**Exit gate:** quality gates in `QUALITY_GATES.md` pass or documented exceptions are approved.

## Phase 6: Zero-Cost Deployment Preparation

1. Recheck free-tier eligibility and current terms before provisioning.
2. Present exact resources and any account/payment-method requirements.
3. Wait for explicit user approval before creating resources.
4. Deploy only to resources confirmed as Always Free.
5. Configure free subdomain, HTTPS, firewall, non-root service, secrets, persistent storage, backups, and restart behavior.
6. Verify application and CMS workflows after deployment.
7. Do not upgrade to paid resources if any limit is reached.

**Exit gate:** user confirms the deployment and accepts documented availability/backup limitations.

If no suitable free VM is available or payment-method requirements are unacceptable, stop this phase and propose the static GitHub Pages fallback. Do not switch providers silently.

## Phase 7: Content and Polish

1. Replace placeholders with user-approved, factual content.
2. Add real project case studies with contribution and technical decisions clearly distinguished.
3. Verify links, resume, social profiles, SEO previews, and mobile layouts.
4. Document how to update content, back up data, restore data, and redeploy without paid services.

**Exit gate:** all acceptance criteria are met and the user approves the final content.
