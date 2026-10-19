# Payload CMS Data Model

This document defines the required logical schema. Exact Payload field
syntax must be checked against the installed Payload version and
official documentation.

## 1. Collections

### Users

Purpose: CMS administrator authentication.

Fields: - Payload authentication fields. - `name` (text, optional
display name). - `role` (select: `admin`; add roles only if needed).

Rules: - No public registration. - Restrict create/update/delete
operations to authorized admins. - If there is one owner, avoid building
a complex RBAC system. Still ensure anonymous users cannot mutate
content.

### Posts

Fields: - `title`: required text. - `slug`: required, unique, indexed
text. - `excerpt`: required textarea, recommended max length 240. -
`content`: required rich-text field with a controlled set of blocks. -
`coverImage`: optional relationship/upload to Media. - `author`:
relationship to Users, or a static author global if the installed
Payload auth model makes user relationships inappropriate. - `category`:
relationship to Categories. - `tags`: many-to-many relationship to
Tags. - `relatedProjects`: many-to-many relationship to Projects. -
`publishedAt`: date. - `updatedAt`: use system update timestamp; do not
overwrite original publication date on every edit. - `seo.title`:
optional override. - `seo.description`: optional override. -
`seo.image`: optional image override. - Draft/version status: use
Payload's supported draft/version feature. - Optional computed reading
time: derive from text content, do not accept arbitrary claims.

### Projects

Fields: - `title`: required text. - `slug`: required, unique, indexed
text. - `summary`: required short description. - `projectType`: select:
`professional`, `personal`, `open-source`, `experiment`. - `role`:
text. - `contribution`: rich text or structured blocks. - `problem`:
rich text. - `constraints`: rich text, optional. - `architecture`: rich
text and/or approved diagram media. - `decisions`: repeatable structured
items with `title`, `context`, `alternatives`, `decision`,
`tradeoffs`. - `implementation`: rich text. - `testing`: rich text. -
`outcomes`: rich text. Do not require numeric metrics. -
`lessonsLearned`: rich text. - `technologies`: tags or simple array
initially. - `repositoryUrl`: optional URL. - `liveUrl`: optional URL. -
`coverImage`: optional Media relationship. - `gallery`: many-to-many
Media relationship. - `relatedPosts`: many-to-many Posts relationship. -
`featured`: boolean. - `displayOrder`: number, optional. - `seo.title`,
`seo.description`, `seo.image`. - Draft/version status: use Payload's
supported feature.

### Categories

Fields: - `name`: required text. - `slug`: required unique text. -
`description`: optional textarea.

### Tags

Fields: - `name`: required text. - `slug`: required unique text. -
`description`: optional textarea.

### Media

Fields: - Uploaded file fields supported by Payload. - `alt`: text,
required for meaningful images. - `caption`: optional text. - `credit`:
optional text. - `decorative`: boolean, default false; when true, alt
can be empty if the rendering component emits empty alt text. - Validate
MIME types and size limits. - Store production media in configured
object storage.

## 2. Globals

### SiteSettings

-   `siteName`
-   `siteUrl`
-   `defaultDescription`
-   `defaultSocialImage`
-   `socialLinks` (typed list of label + validated URL)
-   `publicEmail` (optional; only if owner confirms it is public)

### Profile

-   `headline`
-   `shortBio`
-   `resumeFile` (optional media relationship)
-   `experience` (repeatable: organization, role, start date, end date
    or current flag, summary; owner must verify all content)
-   `skills` grouped by category, each item labeled with practical
    proficiency/context rather than invented rankings.

### HomepageSettings

-   `featuredProjects` (relationship to Projects, with controlled
    maximum count)
-   `featuredPosts` (relationship to Posts, with controlled maximum
    count)
-   Optional section visibility toggles.

## 3. Relationship summary

-   Posts -\> Users (author).
-   Posts -\> Categories (one category).
-   Posts \<-\> Tags (many-to-many).
-   Posts \<-\> Projects (many-to-many).
-   Projects \<-\> Tags (many-to-many if Tags are used for
    technologies).
-   Projects \<-\> Posts (many-to-many).
-   Posts/Projects -\> Media (cover images and diagrams).

Avoid duplicate bidirectional fields unless they are useful to the
editor. If reciprocal relationships are stored, ensure both sides remain
consistent.

## 4. Slugs and redirects

-   Generate a slug from title as a convenience, but let the editor
    review it.
-   Enforce uniqueness server-side.
-   Do not assume client-side uniqueness checks are sufficient.
-   When a published slug changes, store a redirect record or use a
    suitable maintained redirect solution.
-   Avoid redirect loops and validate redirect destinations.
-   Unpublishing should remove the page from public listings, sitemap,
    and RSS.
-   Preserve original `publishedAt` when editing an already published
    post.

## 5. SEO

For Posts and Projects: - Optional SEO title override. - Optional SEO
description override. - Optional social image override. - Canonical URL
derived from the configured public site URL and normalized slug. -
Default metadata falls back to title, excerpt/summary, and cover
image. - Do not allow arbitrary canonical URLs unless a specific
verified use case exists.

## 6. Public access contract

Anonymous visitors: - May read published Posts and Projects only. - May
read required taxonomy and public globals. - Must not read drafts or
unpublished records. - Must not create/update/delete content. - Must not
access privileged local API operations.

Authenticated administrator: - May manage content according to explicit
access rules. - Preview routes can read drafts only after validating the
authenticated/authorized preview mechanism.

## 7. Migration requirements

-   Generate and commit migrations using the workflow supported by the
    chosen Payload version.
-   Review generated migrations.
-   Test migrations against a disposable development database.
-   Document rollback/recovery limitations.
-   Never run migrations on production without explicit user approval.
