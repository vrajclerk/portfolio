/**
 * Site configuration — static values used across the application.
 *
 * Values that should be editable via CMS will be served from Payload globals
 * (SiteSettings, Profile) starting in Phase 3. This file provides safe
 * compile-time fallbacks for Phase 1 and for environments where the CMS is
 * unavailable.
 *
 * TODO (Phase 7): Replace placeholder copy with owner-approved content.
 * Do NOT invent biographical details, metrics, or achievements.
 */

export const siteConfig = {
  /**
   * Displayed site name — used in metadata title templates and the nav logo.
   * TODO (Phase 7): Replace with real name confirmed by owner.
   */
  name: "TODO: Developer Portfolio",

  /**
   * Short positioning statement — used in homepage and metadata.
   * TODO (Phase 7): Replace with real, owner-approved copy.
   */
  description:
    "TODO: Developer portfolio — replace with confirmed positioning statement.",

  /**
   * The canonical public URL of the deployed site.
   * Populated from the NEXT_PUBLIC_SITE_URL environment variable at runtime.
   * Falls back to localhost for local development.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /**
   * Navigation links for the primary site header.
   * TODO (Phase 3): Activate routes as pages are implemented.
   */
  navLinks: [
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Resume", href: "/resume" },
  ],

  /**
   * Social/contact links.
   * TODO (Phase 7): Replace placeholder URLs with owner-confirmed real URLs.
   * Do NOT invent profile URLs.
   */
  socialLinks: {
    github: "TODO: confirm GitHub URL",
    linkedin: "TODO: confirm LinkedIn URL",
  },
} as const;

export type SiteConfig = typeof siteConfig;
