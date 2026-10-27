import assert from "node:assert/strict";
import test, { describe } from "node:test";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import { getPublishedPosts, getSiteSettings } from "../src/lib/cms";
import type { Post, Profile, Project, SiteSetting } from "../src/payload-types";
import { generateRssFeed } from "../src/utilities/rss";
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  generatePersonSchema,
  generateProjectSchema,
  generateWebsiteSchema,
} from "../src/utilities/structuredData";

describe("Phase 5: SEO, RSS, and Structured Data", () => {
  describe("Sitemap Generation (sitemap.ts)", () => {
    test("generates valid sitemap entries with priority and lastModified", async () => {
      const items = await sitemap();
      assert.ok(items.length >= 6, "Must contain all public static and published dynamic routes");

      for (const item of items) {
        assert.ok(item.url.startsWith("http"), `Invalid URL: ${item.url}`);
        assert.ok(item.lastModified instanceof Date, `Missing lastModified date for ${item.url}`);
      }
    });

    test("includes core static public routes", async () => {
      const items = await sitemap();
      const urls = items.map((i) => i.url);

      assert.ok(urls.some((u) => u.endsWith("/about") || u.includes("/about")));
      assert.ok(urls.some((u) => u.endsWith("/projects") || u.includes("/projects")));
      assert.ok(urls.some((u) => u.endsWith("/blog") || u.includes("/blog")));
      assert.ok(urls.some((u) => u.endsWith("/contact") || u.includes("/contact")));
      assert.ok(urls.some((u) => u.endsWith("/resume") || u.includes("/resume")));
    });

    test("includes published projects and posts, but strictly excludes drafts and internal routes", async () => {
      const items = await sitemap();
      const urls = items.map((i) => i.url);

      // Must include published items
      assert.ok(urls.some((u) => u.includes("/blog/designing-idempotent-webhook-handlers")));
      assert.ok(urls.some((u) => u.includes("/projects/webhook-processing-pipeline")));

      // Must NEVER include drafts
      assert.ok(!urls.some((u) => u.includes("draft-internal-database-notes")));
      assert.ok(!urls.some((u) => u.includes("draft-query-cache-experiment")));

      // Must NEVER include admin or api routes
      assert.ok(!urls.some((u) => u.includes("/admin")));
      assert.ok(!urls.some((u) => u.includes("/api/")));
    });
  });

  describe("Robots Configuration (robots.ts)", () => {
    test("configures userAgent, allow, disallow, and sitemap URL", async () => {
      const config = await robots();
      assert.ok(config.rules);

      const rules = Array.isArray(config.rules) ? config.rules[0] : config.rules;
      assert.equal(rules.userAgent, "*");
      assert.equal(rules.allow, "/");

      const disallow = Array.isArray(rules.disallow) ? rules.disallow : [rules.disallow];
      assert.ok(disallow.includes("/admin/"), "Must disallow /admin/");
      assert.ok(disallow.includes("/api/"), "Must disallow /api/");

      assert.ok(typeof config.sitemap === "string" && config.sitemap.endsWith("/sitemap.xml"));
    });
  });

  describe("RSS Feed Generation (generateRssFeed)", () => {
    test("produces valid RSS 2.0 XML with published items and escapes characters", async () => {
      const [posts, siteSettings] = await Promise.all([
        getPublishedPosts(),
        getSiteSettings(),
      ]);

      const xml = generateRssFeed({ posts, siteSettings });

      assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
      assert.ok(xml.includes('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">'));
      assert.ok(xml.includes("<channel>"));
      assert.ok(xml.includes("<title>"));
      assert.ok(xml.includes("<link>"));
      assert.ok(xml.includes("<atom:link"));
      assert.ok(xml.includes("<item>"));
      assert.ok(xml.includes("designing-idempotent-webhook-handlers"));

      // Draft posts must not appear
      assert.ok(!xml.includes("draft-internal-database-notes"));

      // Valid escaping check
      const postWithPunctuation = posts.find((p) => p.title.includes("&") || p.excerpt.includes("&"));
      if (postWithPunctuation) {
        assert.ok(!xml.includes("& ") && xml.includes("&amp;"));
      }
    });
  });

  describe("Schema.org JSON-LD Structured Data", () => {
    test("generateWebsiteSchema produces valid WebSite object", () => {
      const schema = generateWebsiteSchema({
        siteName: "Vraj Clerk Portfolio",
        siteUrl: "https://example.com",
        description: "Portfolio description",
      });

      assert.equal(schema["@context"], "https://schema.org");
      assert.equal(schema["@type"], "WebSite");
      assert.equal(schema.name, "Vraj Clerk Portfolio");
      assert.equal(schema.url, "https://example.com");
    });

    test("generatePersonSchema produces valid Person object with profile info", () => {
      const mockProfile = {
        headline: "Full-Stack Engineer",
      } as unknown as Profile;
      const mockSettings = {
        siteUrl: "https://example.com",
        socialLinks: [{ label: "GitHub", url: "https://github.com/vrajclerk" }],
      } as unknown as SiteSetting;

      const schema = generatePersonSchema({
        profile: mockProfile,
        siteSettings: mockSettings,
      });

      assert.equal(schema["@context"], "https://schema.org");
      assert.equal(schema["@type"], "Person");
      assert.equal(schema.name, "Vraj Clerk");
      assert.equal(schema.jobTitle, "Full-Stack Engineer");
      assert.ok(Array.isArray(schema.sameAs) && schema.sameAs.includes("https://github.com/vrajclerk"));
    });

    test("generateArticleSchema produces valid BlogPosting object with dates and author", () => {
      const mockPost = {
        title: "Building Scalable Systems",
        slug: "building-scalable-systems",
        excerpt: "An overview of scalable backend patterns.",
        publishedAt: "2026-03-01T12:00:00Z",
        updatedAt: "2026-03-02T15:00:00Z",
        category: { name: "Architecture", slug: "architecture" },
      } as unknown as Post;

      const schema = generateArticleSchema({
        post: mockPost,
        siteUrl: "https://example.com",
      });

      assert.equal(schema["@context"], "https://schema.org");
      assert.equal(schema["@type"], "BlogPosting");
      assert.equal(schema.headline, "Building Scalable Systems");
      assert.equal(schema.url, "https://example.com/blog/building-scalable-systems");
      assert.equal(schema.datePublished, "2026-03-01T12:00:00Z");
      assert.equal(schema.articleSection, "Architecture");
      assert.equal(schema.author.name, "Vraj Clerk");
    });

    test("generateProjectSchema produces valid SoftwareSourceCode object", () => {
      const mockProject = {
        title: "Resilient Webhook Engine",
        slug: "resilient-webhook-engine",
        summary: "Distributed webhook ingestion service.",
        repositoryUrl: "https://github.com/vrajclerk/webhook-engine",
        technologies: [{ name: "TypeScript" }, { name: "PostgreSQL" }],
      } as unknown as Project;

      const schema = generateProjectSchema({
        project: mockProject,
        siteUrl: "https://example.com",
      });

      assert.equal(schema["@context"], "https://schema.org");
      assert.equal(schema["@type"], "SoftwareSourceCode");
      assert.equal(schema.name, "Resilient Webhook Engine");
      assert.equal(schema.codeRepository, "https://github.com/vrajclerk/webhook-engine");
      assert.ok(schema.programmingLanguage?.includes("TypeScript"));
    });

    test("generateBreadcrumbSchema produces 1-based indexed BreadcrumbList", () => {
      const schema = generateBreadcrumbSchema(
        [
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: "Engine", path: "/projects/engine" },
        ],
        "https://example.com"
      );

      assert.equal(schema["@context"], "https://schema.org");
      assert.equal(schema["@type"], "BreadcrumbList");
      assert.equal(schema.itemListElement.length, 3);
      assert.equal(schema.itemListElement[0].position, 1);
      assert.equal(schema.itemListElement[1].position, 2);
      assert.equal(schema.itemListElement[2].position, 3);
      assert.equal(schema.itemListElement[2].item, "https://example.com/projects/engine");
    });
  });
});
