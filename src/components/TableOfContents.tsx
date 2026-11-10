"use client";

import React, { useEffect, useState } from "react";
import type { TocItem } from "@/utilities/toc";

interface TableOfContentsProps {
  headings?: TocItem[];
}

export function TableOfContents({ headings = [] }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  useEffect(() => {
    if (headings.length === 0) return;

    // Ensure matching DOM headings in .prose-content carry the id anchor
    const headingElements = Array.from(document.querySelectorAll(".prose-content h2, .prose-content h3"));
    headings.forEach((item) => {
      const match = headingElements.find((el) => el.textContent?.trim() === item.text);
      if (match && !match.id) {
        match.id = item.id;
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: 0.1,
      }
    );

    headingElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  if (headings.length < 2) {
    return null;
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
      setIsOpenMobile(false);
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <>
      {/* Mobile Collapsible Accordion Drawer */}
      <div className="xl:hidden mb-8 rounded-2xl border border-border/80 bg-card/90 dark:bg-[#12161D]/90 p-4 shadow-sm backdrop-blur-md">
        <button
          type="button"
          onClick={() => setIsOpenMobile((prev) => !prev)}
          className="w-full flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-accent cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>Table of Contents ({headings.length} sections)</span>
          </span>
          <span className="text-muted-foreground">{isOpenMobile ? "−" : "+"}</span>
        </button>

        {isOpenMobile && (
          <nav className="mt-3 pt-3 border-t border-border/60 space-y-1 text-xs">
            {headings.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleLinkClick(e, item.id)}
                className={`block py-1 transition-colors ${
                  item.level === 3 ? "pl-4" : "pl-0"
                } ${
                  activeId === item.id
                    ? "text-accent font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.text}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop Sticky Floating Navigation */}
      <aside className="hidden xl:block sticky top-24 self-start w-64 pl-6 border-l border-border/60">
        <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span>On this page</span>
        </div>
        <nav className="space-y-1.5 text-xs">
          {headings.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleLinkClick(e, item.id)}
              className={`block transition-all duration-150 leading-relaxed ${
                item.level === 3 ? "pl-3 text-[11px]" : "pl-0 font-medium"
              } ${
                activeId === item.id
                  ? "text-accent font-bold translate-x-1"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
