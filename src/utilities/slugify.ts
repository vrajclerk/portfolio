/**
 * Normalizes a title or string into a URL-safe kebab-case slug.
 */
export function formatSlug(val: string): string {
  return val
    .toLowerCase()
    .trim()
    .replace(/[._]/g, "-")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
