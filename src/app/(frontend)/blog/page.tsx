import React, { Suspense } from "react";
import type { Metadata } from "next";
import { BlogFilterGrid } from "@/components/BlogFilterGrid";
import { getAllCategories, getPublishedPosts, getSiteSettings } from "@/lib/cms";
import { generateBreadcrumbSchema } from "@/utilities/structuredData";
import { getLiveSiteUrl } from "@/utilities/siteUrl";

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const siteName = siteSettings.siteName || "Vraj Clerk";
  const title = "Blog & Technical Writing";
  const description =
    "Engineering articles on systems architecture, backend reliability, TypeScript, and modern web application patterns.";

  return {
    title,
    description,
    alternates: {
      canonical: "/blog",
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url: "/blog",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
    },
  };
}

async function BlogList({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string }>;
}) {
  const { category, tag } = await searchParams;

  // Retrieve all published posts and categories once so client-side filter can query instantly
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getAllCategories(),
  ]);

  return (
    <BlogFilterGrid
      initialPosts={posts}
      categories={categories}
      initialCategory={category}
      initialTag={tag}
    />
  );
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string }>;
}) {
  const siteSettings = await getSiteSettings();
  const siteUrl = getLiveSiteUrl(siteSettings.siteUrl);
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ],
    siteUrl
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Page Header */}
      <div className="max-w-3xl mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">
          Writing
        </span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Technical Articles & Notes
        </h1>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">
          Deep-dives into backend system design, database indexing, TypeScript patterns, and operational realities. Published directly via Payload CMS.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="py-12 text-center text-sm text-muted-foreground">
            Loading articles...
          </div>
        }
      >
        <BlogList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
