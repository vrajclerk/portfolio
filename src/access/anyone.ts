import type { Access } from "payload";

/**
 * Access rule allowing public read access (used for public categories, tags, media, and public globals).
 */
export const anyone: Access = () => true;
