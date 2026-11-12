/**
 * Dynamic site URL resolution utility.
 *
 * Automatically detects the canonical public URL across:
 * 1. Explicit user configuration: NEXT_PUBLIC_SITE_URL
 * 2. Vercel Production domain: VERCEL_PROJECT_PRODUCTION_URL
 * 3. Vercel Preview / Branch deployments: VERCEL_URL
 * 4. Local development fallback: http://localhost:3000
 *
 * Guarantees that canonical tags, sitemaps, robots.txt, and Schema.org
 * structured data always reference the live HTTPS domain in production
 * and preview environments, eliminating Lighthouse "localhost" SEO flags.
 */
export function getLiveSiteUrl(configuredUrl?: string | null): string {
  if (configuredUrl && !configuredUrl.includes("localhost") && configuredUrl.startsWith("http")) {
    return configuredUrl.replace(/\/+$/, "");
  }

  // 1. Check production / preview Vercel domains first if available
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/+$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/+$/, "");
  }

  // 2. Explicit configuration (if non-localhost or explicitly provided)
  const envUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/+$/, "");
  }

  // 3. Fallback for local development
  return envUrl ? envUrl.replace(/\/+$/, "") : "http://localhost:3000";
}

