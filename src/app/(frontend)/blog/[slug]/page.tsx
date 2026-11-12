import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { ProjectCard } from "@/components/ProjectCard";
import { PreviewBanner } from "@/components/PreviewBanner";
import { RichTextRenderer } from "@/components/RichTextRenderer";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { TableOfContents } from "@/components/TableOfContents";
import { getPostBySlug, getPublishedPosts, getSiteSettings } from "@/lib/cms";
import type { Category, Media, Project, Tag } from "@/payload-types";
import { calculateReadingTime, formatReadingTime } from "@/utilities/readingTime";
import { extractHeadingsFromLexical } from "@/utilities/toc";
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
} from "@/utilities/structuredData";
import { getLiveSiteUrl } from "@/utilities/siteUrl";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [post, siteSettings] = await Promise.all([
    getPostBySlug(slug, true),
    getSiteSettings(),
  ]);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  const title = post.seo?.title || post.title;
  const description = post.seo?.description || post.excerpt;
  const siteName = siteSettings.siteName || "Vraj Clerk";

  const isCoverImagePdf =
    post.coverImage &&
    typeof post.coverImage === "object" &&
    (("mimeType" in post.coverImage && post.coverImage.mimeType === "application/pdf") ||
      ("url" in post.coverImage &&
        typeof post.coverImage.url === "string" &&
        post.coverImage.url.toLowerCase().endsWith(".pdf")));

  const rawCoverUrl =
    !isCoverImagePdf &&
    post.coverImage &&
    typeof post.coverImage === "object" &&
    "url" in post.coverImage
      ? (post.coverImage.url as string)
      : undefined;

  const coverImageUrl = rawCoverUrl
    ? rawCoverUrl.startsWith("/api/media/file/")
      ? `/media/${rawCoverUrl.replace("/api/media/file/", "")}`
      : rawCoverUrl
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url: `/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt || undefined,
      ...(coverImageUrl ? { images: [{ url: coverImageUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
      ...(coverImageUrl ? { images: [coverImageUrl] } : {}),
    },
  };
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { isEnabled: isDraftMode } = await draftMode();
  const [post, siteSettings] = await Promise.all([
    getPostBySlug(slug, isDraftMode),
    getSiteSettings(),
  ]);

  // Return 404 for missing slugs or unpublished drafts outside draft mode
  if (!post || (!isDraftMode && post._status !== "published")) {
    notFound();
  }

  const siteUrl = getLiveSiteUrl(siteSettings.siteUrl);
  const articleSchema = generateArticleSchema({ post, siteUrl });
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ],
    siteUrl
  );

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

  const coverImage =
    post.coverImage && typeof post.coverImage === "object" && "url" in post.coverImage
      ? (post.coverImage as Media)
      : null;

  const isCoverImagePdf = Boolean(
    coverImage?.mimeType === "application/pdf" ||
      coverImage?.filename?.toLowerCase().endsWith(".pdf") ||
      coverImage?.url?.toLowerCase().endsWith(".pdf")
  );

  const normalizedCoverUrl = coverImage?.url
    ? coverImage.url.startsWith("/api/media/file/")
      ? `/media/${coverImage.filename || coverImage.url.replace("/api/media/file/", "")}`
      : coverImage.url
    : null;

  const readingTime = calculateReadingTime(post.content);
  const headings = extractHeadingsFromLexical(post.content);
  const formattedPublishDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently published";

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {isDraftMode && <PreviewBanner exitUrl={`/blog/${slug}`} />}
      <ReadingProgressBar />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row xl:gap-14 justify-center items-start">
          <article className="max-w-3xl w-full">
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

              {(post.linkedinUrl || post.source === "linkedin") && post.linkedinUrl && (
                <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-[#0a66c2]/25 bg-[#0a66c2]/5 dark:bg-[#0a66c2]/10 p-4 text-sm backdrop-blur-xs">
                  <div className="flex items-center gap-2.5 text-[#0a66c2] dark:text-[#70b5f9]">
                    <svg className="h-5 w-5 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                    <span className="font-semibold">Published on LinkedIn</span>
                  </div>
                  <a
                    href={post.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-xs sm:text-sm text-[#0a66c2] dark:text-[#70b5f9] hover:underline"
                  >
                    <span>Read original post & discussions</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              )}
            </header>

            {/* Featured Cover Image or Document Viewer */}
            {coverImage && normalizedCoverUrl && (
              isCoverImagePdf ? (
                <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-muted/60 dark:bg-muted/30 p-5 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                      <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.5 8.5h-1V15H7V9h2.5c.83 0 1.5.67 1.5 1.5s-.67 1-1.5 1zm5 3.5h-2.5V9H14c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5zm3.5-3.5H17V15h-1.5V9H18v1.5h-1v1h1zM8.5 10v1h1c.28 0 .5-.22.5-.5s-.22-.5-.5-.5h-1zm4.5 1.5v2c0 .28.22.5.5.5h.5V11h-.5c-.28 0-.5.22-.5.5z"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground text-sm sm:text-base">
                        Attached Slide Deck / Document
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        PDF presentation uploaded with this article
                      </p>
                    </div>
                  </div>
                  <a
                    href={normalizedCoverUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 shadow-xs"
                  >
                    <span>View PDF</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              ) : (
                <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/80 bg-muted shadow-md">
                  <Image
                    src={normalizedCoverUrl}
                    alt={coverImage.alt || post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover object-center"
                    priority
                  />
                </div>
              )
            )}

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

          {/* Sticky Desktop Table of Contents */}
          <TableOfContents headings={headings} />
        </div>
      </div>
    </>
  );
}
