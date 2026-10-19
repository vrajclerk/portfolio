# Deployment: Option A (Target ₹0/month, Self-Hosted)

## 1. Goal

Deploy the Next.js portfolio and Payload CMS without a paid hosting plan, paid database, object-storage subscription, or paid domain.

Candidate architecture: one Oracle Cloud Always Free VM running the Next.js + Payload application and PostgreSQL, plus a free DuckDNS subdomain and Let's Encrypt TLS. This is conditional on current free-tier eligibility, capacity, and terms. It is not a guarantee of permanent availability or zero operational risk.

**Hard budget rule:** do not enable paid usage, upgrade a plan, purchase a domain, or provision any resource unless the user explicitly changes the budget constraint. If the free deployment cannot be provisioned, stop and report the blocker. Never improvise by selecting a paid provider.

## 2. Components

- Next.js + Payload application on one Always Free VM, only after official eligibility and capacity are verified.
- PostgreSQL on the same VM, accessible only locally/private interface.
- Persistent local disk for CMS media.
- Free DuckDNS subdomain; Let's Encrypt certificate for HTTPS.
- GitHub repository and GitHub Actions checks, subject to current free limits.
- No paid analytics, email provider, external object storage, custom domain, or monitoring subscription in the MVP.

## 3. Mandatory discovery gate

Before provisioning, verify from official current documentation:

1. Whether an Always Free compute shape is available in the intended region.
2. Whether account verification requires a payment card and whether that is acceptable to the user.
3. Which compute, memory, disk, bandwidth, and availability limits apply.
4. Whether the intended resources are explicitly marked Always Free and cannot incur charges under the proposed configuration.
5. Current Payload, Next.js, Node.js, and PostgreSQL compatibility.
6. How persistent volumes, public IPs, inbound HTTPS, and firewall rules work.
7. Current DuckDNS and Let's Encrypt requirements.
8. Whether a free VM is suitable for a small personal portfolio and what operational limitations apply.

Do not create resources during discovery. Provide source URLs and a proposed resource list. Wait for approval before provisioning or modifying cloud infrastructure.

## 4. Environment variables

Create `.env.example` with names and safe placeholder values only. Never commit real secrets.

Likely variables, depending on installed versions: `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`, and any adapter-specific settings. Do not add email or analytics credentials unless the user explicitly approves an integration. Use the exact variable names required by installed packages.

Production secrets must be stored in a root-readable environment file or another verified free secret mechanism, never in Git. Restrict filesystem permissions and do not expose server-only secrets to client bundles.

## 5. Environments

### Local

- Run the app and PostgreSQL locally.
- Use `.env.local`, excluded from Git.
- Use local media storage.
- Seed only clearly labeled demo fixtures; never fabricate the owner's actual experience.

### Preview

- Prefer local preview and CI checks rather than creating additional cloud environments.
- Never point preview deployments at production data by default.
- Keep production secrets unavailable to untrusted branches and pull requests.

### Production

- Use only resources confirmed as Always Free.
- Configure a host firewall to allow only required inbound ports, normally SSH restricted to the owner's IP where practical and HTTP/HTTPS.
- Keep PostgreSQL inaccessible from the public internet.
- Run the application under a non-root service account.
- Configure restart-on-failure with systemd or a verified equivalent.
- Use HTTPS and restrict Payload admin access with strong authentication.
- Keep OS and runtime patched.
- Avoid storing secrets in shell history, logs, or repository files.

## 6. Database and media operations

- Keep PostgreSQL bound to localhost/private interface only.
- Run migrations as a deliberate release step, not opportunistically on every request.
- Back up before schema changes.
- Create documented `pg_dump` and media-archive procedures.
- Store a backup copy on the owner's local computer or another storage location the user already owns. Do not assume cloud backup storage is free.
- Test restoration at least once before calling deployment complete.
- A single VM is a single point of failure. Do not claim high availability or managed-backup guarantees.

## 7. CI/CD

Pull request checks: install using lockfile, lint/format check, type-check, tests, production build, and dependency/security checks as appropriate.

Deployment: use a manually approved deployment step or a tightly scoped SSH-based workflow with protected secrets. Never expose deployment secrets to untrusted pull requests. Do not permit the coding agent to deploy without explicit user instruction.

Verify health, homepage, project page, blog page, CMS login, published-content behavior, HTTPS, and restart recovery after deployment.

## 8. Cost controls

- Keep a written inventory of every cloud resource and its free-tier eligibility.
- Do not enable paid support, paid monitoring, paid backups, paid email, or paid storage.
- Do not assume that a budget alert prevents charges.
- Do not upgrade to a paid plan if a free quota is exhausted. Disable the affected optional feature or stop and ask.
- Do not add a custom domain; use a free subdomain.
- Check the provider's current free-tier terms before each major infrastructure change.
- If the provider requires a payment method and the user does not accept that, do not proceed with that provider.
- Never state that future costs are impossible. State the exact verified limits and remaining risks.

## 9. Rollback and failure plan

- Keep the previous application release or documented Git revision available for rollback.
- Back up database and media before risky changes.
- Database schema rollback is not assumed to be automatic.
- If the VM becomes unavailable, recover from local backups or report the outage; do not automatically provision paid replacements.
- If the Always Free VM cannot be provisioned, stop and offer the static GitHub Pages fallback rather than moving to paid hosting.
