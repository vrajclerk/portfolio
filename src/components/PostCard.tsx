import React from "react";
import Link from "next/link";
import type { Category, Post, Tag } from "@/payload-types";
import { calculateReadingTime, formatReadingTime } from "@/utilities/readingTime";
import { Badge } from "./Badge";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
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

  return (
    <article className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs transition-all hover:border-foreground/30 hover:shadow-md">
      <div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          {category && <Badge variant="outline">{category.name}</Badge>}
          <time dateTime={post.publishedAt || undefined}>{formattedDate}</time>
          <span>•</span>
          <span>{formatReadingTime(readingTime)}</span>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent">
          <Link href={`/blog/${post.slug}`} className="focus:outline-hidden">
            {post.title}
          </Link>
        </h3>

        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {post.excerpt}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground font-mono"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        ) : (
          <div />
        )}

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-sm font-medium text-accent hover:underline"
        >
          Read article
          <svg
            className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
