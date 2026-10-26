import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { ProjectCard } from "@/components/ProjectCard";
import { RichTextRenderer } from "@/components/RichTextRenderer";
import { getPostBySlug, getPublishedPosts } from "@/lib/cms";
import type { Category, Project, Tag } from "@/payload-types";
import { calculateReadingTime, formatReadingTime } from "@/utilities/readingTime";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
  };
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // Return 404 for missing slugs or drafts (enforcing access control)
  if (!post || post._status !== "published") {
    notFound();
  }

  const category =
    post.category && typeof post.category === "object" && "name" in post.category
      ? (post.category as Category)
      : null;

  const tags = Array.isArray(post.tags)
    ? (post.tags.filter(
        (t): t is Tag => typeof t === "object" && t !== null && "name" in t
      ) as Tag[])
    : [];

  const relatedProjects = Array.isArray(post.relatedProjects)
    ? (post.relatedProjects.filter(
        (p): p is Project =>
          typeof p === "object" && p !== null && p._status === "published"
      ) as Project[])
    : [];

  const readingTime = calculateReadingTime(post.content);
  const formattedPublishDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently published";

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to all articles
        </Link>
      </div>

      {/* Article Header */}
      <header className="border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
          {category && <Badge variant="outline">{category.name}</Badge>}
          <time dateTime={post.publishedAt || undefined}>{formattedPublishDate}</time>
          <span>•</span>
          <span>{formatReadingTime(readingTime)}</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
      </header>

      {/* Main Body */}
      <div className="py-10">
        <RichTextRenderer data={post.content} />
      </div>

      {/* Article Footer & Tags */}
      <footer className="mt-8 pt-8 border-t border-border">
        {tags.length > 0 && (
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
              Tagged In
            </span>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-md bg-muted px-2.5 py-1 text-xs font-mono text-muted-foreground"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-6">
              Related Case Studies
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {relatedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}
      </footer>
    </article>
  );
}
