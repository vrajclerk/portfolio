"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import type { Project, Tag } from "@/payload-types";
import { ProjectCard } from "@/components/ProjectCard";
import { EmptyState } from "@/components/EmptyState";

interface ProjectsFilterGridProps {
  initialProjects: Project[];
  initialType?: string;
}

const FILTER_TABS = [
  { label: "All Projects", value: "all" },
  { label: "Professional", value: "professional" },
  { label: "Personal", value: "personal" },
  { label: "Open Source", value: "open-source" },
  { label: "Experiments", value: "experiment" },
];

export function ProjectsFilterGrid({
  initialProjects,
  initialType = "all",
}: ProjectsFilterGridProps) {
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global shortcut '/' to focus search input
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
    if (selectedType && selectedType !== "all") {
      params.set("type", selectedType);
    }
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }
    const queryStr = params.toString();
    const newUrl = queryStr ? `/projects?${queryStr}` : "/projects";
    window.history.replaceState(null, "", newUrl);
  }, [selectedType, searchQuery]);

  // Instant in-memory filter across title, summary, role, technologies
  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return initialProjects.filter((project) => {
      // 1. Type filter
      if (selectedType !== "all" && project.projectType !== selectedType) {
        return false;
      }

      // 2. Search query filter
      if (!query) return true;

      const titleMatch = project.title.toLowerCase().includes(query);
      const summaryMatch = (project.summary || "").toLowerCase().includes(query);
      const roleMatch = (project.role || "").toLowerCase().includes(query);

      const tagMatch = Array.isArray(project.technologies)
        ? project.technologies.some((tech) => {
            if (typeof tech === "object" && tech !== null && "name" in tech) {
              return (tech as Tag).name.toLowerCase().includes(query);
            }
            return false;
          })
        : false;

      return titleMatch || summaryMatch || roleMatch || tagMatch;
    });
  }, [initialProjects, selectedType, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border">
        {/* Horizontal Scrollable Tabs with Hidden Scrollbars (Mobile-Ergonomic) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none [mask-image:linear-gradient(to_right,black_90%,transparent_100%)] md:[mask-image:none]">
          {FILTER_TABS.map((tab) => {
            const isActive = selectedType === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setSelectedType(tab.value)}
                className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-foreground text-background font-bold shadow-xs scale-102"
                    : "border border-border/70 bg-card/60 text-muted-foreground hover:border-accent hover:text-foreground hover:bg-card"
                }`}
              >
                {tab.label}
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
            placeholder="Search projects or technologies..."
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
          Showing <span className="font-bold text-foreground">{filteredProjects.length}</span> of{" "}
          <span>{initialProjects.length}</span> case studies
        </div>
        {(selectedType !== "all" || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedType("all");
              setSearchQuery("");
            }}
            className="text-accent hover:underline cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Project Grid / Empty State */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {filteredProjects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No matching case studies"
          description={`No projects found matching "${searchQuery || selectedType}". Try adjusting your keywords or filter.`}
          actionLabel="Clear all filters"
          onAction={() => {
            setSelectedType("all");
            setSearchQuery("");
          }}
        />
      )}
    </div>
  );
}

