/**
 * CMS Data Access Layer.
 *
 * Provides a resilient, type-safe interface for retrieving published content
 * and configuration globals from Payload CMS Local API.
 *
 * When a database is not configured (or during offline development/builds),
 * it seamlessly and safely falls back to schema-compliant fixtures.
 *
 * Enforces the public access contract:
 * - Anonymous visitors can ONLY read published content (_status === 'published').
 * - Drafts and non-existent slugs return null / trigger 404.
 */

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

/**
 * Checks if a live database connection string is present in the environment.
 */
function hasDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
}

async function getSafePayloadInstance() {
  if (!hasDatabaseConfigured()) {
    return null;
  }
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
}

// ---------------------------------------------------------------------------
// Globals
// ---------------------------------------------------------------------------

export async function getSiteSettings(): Promise<SiteSetting> {
  const payload = await getSafePayloadInstance();
  if (payload) {
    try {
      const settings = await payload.findGlobal({
        slug: "site-settings",
        depth: 1,
      });
      if (settings && settings.siteName) {
        return settings;
      }
    } catch {
      // Fall back to fixture
    }
  }
  return fixtureSiteSettings;
}

export async function getProfile(): Promise<Profile> {
  const payload = await getSafePayloadInstance();
  if (payload) {
    try {
      const profile = await payload.findGlobal({
        slug: "profile",
        depth: 2,
      });
      if (profile && (profile.headline || profile.experience)) {
        return profile;
      }
    } catch {
      // Fall back to fixture
    }
  }
  return fixtureProfile;
}

export async function getHomepageSettings(): Promise<HomepageSetting> {
  const payload = await getSafePayloadInstance();
  if (payload) {
    try {
      const settings = await payload.findGlobal({
        slug: "homepage-settings",
        depth: 2,
      });
      if (settings && (settings.heroHeadline || settings.featuredProjects)) {
        return settings;
      }
    } catch {
      // Fall back to fixture
    }
  }
  return fixtureHomepageSettings;
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export interface GetProjectsOptions {
  projectType?: string;
  limit?: number;
}

export async function getPublishedProjects(
  options: GetProjectsOptions = {}
): Promise<Project[]> {
  const { projectType, limit } = options;
  const payload = await getSafePayloadInstance();

  if (payload) {
    try {
      const whereClause: Where = {
        _status: { equals: "published" },
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
        return result.docs;
      }
    } catch {
      // Fall back to fixture
    }
  }

  // Fallback fixtures (guaranteeing _status === 'published' only)
  let projects = fixtureProjects.filter((p) => p._status === "published");

  if (projectType && projectType !== "all") {
    projects = projects.filter((p) => p.projectType === projectType);
  }

  if (typeof limit === "number" && limit > 0) {
    projects = projects.slice(0, limit);
  }

  return projects;
}

export async function getProjectBySlug(
  slug: string,
  isDraftMode = false
): Promise<Project | null> {
  if (!slug) return null;

  const payload = await getSafePayloadInstance();
  if (payload) {
    try {
      const whereClause: Where = {
        slug: { equals: slug },
      };

      if (!isDraftMode) {
        whereClause._status = { equals: "published" };
      }

      const result = await payload.find({
        collection: "projects",
        where: whereClause,
        draft: isDraftMode,
        limit: 1,
        depth: 2,
      });

      if (result.docs.length > 0) {
        return result.docs[0];
      }
    } catch {
      // Fall through to fixture
    }
  }

  // Fallback to fixture
  const project = fixtureProjects.find(
    (p) => p.slug === slug && (isDraftMode || p._status === "published")
  );

  return project ?? null;
}

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------

export interface GetPostsOptions {
  tag?: string;
  category?: string;
  limit?: number;
}

export async function getPublishedPosts(
  options: GetPostsOptions = {}
): Promise<Post[]> {
  const { tag, category, limit } = options;
  const payload = await getSafePayloadInstance();

  if (payload) {
    try {
      const whereClause: Where = {
        _status: { equals: "published" },
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
        return result.docs;
      }
    } catch {
      // Fall back to fixture
    }
  }

  // Fallback fixtures (guaranteeing _status === 'published' only)
  let posts = fixturePosts.filter((p) => p._status === "published");

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

  return posts;
}

export async function getPostBySlug(
  slug: string,
  isDraftMode = false
): Promise<Post | null> {
  if (!slug) return null;

  const payload = await getSafePayloadInstance();
  if (payload) {
    try {
      const whereClause: Where = {
        slug: { equals: slug },
      };

      if (!isDraftMode) {
        whereClause._status = { equals: "published" };
      }

      const result = await payload.find({
        collection: "posts",
        where: whereClause,
        draft: isDraftMode,
        limit: 1,
        depth: 2,
      });

      if (result.docs.length > 0) {
        return result.docs[0];
      }
    } catch {
      // Fall through to fixture
    }
  }

  // Fallback to fixture
  const post = fixturePosts.find(
    (p) => p.slug === slug && (isDraftMode || p._status === "published")
  );

  return post ?? null;
}

// ---------------------------------------------------------------------------
// Taxonomies
// ---------------------------------------------------------------------------

export async function getAllCategories(): Promise<Category[]> {
  const payload = await getSafePayloadInstance();
  if (payload) {
    try {
      const result = await payload.find({
        collection: "categories",
        limit: 100,
      });
      if (result.docs.length > 0) {
        return result.docs;
      }
    } catch {
      // Fall through to fixture
    }
  }
  return fixtureCategories;
}

export async function getAllTags(): Promise<Tag[]> {
  const payload = await getSafePayloadInstance();
  if (payload) {
    try {
      const result = await payload.find({
        collection: "tags",
        limit: 100,
      });
      if (result.docs.length > 0) {
        return result.docs;
      }
    } catch {
      // Fall through to fixture
    }
  }
  return fixtureTags;
}
