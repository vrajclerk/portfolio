import React from "react";

export interface SkillItem {
  id?: string | null;
  name: string;
  context?: string | null;
}

export interface SkillGroup {
  id?: string | null;
  category: string;
  items: SkillItem[];
}

interface SkillCardProps {
  group: SkillGroup;
  index?: number;
}

interface CategoryConfig {
  tagline: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  auraBg: string;
  renderIcon: () => React.ReactNode;
}

function getCategoryConfig(category: string): CategoryConfig {
  const norm = category.toLowerCase();

  if (norm.includes("language") || norm.includes("core")) {
    return {
      tagline: "Foundational & Scripting Runtimes",
      iconBg: "bg-blue-500/10 dark:bg-blue-400/15",
      iconColor: "text-blue-600 dark:text-blue-400",
      borderColor: "group-hover:border-blue-500/50",
      auraBg: "group-hover:bg-blue-500/10 dark:group-hover:bg-blue-500/15",
      renderIcon: () => (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
      ),
    };
  }

  if (norm.includes("python") || norm.includes("backend")) {
    return {
      tagline: "High-Throughput APIs & Services",
      iconBg: "bg-emerald-500/10 dark:bg-emerald-400/15",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      borderColor: "group-hover:border-emerald-500/50",
      auraBg: "group-hover:bg-emerald-500/10 dark:group-hover:bg-emerald-500/15",
      renderIcon: () => (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
    };
  }

  if (norm.includes("database") || norm.includes("search")) {
    return {
      tagline: "Distributed Storage & Indexing",
      iconBg: "bg-amber-500/10 dark:bg-amber-400/15",
      iconColor: "text-amber-600 dark:text-amber-400",
      borderColor: "group-hover:border-amber-500/50",
      auraBg: "group-hover:bg-amber-500/10 dark:group-hover:bg-amber-500/15",
      renderIcon: () => (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>
      ),
    };
  }

  if (norm.includes("cloud") || norm.includes("devops")) {
    return {
      tagline: "Serverless & Cloud Infrastructure",
      iconBg: "bg-sky-500/10 dark:bg-sky-400/15",
      iconColor: "text-sky-600 dark:text-sky-400",
      borderColor: "group-hover:border-sky-500/50",
      auraBg: "group-hover:bg-sky-500/10 dark:group-hover:bg-sky-500/15",
      renderIcon: () => (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        </svg>
      ),
    };
  }

  if (norm.includes("vision") || norm.includes("learning") || norm.includes("deep")) {
    return {
      tagline: "Neural Pipelines & Segmentation",
      iconBg: "bg-purple-500/10 dark:bg-purple-400/15",
      iconColor: "text-purple-600 dark:text-purple-400",
      borderColor: "group-hover:border-purple-500/50",
      auraBg: "group-hover:bg-purple-500/10 dark:group-hover:bg-purple-500/15",
      renderIcon: () => (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    };
  }

  // Default: System Design & Quality
  return {
    tagline: "Concurrency & Resilience Testing",
    iconBg: "bg-orange-500/10 dark:bg-orange-400/15",
    iconColor: "text-orange-600 dark:text-orange-400",
    borderColor: "group-hover:border-orange-500/50",
    auraBg: "group-hover:bg-orange-500/10 dark:group-hover:bg-orange-500/15",
    renderIcon: () => (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  };
}

export function SkillCard({ group, index }: SkillCardProps) {
  const config = getCategoryConfig(group.category);
  const itemCount = group.items?.length || 0;

  return (
    <article
      className={`group relative flex flex-col justify-between rounded-3xl border border-border/80 dark:border-white/10 bg-card/90 dark:bg-[#131720]/90 p-6 sm:p-7 shadow-xs backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/5 ${config.borderColor} overflow-hidden`}
    >
      {/* Background Radial Ambient Glow on Hover */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl transition-all duration-500 ${config.auraBg} opacity-0 group-hover:opacity-100`}
      />

      {/* Subtle Technical Grid Texture */}
      <div
        aria-hidden="true"
        className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-40"
      />

      {/* Top Conic Gradient Border Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/0 to-transparent transition-all duration-500 group-hover:via-accent"
      />

      <div className="relative z-10">
        {/* Header Pod: Category Icon + Title + Count Badge */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            {/* Category Icon Badge with Micro-Tilt */}
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border/70 dark:border-white/10 ${config.iconBg} ${config.iconColor} shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
            >
              {config.renderIcon()}
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-foreground transition-colors group-hover:text-foreground">
                {group.category}
              </h3>
              <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                {config.tagline}
              </p>
            </div>
          </div>

          {/* Telemetry Counter Badge */}
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-muted/80 dark:bg-muted/50 px-2.5 py-1 font-mono text-[11px] font-bold text-foreground border border-border/60 dark:border-white/10 shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>{itemCount} {itemCount === 1 ? "tool" : "tools"}</span>
          </span>
        </div>

        {/* Crisp Gradient Divider */}
        <div className="h-px w-full bg-gradient-to-r from-border/90 via-border/40 to-transparent mb-5" />

        {/* Skill Items List as Interactive Structured Tiles */}
        <div className="space-y-3">
          {group.items.map((skill, sIdx) => (
            <div
              key={skill.id || skill.name || sIdx}
              className="group/skill rounded-xl border border-transparent p-2.5 -mx-2.5 transition-all duration-200 hover:border-border/60 hover:bg-muted/40 dark:hover:bg-muted/30"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent/70 transition-transform duration-200 group-hover/skill:scale-150 group-hover/skill:bg-accent" />
                  <span className="text-sm font-bold text-foreground tracking-tight transition-colors group-hover/skill:text-accent">
                    {skill.name}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground/60 uppercase opacity-0 transition-opacity duration-200 group-hover/skill:opacity-100">
                  verified
                </span>
              </div>

              {skill.context && (
                <p className="mt-1 pl-3.5 text-xs leading-relaxed text-muted-foreground border-l-2 border-border/50 group-hover/skill:border-accent/60 transition-colors">
                  {skill.context}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Sub-Footnote */}
      <div className="relative z-10 mt-6 pt-3.5 border-t border-border/40 dark:border-white/5 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
          <span>Production Tested</span>
        </span>
        <span className="text-muted-foreground/50">
          {index !== undefined ? `0${index + 1}` : "CAPABILITY"}
        </span>
      </div>
    </article>
  );
}
