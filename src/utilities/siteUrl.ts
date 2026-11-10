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

  let url = process.env.NEXT_PUBLIC_SITE_URL;

  if (!url && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    url = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (!url && process.env.VERCEL_URL) {
    url = `https://${process.env.VERCEL_URL}`;
  }

  if (!url) {
    url = "http://localhost:3000";
  }

  return url.replace(/\/+$/, "");
}

