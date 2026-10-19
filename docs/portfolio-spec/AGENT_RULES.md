# Agent Rules and Anti-Hallucination Contract

## 1. Operating mode

Work as a careful senior engineer. Implement only the current phase
explicitly requested by the user. Do not silently expand scope.

Before changing code: 1. Inspect the repository root, package manager,
existing framework, lockfiles, scripts, and current git status. 2. Read
the project documents in this kit. 3. Summarize the current repository
state and the intended changes. 4. Identify any conflict between this
specification and the existing code. 5. Ask a concise question only when
a decision blocks safe progress. Otherwise use the documented default
and record the assumption.

## 2. Source-of-truth hierarchy

When instructions conflict, follow this order: 1. Latest explicit user
instruction. 2. Existing repository conventions and verified current
code, unless the user requests a change. 3. This project specification.
4. Current official documentation for the exact installed versions. 5.
Clearly labeled engineering assumptions.

Never treat guesses, generated examples, or undocumented behavior as
facts.

## 3. Anti-hallucination rules

-   Do not invent professional achievements, project outcomes, user
    metrics, client names, work history, credentials, certifications,
    testimonials, or claims of production impact.
-   Use placeholders for personal details that have not been provided,
    for example `TODO: confirm public email`.
-   Do not invent deployment URLs, environment variables, API responses,
    cloud resources, or secret values.
-   Do not claim a feature works until it has been implemented and
    tested.
-   Do not assume a Payload API, field option, Next.js convention, or
    hosting capability exists. Verify it against official documentation
    for the selected version.
-   If a required fact cannot be verified, state the uncertainty and
    stop before building dependent behavior.
-   Never replace an unavailable dependency or tool with a fabricated
    package name.
-   Do not silently discard requirements. Record any deferred item and
    reason.

## 4. Repository safety

-   Never run destructive commands without explicit approval.
-   Never delete user changes, reset branches, rewrite git history, or
    overwrite files unrelated to the current phase.
-   Never commit, push, create a pull request, or deploy unless
    explicitly instructed.
-   Do not change Git identity, signing configuration, or remotes.
-   Do not read or print secret values. It is acceptable to check
    whether required variables are present, but never echo their
    contents.
-   Do not run production migrations or modify production infrastructure
    during local implementation.
-   Inspect `git diff` before reporting completion.

## 5. Implementation discipline

-   Implement one phase at a time from `IMPLEMENTATION_PLAN.md`.
-   Prefer small, reviewable changes.
-   Reuse existing conventions and components where reasonable.
-   Avoid adding libraries unless a documented requirement needs them.
-   Do not add a separate FastAPI service, Redis, a search engine, a
    queue, a public authentication system, or microservices to the
    initial portfolio.
-   Keep the website and Payload in one Next.js application unless a
    verified compatibility constraint requires otherwise.
-   Use PostgreSQL through the Payload-supported adapter. Do not
    introduce a second ORM for CMS data.
-   Do not use mock content as if it were real portfolio content.
    Clearly label fixtures and placeholders.
-   Keep server-only secrets and privileged Payload operations on the
    server.
-   Add tests for security-sensitive behavior and public content
    visibility.

## 6. Required phase report

At the end of each phase, report: 1. What changed, with file paths. 2.
What tests/checks were run and their actual results. 3. What was not
tested. 4. Any assumptions or deviations. 5. Remaining blockers. 6. The
exact next phase recommended.

Do not claim success when commands failed or were skipped.

## 7. Stop conditions

Stop and ask before proceeding if: - The repository already contains an
architecture that conflicts materially with this spec. - A version or
hosting requirement cannot be verified. - A migration could risk
existing data. - A task requires credentials, billing, production
access, or a user decision that is not available. - The requested change
would expose drafts, secrets, private project details, or privileged
admin APIs.
