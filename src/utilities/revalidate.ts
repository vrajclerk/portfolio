import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";
import { invalidateCmsCache } from "@/lib/cms";

/**
 * Revalidation hooks for Next.js App Router cache invalidation.
 *
 * Ensures that when content is updated, published, or deleted in Payload CMS,
 * the corresponding static/cached frontend paths are invalidated immediately.
 */

export const revalidatePostAfterChange: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
}) => {
  try {
    invalidateCmsCache("posts");
    invalidateCmsCache("post");
    revalidatePath("/blog");
    revalidatePath("/");
    if (doc?.slug) {
      revalidatePath(`/blog/${doc.slug}`);
    }
    if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
      revalidatePath(`/blog/${previousDoc.slug}`);
    }
  } catch {
    // Gracefully handle executions outside active Next.js request context (e.g. CLI migrations/seed)
  }
  return doc;
};

export const revalidatePostAfterDelete: CollectionAfterDeleteHook = ({
  doc,
}) => {
  try {
    invalidateCmsCache("posts");
    invalidateCmsCache("post");
    revalidatePath("/blog");
    revalidatePath("/");
    if (doc?.slug) {
      revalidatePath(`/blog/${doc.slug}`);
    }
  } catch {
    // Gracefully handle executions outside active Next.js request context
  }
  return doc;
};

export const revalidateProjectAfterChange: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
}) => {
  try {
    invalidateCmsCache("projects");
    invalidateCmsCache("project");
    revalidatePath("/projects");
    revalidatePath("/");
    if (doc?.slug) {
      revalidatePath(`/projects/${doc.slug}`);
    }
    if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
      revalidatePath(`/projects/${previousDoc.slug}`);
    }
  } catch {
    // Gracefully handle executions outside active Next.js request context
  }
  return doc;
};

export const revalidateProjectAfterDelete: CollectionAfterDeleteHook = ({
  doc,
}) => {
  try {
    invalidateCmsCache("projects");
    invalidateCmsCache("project");
    revalidatePath("/projects");
    revalidatePath("/");
    if (doc?.slug) {
      revalidatePath(`/projects/${doc.slug}`);
    }
  } catch {
    // Gracefully handle executions outside active Next.js request context
  }
  return doc;
};

export const revalidateSiteSettingsAfterChange: GlobalAfterChangeHook = ({
  doc,
}) => {
  try {
    invalidateCmsCache("site-settings");
    revalidatePath("/", "layout");
  } catch {
    // Gracefully handle executions outside active Next.js request context
  }
  return doc;
};

export const revalidateProfileAfterChange: GlobalAfterChangeHook = ({
  doc,
}) => {
  try {
    invalidateCmsCache("profile");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/resume");
  } catch {
    // Gracefully handle executions outside active Next.js request context
  }
  return doc;
};

export const revalidateHomepageAfterChange: GlobalAfterChangeHook = ({
  doc,
}) => {
  try {
    invalidateCmsCache("homepage-settings");
    revalidatePath("/");
  } catch {
    // Gracefully handle executions outside active Next.js request context
  }
  return doc;
};
