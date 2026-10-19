/**
 * Shared TypeScript types for the public frontend.
 *
 * Phase 1: Basic utility types used by the foundation shell.
 * Phase 2+: Payload-generated types (from `payload-types.ts`) will be the
 * authoritative source for CMS content types. Import them from there, not here.
 *
 * Do NOT add CMS-specific types here — use generated Payload types in Phase 2.
 */

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

/** A single navigation link item used in headers, footers, and sidebars. */
export interface NavLink {
  label: string;
  href: string;
  /** Optional — marks an external link so `target="_blank"` and `rel` can be set. */
  external?: boolean;
}

// ---------------------------------------------------------------------------
// SEO / Metadata helpers
// ---------------------------------------------------------------------------

/**
 * Minimal SEO metadata shape used as a typed argument for helper functions.
 * Does not replace Next.js `Metadata` — it is a convenience input type.
 */
export interface SeoMeta {
  title: string;
  description?: string;
  /** Absolute URL of the canonical Open Graph image. */
  ogImageUrl?: string;
  /** Canonical URL — defaults to the current page URL if not provided. */
  canonicalUrl?: string;
}

// ---------------------------------------------------------------------------
// Generic utility types
// ---------------------------------------------------------------------------

/** Makes specified keys of T required (removes undefined/optional). */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/** Makes specified keys of T optional. */
export type PartialKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
