"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import type { Category, Post, Tag } from "@/payload-types";
import { PostCard } from "@/components/PostCard";
import { EmptyState } from "@/components/EmptyState";

interface BlogFilterGridProps {
  initialPosts: Post[];
  categories: Category[];
  initialCategory?: string;
  initialTag?: string;
}

export function BlogFilterGrid({
  initialPosts,
  categories,
  initialCategory,
  initialTag,
}: BlogFilterGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all");
  const [selectedTag] = useState<string>(initialTag || "");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Update URL without triggering server navigation
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }
    if (selectedTag) {
      params.set("tag", selectedTag);
    }
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }
    const queryStr = params.toString();
    const newUrl = queryStr ? `/blog?${queryStr}` : "/blog";
    window.history.replaceState(null, "", newUrl);
  }, [selectedCategory, selectedTag, searchQuery]);

  // Instant in-memory filter across title, excerpt, category, and tags
  const filteredPosts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return initialPosts.filter((post) => {
      // 1. Category filter
      if (selectedCategory !== "all") {
        const catSlug =
          post.category && typeof post.category === "object" && "slug" in post.category
            ? (post.category as Category).slug
            : null;
        if (catSlug !== selectedCategory) return false;
      }

      // 2. Tag filter
      if (selectedTag) {
        const hasTag = Array.isArray(post.tags)
          ? post.tags.some((t) => {
              if (typeof t === "object" && t !== null && "slug" in t) {
                return (t as Tag).slug === selectedTag;
              }
              return false;
            })
          : false;
        if (!hasTag) return false;
      }

      // 3. Search query filter
      if (!query) return true;

      const titleMatch = post.title.toLowerCase().includes(query);
      const excerptMatch = (post.excerpt || "").toLowerCase().includes(query);

      const tagMatch = Array.isArray(post.tags)
        ? post.tags.some((t) => {
            if (typeof t === "object" && t !== null && "name" in t) {
              return (t as Tag).name.toLowerCase().includes(query);
            }
            return false;
          })
        : false;

      return titleMatch || excerptMatch || tagMatch;
    });
  }, [initialPosts, selectedCategory, selectedTag, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border">
        {/* Horizontal Scrollable Categories Tabs with Hidden Scrollbars (Mobile Ergonomic) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none [mask-image:linear-gradient(to_right,black_90%,transparent_100%)] md:[mask-image:none]">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
              selectedCategory === "all"
                ? "bg-foreground text-background font-bold shadow-xs scale-102"
                : "border border-border/70 bg-card/60 text-muted-foreground hover:border-accent hover:text-foreground hover:bg-card"
            }`}
          >
            All Articles
          </button>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-foreground text-background font-bold shadow-xs scale-102"
                    : "border border-border/70 bg-card/60 text-muted-foreground hover:border-accent hover:text-foreground hover:bg-card"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Live Search Input Box */}
        <div className="relative min-w-[240px] sm:min-w-[300px]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles or topics..."
            className="w-full rounded-xl border border-border/80 bg-card/90 dark:bg-[#12161D]/90 py-1.5 pl-9 pr-14 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all backdrop-blur-md"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
            <kbd className="hidden sm:inline-block rounded border border-border/80 bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
              /
            </kbd>
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-7 flex items-center text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Filter Status Badge & Result Count */}
      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
        <div>
          Showing <span className="font-bold text-foreground">{filteredPosts.length}</span> of{" "}
          <span>{initialPosts.length}</span> articles
        </div>
        {(selectedCategory !== "all" || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="text-accent hover:underline cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Article Grid / Empty State */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-stretch">
          {filteredPosts.map((post, idx) => (
            <PostCard key={post.id} post={post} index={idx} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No published articles found"
          description={`No articles found matching "${searchQuery || selectedCategory}". Try searching for another topic.`}
          actionLabel="Clear all filters"
          onAction={() => {
            setSelectedCategory("all");
            setSearchQuery("");
          }}
        />
      )}
    </div>
  );
}

