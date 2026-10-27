import type { Post, Profile, Project, SiteSetting } from "@/payload-types";

/**
 * Utility functions for generating Schema.org JSON-LD structured data.
 * Adheres to Google Search and Schema.org standards for rich search results.
 */

export function generateWebsiteSchema({
  siteName,
  siteUrl,
  description,
}: {
  siteName: string;
  siteUrl: string;
  description?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description: description || undefined,
  };
}

export function generatePersonSchema({
  profile,
  siteSettings,
}: {
  profile: Profile;
  siteSettings: SiteSetting;
}) {
  const siteUrl = siteSettings.siteUrl || "http://localhost:3000";
  const sameAs = (siteSettings.socialLinks || [])
    .map((s) => s.url)
    .filter((url): url is string => Boolean(url));

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Vraj Clerk",
    jobTitle: profile.headline || "Full-Stack Software Engineer",
    url: siteUrl,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}

export function generateArticleSchema({
  post,
  siteUrl,
}: {
  post: Post;
  siteUrl: string;
}) {
  const postUrl = `${siteUrl.replace(/\/$/, "")}/blog/${post.slug}`;
  const category =
    post.category && typeof post.category === "object" && "name" in post.category
      ? post.category.name
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: postUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    author: {
      "@type": "Person",
      name: "Vraj Clerk",
    },
    articleSection: category,
  };
}

export function generateProjectSchema({
  project,
  siteUrl,
}: {
  project: Project;
  siteUrl: string;
}) {
  const projectUrl = `${siteUrl.replace(/\/$/, "")}/projects/${project.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.summary,
    url: projectUrl,
    codeRepository: project.repositoryUrl || undefined,
    programmingLanguage: Array.isArray(project.technologies)
      ? project.technologies
          .map((t) => (typeof t === "object" && t !== null && "name" in t ? t.name : null))
          .filter(Boolean)
      : undefined,
    creator: {
      "@type": "Person",
      name: "Vraj Clerk",
    },
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; path: string }[],
  siteUrl: string
) {
  const baseUrl = siteUrl.replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}
