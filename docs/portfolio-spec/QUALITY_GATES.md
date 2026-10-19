# Quality Gates

## 1. Required checks for each phase

Run only scripts that actually exist in the repository. If a required
check is missing, report that and add it in the relevant phase rather
than claiming it passed.

-   Dependency install from lockfile.
-   Lint/format check.
-   Type check.
-   Unit and integration tests.
-   Production build.
-   Targeted end-to-end tests for critical flows.
-   Git diff review.

## 2. Functional acceptance

-   Homepage, project listing/detail, blog listing/detail, About,
    contact, and resume routes work.
-   Missing content routes return 404.
-   Links and buttons have real actions.
-   Empty states are intentional and useful.
-   Content renders correctly on mobile and desktop.
-   Published changes are visible after the defined cache
    invalidation/revalidation.
-   RSS and sitemap include only published content.

## 3. CMS and authorization

-   Anonymous users cannot create, update, or delete content.
-   Anonymous users cannot read drafts.
-   Preview access is authenticated and/or token-protected according to
    a verified design.
-   CMS admin pages are not publicly cached.
-   No privileged credentials reach browser code.
-   Slugs are unique and redirects are safe.
-   Uploads enforce type and size restrictions.
-   Rich text rendering does not allow unsafe arbitrary HTML without
    sanitization.

## 4. Security

-   No secrets committed.
-   `.env*` files are ignored except safe examples.
-   Server-only variables do not use public prefixes.
-   Errors do not leak stack traces or secret values.
-   Contact form, if implemented, has validation and
    anti-spam/rate-limiting controls.
-   Dependencies are checked for known vulnerabilities.
-   Database backups and restore procedure are documented.
-   Production migrations require explicit approval.

## 5. Accessibility

Target WCAG 2.2 AA: - Keyboard-accessible navigation and interactive
elements. - Visible focus indicators. - Semantic heading order. - Form
labels and accessible errors. - Useful alt text; decorative images use
empty alt. - Adequate color contrast. - Reduced-motion support. - No
horizontal overflow at common mobile widths. - Manual keyboard testing
in addition to automated checks.

## 6. SEO

-   Unique title and description for each public content page.
-   Canonical URL uses configured public origin.
-   Sitemap contains only indexable published pages.
-   Robots rules do not accidentally block public content.
-   404 routes return a true not-found response.
-   Redirects avoid loops.
-   Structured data matches visible content.
-   Open Graph images and metadata are valid.
-   RSS feed contains published articles only.

## 7. Performance

Targets: - Core Web Vitals good thresholds at the 75th percentile: LCP
\<= 2.5 s, INP \<= 200 ms, CLS \<= 0.1. - Avoid unnecessary client
components and heavy libraries. - Optimize images and reserve image
dimensions. - Cache public content safely. - Never cache authenticated
drafts publicly. - Measure rather than claim performance without data.

## 8. Content integrity

-   Clearly distinguish professional, personal, open-source, and
    experimental projects.
-   Do not invent metrics, testimonials, certifications, client names,
    or accomplishments.
-   Obtain approval before publishing employer/client information.
-   Verify all external links.
-   Ensure resume and site work history agree.


## Zero-cost deployment gate

- Every proposed service and resource is listed with an official source confirming current free-tier eligibility.
- No paid domain, paid database, paid object storage, paid email, paid analytics, or paid monitoring is required.
- No paid usage, automatic upgrade, or pay-as-you-go setting is enabled.
- Any payment-method requirement is disclosed before account setup or provisioning.
- A backup/export and restore procedure exists without assuming paid backup storage.
- The agent stops rather than provisioning paid replacements if a free quota or resource is unavailable.
