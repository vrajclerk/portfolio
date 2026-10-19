# Developer Portfolio Agent Kit

This folder contains the implementation specification for a developer portfolio built with Next.js, React, TypeScript, and Payload CMS.

## Non-negotiable budget constraint

**Target ongoing infrastructure cost: ₹0/month.** Do not purchase a domain, subscribe to a hosting plan, enable paid usage, or provision billable resources. Use a free subdomain. Do not assume that a provider's free tier is permanently available or impossible to misconfigure into a bill.

The preferred deployment experiment is a single **Oracle Cloud Always Free** VM running the Next.js + Payload application and PostgreSQL, with a free DuckDNS subdomain and Let's Encrypt TLS. This is a candidate, not a guarantee: account verification, free capacity, regional availability, and current Oracle terms must be checked before implementation. Never upgrade to a paid plan to work around an obstacle.

If an Always Free VM cannot be obtained without payment or a payment method, stop and report the blocker. Offer the user the true-$0 fallback: run Payload locally and deploy a static portfolio to GitHub Pages using content exported or maintained as Markdown/JSON. Do not silently replace the live CMS requirement.

## Files

- `AGENT_RULES.md`: mandatory instructions for the coding agent.
- `PROJECT_BRIEF.md`: goals, pages, scope, and acceptance criteria.
- `ARCHITECTURE.md`: application boundaries and data flow.
- `DATA_MODEL.md`: Payload collections, globals, and access rules.
- `DEPLOYMENT.md`: zero-cost deployment plan and safety constraints.
- `IMPLEMENTATION_PLAN.md`: gated implementation phases.
- `QUALITY_GATES.md`: functional, security, accessibility, and SEO checks.
- `DECISIONS_AND_ASSUMPTIONS.md`: assumptions, compatibility checks, and decision log.

## How to use

1. Copy this folder into the repository as `docs/portfolio-spec/`.
2. Ask the agent to read `AGENT_RULES.md` first, then all other specification files.
3. Run **Phase 0 only** from `IMPLEMENTATION_PLAN.md`.
4. Review the compatibility report and proposed deployment before authorizing Phase 1.
5. Implement one phase at a time. Do not ask an agent to execute the entire project in one pass.

The agent must inspect official, current documentation before choosing versions or claiming that any free-tier deployment is supported. Do not fabricate personal details, work achievements, metrics, testimonials, URLs, or project results.
