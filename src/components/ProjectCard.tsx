import React from "react";
import Link from "next/link";
import type { Project, Tag } from "@/payload-types";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

const TYPE_CONFIG = {
  professional: {
    label: "Professional",
    badgeBg: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
    dotColor: "bg-blue-500",
    pingColor: "bg-blue-400",
    auraBg: "group-hover:bg-blue-500/10 dark:group-hover:bg-blue-500/15",
  },
  personal: {
    label: "Personal R&D",
    badgeBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    dotColor: "bg-emerald-500",
    pingColor: "bg-emerald-400",
    auraBg: "group-hover:bg-emerald-500/10 dark:group-hover:bg-emerald-500/15",
  },
  "open-source": {
    label: "Open Source",
    badgeBg: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
    dotColor: "bg-purple-500",
    pingColor: "bg-purple-400",
    auraBg: "group-hover:bg-purple-500/10 dark:group-hover:bg-purple-500/15",
  },
  experiment: {
    label: "Experiment",
    badgeBg: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    dotColor: "bg-amber-500",
    pingColor: "bg-amber-400",
    auraBg: "group-hover:bg-amber-500/10 dark:group-hover:bg-amber-500/15",
  },
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const typeKey = (project.projectType in TYPE_CONFIG
    ? project.projectType
    : "personal") as keyof typeof TYPE_CONFIG;
  const typeInfo = TYPE_CONFIG[typeKey];

  const tags = Array.isArray(project.technologies)
    ? (project.technologies.filter(
        (t): t is Tag => typeof t === "object" && t !== null && "name" in t
      ) as Tag[])
    : [];

  const displayIndex = index !== undefined ? String(index + 1).padStart(2, "0") : null;

  return (
    <article className="group relative flex flex-col justify-between rounded-3xl border border-border/80 dark:border-white/10 bg-card/90 dark:bg-[#131720]/90 p-6 sm:p-7 shadow-xs backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/10 hover:border-accent/60 dark:hover:border-accent/40 overflow-hidden">
      {/* Background Radial Glow */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl transition-all duration-500 ${typeInfo.auraBg} opacity-0 group-hover:opacity-100`}
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
      <div className="relative z-10">
        {/* Header Telemetry Bar */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Beacon & Project Type Pill */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-mono font-bold tracking-tight shadow-xs ${typeInfo.badgeBg}`}
            >
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${typeInfo.pingColor}`} />
                <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${typeInfo.dotColor}`} />
              </span>
              <span>{typeInfo.label}</span>
            </span>

            {/* Role Chip */}
            {project.role && (
              <span className="text-[11px] font-mono text-muted-foreground truncate max-w-[170px] sm:max-w-[200px]">
                {project.role}
              </span>
            )}
          </div>

          {/* Editorial Index or Blueprint Marker */}
          {displayIndex && (
            <span className="font-mono text-xs font-bold text-muted-foreground/50 transition-colors group-hover:text-accent">
              {displayIndex}
            </span>
          )}
        </div>

        {/* Title with Interactive Micro-Arrow */}
        <h3 className="text-xl sm:text-[22px] font-extrabold tracking-tight text-foreground leading-snug transition-colors duration-200 group-hover:text-accent">
          <Link
            href={`/projects/${project.slug}`}
            className="focus:outline-hidden flex items-start justify-between gap-2"
          >
            <span>{project.title}</span>
            <span
              aria-hidden="true"
              className="shrink-0 text-muted-foreground/60 transition-transform duration-300 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 text-base mt-0.5"
            >
              ↗
            </span>
          </Link>
        </h3>

        {/* Summary Description */}
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {project.summary}
        </p>

        {/* Interactive Technology Chips */}
        {tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {tags.slice(0, 5).map((tag, tIdx) => (
              <span
                key={tag.id || tag.name || tIdx}
                className="inline-flex items-center gap-1 rounded-lg bg-muted/70 dark:bg-muted/40 px-2.5 py-1 text-[11px] font-mono font-medium text-foreground/90 border border-border/60 dark:border-white/5 transition-all duration-200 hover:border-accent hover:text-accent hover:bg-card hover:-translate-y-0.5"
              >
                <span className="h-1 w-1 rounded-full bg-accent/60" />
                <span>{tag.name}</span>
              </span>
            ))}
            {tags.length > 5 && (
              <span className="inline-flex items-center rounded-lg bg-muted/40 px-2 py-1 text-[11px] font-mono text-muted-foreground">
                +{tags.length - 5}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Footer Shelf */}
      <div className="relative z-10 mt-6 pt-4 border-t border-border/60 dark:border-white/10 flex items-center justify-between">
        {/* Primary Case Study Link Button */}
        <Link
          href={`/projects/${project.slug}`}
          className="group/btn inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent transition-all duration-200 hover:text-accent/80"
        >
          <span>Explore Case Study</span>
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover/btn:translate-x-1.5"
          >
            →
          </span>
        </Link>

        {/* Secondary External Links (GitHub & Live Demo) */}
        <div className="flex items-center gap-2">
          {project.repositoryUrl && (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 dark:border-white/10 bg-muted/40 text-muted-foreground transition-all duration-200 hover:scale-110 hover:border-accent hover:text-accent hover:bg-card"
              aria-label={`GitHub repository for ${project.title}`}
              title="View Source Code"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 dark:border-white/10 bg-muted/40 text-muted-foreground transition-all duration-200 hover:scale-110 hover:border-accent hover:text-accent hover:bg-card"
              aria-label={`Live demo for ${project.title}`}
              title="Open Live Deployment"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
