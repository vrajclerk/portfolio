/**
 * Environment variable validation.
 *
 * Validates required environment variables at startup. Throws at import time
 * so misconfigured deployments fail fast with a clear message rather than
 * silently returning undefined at runtime.
 *
 * SERVER-ONLY — this file must never be imported from client components or
 * browser bundles. It relies on Node.js process.env and checks server-side
 * secrets that must not be exposed to the browser.
 *
 * Usage: `import "@/lib/env"` at the top of server-only entry points (e.g.
 * payload.config.ts, route handlers, server actions).
 */

import "server-only";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- used in Phase 2 when secrets are uncommented
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[env] Required environment variable "${name}" is not set. ` +
        `See .env.example for a description of required variables.`
    );
  }
  return value;
}

/**
 * Validated server-side environment variables.
 *
 * Add each required server secret here. Do NOT add NEXT_PUBLIC_* variables
 * here — those belong in the public config below.
 *
 * Phase 1: only PAYLOAD_SECRET and DATABASE_URL are declared (as optional
 * stubs) because Payload itself is not installed until Phase 2. Validation
 * is gated behind a check so the foundation build passes without a running
 * database.
 *
 * Phase 2: uncomment the mandatory checks once Payload is installed.
 */
export const serverEnv = {
  /** Payload CMS secret key */
  payloadSecret: process.env.PAYLOAD_SECRET,

  /** PostgreSQL connection string (Neon) */
  databaseUrl: process.env.DATABASE_URL || process.env.POSTGRES_URL,

  /** Vercel Blob read/write token (optional in local development) */
  blobToken: process.env.BLOB_READ_WRITE_TOKEN,

  /**
   * Node.js runtime environment.
   * Defaults to "development" so the foundation works without a full .env.
   */
  nodeEnv: (process.env.NODE_ENV ?? "development") as
    | "development"
    | "production"
    | "test",
} as const;

/**
 * Public environment variables (safe for browser bundles).
 * All NEXT_PUBLIC_* variables are read here and exported as a typed object.
 * Do NOT include server-side secrets in this export.
 */
export const publicEnv = {
  /** Canonical public URL of the site — used for Open Graph, canonical tags, sitemaps. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
