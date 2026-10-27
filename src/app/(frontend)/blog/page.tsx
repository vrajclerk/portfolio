import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { PostCard } from "@/components/PostCard";
import { getAllCategories, getPublishedPosts, getSiteSettings } from "@/lib/cms";
import { generateBreadcrumbSchema } from "@/utilities/structuredData";

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

  const [posts, categories] = await Promise.all([
    getPublishedPosts({ category, tag }),
    getAllCategories(),
  ]);

  return (
    <>
      {/* Category Filter Tabs */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4" role="tablist">
          <Link
            href="/blog"
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
              !category
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
            role="tab"
            aria-selected={!category}
          >
            All Articles
          </Link>
          {categories.map((cat) => {
            const isActive = category === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.slug}`}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
                role="tab"
                aria-selected={isActive}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      )}

      {/* Article Grid / Empty State */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No published articles found"
          description="There are currently no articles matching the selected category."
          actionHref="/blog"
          actionLabel="View all articles"
        />
      )}
    </>
  );
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string }>;
}) {
  const siteSettings = await getSiteSettings();
  const siteUrl = siteSettings.siteUrl || "http://localhost:3000";
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
