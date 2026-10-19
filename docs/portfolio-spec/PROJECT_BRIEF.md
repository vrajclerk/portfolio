# Project Brief: Developer Portfolio

## 1. Goal

Build a professional, responsive portfolio for a full-stack developer
with approximately 1.5 years of professional experience. The site should
demonstrate real engineering skills and support ongoing publication of
technical articles and project case studies through a CMS.

The portfolio should position the owner around backend engineering and
full-stack application delivery without exaggerating experience.

## 2. Primary audiences

-   Recruiters and hiring managers evaluating role fit.
-   Engineers evaluating technical depth and reasoning.
-   Potential collaborators or clients evaluating relevant work.

## 3. Product principles

-   Content quality over visual gimmicks.
-   Evidence over unsupported claims.
-   Fast, accessible, mobile-first UI.
-   CMS-driven editorial content.
-   Minimal operational overhead.
-   Clear distinction between professional, personal, open-source, and
    experimental projects.
-   No fabricated metrics or claims.
-   Avoid overengineering.

## 4. Initial sitemap

Required: - `/` homepage - `/projects` project index -
`/projects/[slug]` project case study - `/blog` article index -
`/blog/[slug]` article - `/about` about and experience - `/contact`
contact information/form - `/resume` HTML resume with PDF link if a real
PDF is supplied - `/sitemap.xml` - `/robots.txt` - `/rss.xml` or
`/feed.xml`

Optional, only after MVP: - `/uses` - `/now` - `/open-source` -
Full-text search - Newsletter - Interactive demos

## 5. Homepage requirements

-   Clear headline and concise positioning statement.
-   Primary CTA to projects, secondary CTA to blog or resume.
-   Two or three featured projects, selected through CMS settings or a
    stable code fallback.
-   Technology groups based on practical use, not a wall of logos.
-   Latest published articles.
-   Contact/social links.
-   Responsive navigation and footer.

Use neutral placeholder copy until the owner confirms final wording. Do
not invent achievements.

## 6. Project case study requirements

Each project can support: - Summary and project type. - Context/problem
and constraints. - Owner's role and individual contribution. -
Architecture overview and diagrams. - Key engineering decisions and
alternatives. - Implementation details. - Testing and reliability
considerations. - Verified outcomes. - Lessons learned and
limitations. - Technology tags. - Repository/demo links, when real and
approved. - Related articles. - SEO metadata.

Professional project content must not disclose proprietary code,
customer information, private URLs, credentials, or confidential
architecture.

## 7. Blog requirements

-   Published-only listing and detail routes.
-   Title, slug, excerpt, cover image, category, tags, rich content,
    author, publication date, updated date, SEO metadata.
-   Related projects and related articles.
-   Table of contents for long articles if heading structure can be
    reliably generated.
-   Reading-time estimate derived from content, not manually invented.
-   RSS feed containing published posts only.
-   Search/filtering can be deferred until the content volume warrants
    it.

## 8. Contact requirements

MVP should display approved public contact links. A contact form is
optional and must only be implemented if the owner provides a delivery
method. If implemented, include server-side validation, rate limiting or
anti-spam protection, safe error handling, and no public exposure of
mail provider secrets.

## 9. CMS requirements

Use Payload CMS integrated into the Next.js app, backed by PostgreSQL. -
Authenticated admin. - Posts and Projects collections. - Categories,
Tags, Media, and Users. - Site settings and homepage/profile globals. -
Drafts and published states. - Preview flow protected from public
access. - Published-only public queries. - SEO fields. - Relationships
between posts and projects. - Media alt text and optional
caption/credit. - Slug uniqueness and a strategy for redirects after
published slug changes.

Use the official Payload docs for the exact installed version before
implementing version-sensitive configuration.

## 10. Explicit non-goals for MVP

-   Separate FastAPI backend.
-   Public visitor accounts or registration.
-   Microservices.
-   Redis, message queues, or a search cluster.
-   Custom-built CMS.
-   Complex page-builder functionality.
-   Multi-author editorial approval workflow.
-   Comments, reactions, or social features.
-   Kubernetes or complex AWS networking.
-   Automated content generation or fabricated portfolio claims.

## 11. Acceptance criteria

The MVP is acceptable when: - Required pages render and work on mobile
and desktop. - CMS content can be created, drafted, previewed,
published, edited, and unpublished. - Anonymous visitors cannot access
drafts or admin mutations. - Published posts and projects appear in
listings and sitemaps. - Missing slugs return a real 404. - SEO metadata
is unique and correct for content pages. - Core navigation is keyboard
accessible. - CI runs formatting/lint, type-check, tests, and production
build. - Environment setup and deployment steps are documented. - No
secrets or private project details are committed.


## Budget constraint

The target infrastructure budget is ₹0/month. Use free services only, no paid custom domain, and no automatic paid upgrades. Verify current provider terms and payment-method requirements. If a continuously hosted Payload CMS cannot be deployed within this constraint, stop and present the static GitHub Pages + Markdown/JSON fallback for approval; do not silently remove the CMS or introduce a paid service.
