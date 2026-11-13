import React from "react";
import Link from "next/link";
import type { Category, Post, Tag } from "@/payload-types";
import { calculateReadingTime, formatReadingTime } from "@/utilities/readingTime";

interface PostCardProps {
  post: Post;
  index?: number;
}

export function PostCard({ post, index }: PostCardProps) {
  const category =
    post.category && typeof post.category === "object" && "name" in post.category
      ? (post.category as Category)
      : null;

  const tags = Array.isArray(post.tags)
    ? (post.tags.filter(
        (t): t is Tag => typeof t === "object" && t !== null && "name" in t
      ) as Tag[])
    : [];

  const readingTime = calculateReadingTime(post.content);
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently published";

  const displayIndex = index !== undefined ? String(index + 1).padStart(2, "0") : null;

  return (
    <article className="group relative flex flex-col justify-between h-full w-full rounded-3xl border border-border/80 dark:border-white/10 bg-card/90 dark:bg-[#131720]/90 p-6 sm:p-8 shadow-xs backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/10 hover:border-accent/60 dark:hover:border-accent/40 overflow-hidden">
      {/* Background Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-accent/0 blur-3xl transition-all duration-500 group-hover:bg-accent/10 dark:group-hover:bg-accent/15"
      />

      {/* Subtle Technical Grid Texture */}
      <div
        aria-hidden="true"
        className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-40"
      />

      {/* Top Beam Shimmer Line on Hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/0 to-transparent transition-all duration-500 group-hover:via-accent"
      />

      {/* Top Content Body */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Editorial Telemetry Bar */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Category Pill Badge with Dot */}
            {category && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 dark:bg-accent/15 border border-accent/25 px-3 py-0.5 text-xs font-semibold text-accent tracking-tight shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>{category.name}</span>
              </span>
            )}

            {/* LinkedIn Origin Badge */}
            {(post.source === "linkedin" || Boolean((post as { linkedinUrl?: string | null }).linkedinUrl)) && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#0a66c2]/10 dark:bg-[#0a66c2]/20 border border-[#0a66c2]/30 px-2.5 py-0.5 text-[11px] font-medium text-[#0a66c2] dark:text-[#70b5f9] tracking-tight shadow-xs">
                <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
                <span>LinkedIn</span>
              </span>
            )}

            {/* Date with Calendar Micro-Icon */}
            <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <svg className="h-3.5 w-3.5 text-muted-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <time dateTime={post.publishedAt || undefined}>{formattedDate}</time>
            </div>
          </div>

          {/* Reading Time Pill with Clock Icon */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/80 dark:bg-muted/50 border border-border/60 dark:border-white/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-muted-foreground shadow-xs">
            <svg className="h-3 w-3 text-muted-foreground/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 14" />
            </svg>
            <span>{formatReadingTime(readingTime)}</span>
          </div>
        </div>

        {/* Article Headline with Interactive Float Arrow */}
        <h3 className="mt-3 text-xl sm:text-2xl font-extrabold tracking-tight text-foreground leading-[1.25] transition-colors duration-200 group-hover:text-accent">
          <Link
            href={`/blog/${post.slug}`}
            className="focus:outline-hidden flex items-start justify-between gap-3"
          >
            <span>{post.title}</span>
            <span
              aria-hidden="true"
              className="shrink-0 text-muted-foreground/60 transition-transform duration-300 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 text-base mt-1"
            >
              ↗
            </span>
          </Link>
        </h3>

        {/* Narrative Excerpt */}
        <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-muted-foreground line-clamp-3 font-normal">
          {post.excerpt}
        </p>

        {/* Topic Tag Chips */}
        {tags.length > 0 && (
          <div className="mt-auto pt-5 flex flex-wrap gap-1.5">
            {tags.slice(0, 4).map((tag, tIdx) => (
              <span
                key={tag.id || tag.name || tIdx}
                className="inline-flex items-center rounded-lg bg-muted/60 dark:bg-muted/30 px-2.5 py-1 text-[11px] font-mono text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-muted hover:border-border border border-transparent"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Editorial Footer Shelf */}
      <div className="relative z-10 mt-6 pt-4 border-t border-border/60 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          {displayIndex && (
            <span className="font-bold text-foreground">
              ARTICLE #{displayIndex}
            </span>
          )}
          {!displayIndex && (
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>Full Engineering Breakdown</span>
            </span>
          )}
        </div>

        {/* Prominent Read Action Button with Shimmer Sweep */}
        <Link
          href={`/blog/${post.slug}`}
          className="group/btn relative inline-flex items-center gap-2 rounded-full bg-accent/10 dark:bg-accent/15 group-hover:bg-accent px-4 py-1.5 text-xs font-bold text-accent group-hover:text-accent-foreground border border-accent/30 group-hover:border-accent shadow-xs transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
        >
          <span>Read Article</span>
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover/btn:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
