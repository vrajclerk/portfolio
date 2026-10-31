/**
 * CMS Data Access Layer.
 *
 * Provides a resilient, high-performance, type-safe interface for retrieving published content
 * and configuration globals from Payload CMS Local API.
 *
 * Performance Features:
 * - Request-level memoization via React cache() to deduplicate identical calls within a render pass.
 * - In-memory TTL caching with explicit tag invalidation hooks to eliminate redundant database queries.
 * - Graceful fixture fallback when database is unavailable.
 *
 * Enforces the public access contract:
 * - Anonymous visitors can ONLY read published content (_status === 'published').
 * - Drafts and non-existent slugs return null / trigger 404.
 */

import { cache } from "react";
import type { Where } from "payload";
import type {
  Category,
  HomepageSetting,
  Post,
  Profile,
  Project,
  SiteSetting,
  Tag,
} from "@/payload-types";
import {
  fixtureCategories,
  fixtureHomepageSettings,
  fixturePosts,
  fixtureProfile,
  fixtureProjects,
  fixtureSiteSettings,
  fixtureTags,
} from "./fixtures";

// ---------------------------------------------------------------------------
// High-Speed In-Memory Cache Store with TTL & Selective Invalidation
// ---------------------------------------------------------------------------

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL_MS = 60 * 1000; // 60 seconds TTL

function getCached<T>(key: string, ttlMs: number = DEFAULT_TTL_MS): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ttlMs) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCached<T>(key: string, data: T): void {
  memoryCache.set(key, { data, timestamp: Date.now() });
}

export function invalidateCmsCache(keyPrefix?: string): void {
  if (!keyPrefix) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.startsWith(keyPrefix)) {
      memoryCache.delete(key);
    }
  }
}

/**
 * Checks if a live database connection string is present in the environment.
 */
function hasDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
}

// Singleton payload instance promise to avoid repeated dynamic imports
let cachedPayloadPromise: Promise<any> | null = null;

async function getSafePayloadInstance() {
  if (!hasDatabaseConfigured()) {
    return null;
  }
  if (!cachedPayloadPromise) {
    cachedPayloadPromise = (async () => {
      try {
        const { default: configPromise } = await import("@payload-config");
        const { getPayload } = await import("payload");
        return await getPayload({ config: configPromise });
      } catch (error) {
        console.warn(
          "Payload Local API unavailable; falling back to schema fixtures.",
          error instanceof Error ? error.message : error
        );
        return null;
      }
    })();
  }
  return cachedPayloadPromise;
}

// ---------------------------------------------------------------------------
// Globals
// ---------------------------------------------------------------------------

export const getSiteSettings = cache(async function getSiteSettings(): Promise<SiteSetting> {
  const cacheKey = "site-settings";
  const cached = getCached<SiteSetting>(cacheKey);
  if (cached) return cached;

  const payload = await getSafePayloadInstance();
  if (payload) {
    try {
      const settings = await payload.findGlobal({
        slug: "site-settings",
        depth: 1,
      });
      if (settings && settings.siteName) {
        setCached(cacheKey, settings);
        return settings;
      }
    } catch {
      // Fall back to fixture
    }
  }
  setCached(cacheKey, fixtureSiteSettings);
  return fixtureSiteSettings;
});

export const getProfile = cache(async function getProfile(): Promise<Profile> {
  const cacheKey = "profile";
  const cached = getCached<Profile>(cacheKey);
  if (cached) return cached;

  const payload = await getSafePayloadInstance();
  if (payload) {
    try {
      const profile = await payload.findGlobal({
        slug: "profile",
        depth: 2,
      });
      if (profile && (profile.headline || profile.experience)) {
        setCached(cacheKey, profile);
        return profile;
      }
    } catch {
      // Fall back to fixture
    }
  }
  setCached(cacheKey, fixtureProfile);
  return fixtureProfile;
});

export const getHomepageSettings = cache(async function getHomepageSettings(): Promise<HomepageSetting> {
  const cacheKey = "homepage-settings";
  const cached = getCached<HomepageSetting>(cacheKey);
  if (cached) return cached;

  const payload = await getSafePayloadInstance();
  if (payload) {
    try {
      const settings = await payload.findGlobal({
        slug: "homepage-settings",
        depth: 2,
      });
      if (settings && (settings.heroHeadline || settings.featuredProjects)) {
        setCached(cacheKey, settings);
        return settings;
      }
    } catch {
      // Fall back to fixture
    }
  }
  setCached(cacheKey, fixtureHomepageSettings);
  return fixtureHomepageSettings;
});

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export interface GetProjectsOptions {
  projectType?: string;
  limit?: number;
}

export const getPublishedProjects = cache(async function getPublishedProjects(
  options: GetProjectsOptions = {}
): Promise<Project[]> {
  const { projectType, limit } = options;
  const cacheKey = `projects:${projectType || "all"}:${limit || "all"}`;
  const cached = getCached<Project[]>(cacheKey);
  if (cached) return cached;

  const payload = await getSafePayloadInstance();

  if (payload) {
    try {
      const whereClause: Where = {
        _status: { equals: "published" },
        or: [
          { hidden: { equals: false } },
          { hidden: { exists: false } },
        ],
      };

      if (projectType && projectType !== "all") {
        whereClause.projectType = { equals: projectType };
      }

      const result = await payload.find({
        collection: "projects",
        where: whereClause,
        sort: "displayOrder",
        limit: limit ?? 50,
        depth: 2,
      });

      if (result.docs.length > 0) {
        setCached(cacheKey, result.docs);
        return result.docs;
      }
    } catch {
      // Fall back to fixture
    }
  }

  // Fallback fixtures (guaranteeing _status === 'published' only and not hidden)
  let projects = fixtureProjects.filter((p) => p._status === "published" && !p.hidden);

  if (projectType && projectType !== "all") {
    projects = projects.filter((p) => p.projectType === projectType);
  }

  if (typeof limit === "number" && limit > 0) {
    projects = projects.slice(0, limit);
  }

  setCached(cacheKey, projects);
  return projects;
});

export const getProjectBySlug = cache(async function getProjectBySlug(
  slug: string,
  isDraftMode = false
): Promise<Project | null> {
  if (!slug) return null;

  const cacheKey = `project:${slug}`;
  if (!isDraftMode) {
    const cached = getCached<Project>(cacheKey);
    if (cached) return cached;
  }

  const payload = await getSafePayloadInstance();
  if (payload) {
    try {
      const whereClause: Where = {
        slug: { equals: slug },
      };

      if (!isDraftMode) {
        whereClause._status = { equals: "published" };
        whereClause.or = [
          { hidden: { equals: false } },
          { hidden: { exists: false } },
        ];
      }

      const result = await payload.find({
        collection: "projects",
        where: whereClause,
        draft: isDraftMode,
        limit: 1,
        depth: 2,
      });

      if (result.docs.length > 0) {
        const doc = result.docs[0];
        if (!isDraftMode) setCached(cacheKey, doc);
        return doc;
      }
    } catch {
      // Fall through to fixture
    }
  }

  // Fallback to fixture
  const project = fixtureProjects.find(
    (p) => p.slug === slug && (isDraftMode || (p._status === "published" && !p.hidden))
  );

  const finalDoc = project ?? null;
  if (!isDraftMode && finalDoc) setCached(cacheKey, finalDoc);
  return finalDoc;
});

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------

export interface GetPostsOptions {
  tag?: string;
  category?: string;
  limit?: number;
}

export const getPublishedPosts = cache(async function getPublishedPosts(
  options: GetPostsOptions = {}
): Promise<Post[]> {
  const { tag, category, limit } = options;
  const cacheKey = `posts:${tag || "all"}:${category || "all"}:${limit || "all"}`;
  const cached = getCached<Post[]>(cacheKey);
  if (cached) return cached;

  const payload = await getSafePayloadInstance();

  if (payload) {
    try {
      const whereClause: Where = {
        _status: { equals: "published" },
        or: [
          { hidden: { equals: false } },
          { hidden: { exists: false } },
        ],
      };

      if (category) {
        whereClause["category.slug"] = { equals: category };
      }

      if (tag) {
        whereClause["tags.slug"] = { equals: tag };
      }

      const result = await payload.find({
        collection: "posts",
        where: whereClause,
        sort: "-publishedAt",
        limit: limit ?? 50,
        depth: 2,
      });

      if (result.docs.length > 0) {
        setCached(cacheKey, result.docs);
        return result.docs;
      }
    } catch {
      // Fall back to fixture
    }
  }

  // Fallback fixtures (guaranteeing _status === 'published' only and not hidden)
  let posts = fixturePosts.filter((p) => p._status === "published" && !p.hidden);

  if (category) {
    posts = posts.filter(
      (p) =>
        p.category &&
        typeof p.category === "object" &&
        p.category.slug === category
    );
  }

  if (tag) {
    posts = posts.filter(
      (p) =>
        Array.isArray(p.tags) &&
        p.tags.some((t) => typeof t === "object" && t.slug === tag)
    );
  }

  if (typeof limit === "number" && limit > 0) {
    posts = posts.slice(0, limit);
  }

  setCached(cacheKey, posts);
  return posts;
});

export const getPostBySlug = cache(async function getPostBySlug(
  slug: string,
  isDraftMode = false
): Promise<Post | null> {
  if (!slug) return null;

  const cacheKey = `post:${slug}`;
  if (!isDraftMode) {
    const cached = getCached<Post>(cacheKey);
    if (cached) return cached;
  }

  const payload = await getSafePayloadInstance();
  if (payload) {
    try {
      const whereClause: Where = {
        slug: { equals: slug },
      };

      if (!isDraftMode) {
        whereClause._status = { equals: "published" };
        whereClause.or = [
          { hidden: { equals: false } },
          { hidden: { exists: false } },
        ];
      }

      const result = await payload.find({
        collection: "posts",
        where: whereClause,
        draft: isDraftMode,
        limit: 1,
        depth: 2,
      });

      if (result.docs.length > 0) {
        const doc = result.docs[0];
        if (!isDraftMode) setCached(cacheKey, doc);
        return doc;
      }
    } catch {
      // Fall through to fixture
    }
  }

  // Fallback to fixture
  const post = fixturePosts.find(
    (p) => p.slug === slug && (isDraftMode || (p._status === "published" && !p.hidden))
  );

  const finalDoc = post ?? null;
  if (!isDraftMode && finalDoc) setCached(cacheKey, finalDoc);
  return finalDoc;
});

// ---------------------------------------------------------------------------
// Taxonomies
// ---------------------------------------------------------------------------

export const getAllCategories = cache(async function getAllCategories(): Promise<Category[]> {
  const cacheKey = "categories:all";
  const cached = getCached<Category[]>(cacheKey);
  if (cached) return cached;

  const payload = await getSafePayloadInstance();
  if (payload) {
    try {
      const result = await payload.find({
        collection: "categories",
        limit: 100,
      });
      if (result.docs.length > 0) {
        setCached(cacheKey, result.docs);
        return result.docs;
      }
    } catch {
      // Fall through to fixture
    }
  }
  setCached(cacheKey, fixtureCategories);
  return fixtureCategories;
});

export const getAllTags = cache(async function getAllTags(): Promise<Tag[]> {
  const cacheKey = "tags:all";
  const cached = getCached<Tag[]>(cacheKey);
  if (cached) return cached;

  const payload = await getSafePayloadInstance();
  if (payload) {
    try {
      const result = await payload.find({
        collection: "tags",
        limit: 100,
      });
      if (result.docs.length > 0) {
        setCached(cacheKey, result.docs);
        return result.docs;
      }
    } catch {
      // Fall through to fixture
    }
  }
  setCached(cacheKey, fixtureTags);
  return fixtureTags;
});
