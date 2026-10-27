import type { Post, SiteSetting } from "@/payload-types";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function generateRssFeed({
  posts,
  siteSettings,
}: {
  posts: Post[];
  siteSettings: SiteSetting;
}): string {
  const siteUrl = (siteSettings.siteUrl || "http://localhost:3000").replace(/\/$/, "");
  const siteName = siteSettings.siteName || "Developer Portfolio";
  const description =
    siteSettings.defaultDescription ||
    "Technical writing on software systems, backend architectures, and modern web applications.";

  const itemsXml = posts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : new Date().toUTCString();
      const category =
        post.category && typeof post.category === "object" && "name" in post.category
          ? escapeXml(post.category.name)
          : "";

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>${
        category ? `\n      <category>${category}</category>` : ""
      }
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)} - Technical Writing</title>
    <link>${siteUrl}/blog</link>
    <description>${escapeXml(description)}</description>
    <language>en-US</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;
}
