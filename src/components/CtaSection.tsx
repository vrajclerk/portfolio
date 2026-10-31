import React from "react";
import Link from "next/link";
import { CtaCopyButton } from "@/components/CtaCopyButton";

interface CtaSectionProps {
  email?: string;
  headline?: string;
  subheadline?: string;
}

export function CtaSection({
  email = "vrajclerk04@gmail.com",
  headline = "Looking for a full-time software engineer?",
  subheadline = "I am actively interviewing for full-time Software Engineer roles. Ready to bring production backend experience in Python, FastAPI, AWS, and scalable distributed systems to your engineering team.",
}: CtaSectionProps) {

  return (
    <section className="relative mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 my-16 sm:my-24">
      {/* Outer Card with Conic Rotating Border Beam & Multi-Layer Depth */}
      <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden p-6 sm:p-12 lg:p-16 border border-border/80 dark:border-white/10 shadow-2xl backdrop-blur-2xl transition-all duration-300">
        {/* Background Layer 1: Technical Grid Mesh */}
        <div
          aria-hidden="true"
          className="bg-grid-pattern absolute inset-0 opacity-60 dark:opacity-40 pointer-events-none -z-30"
        />

        {/* Background Layer 2: Dual Animated Aurora Orbs */}
        <div
          aria-hidden="true"
          className="absolute -top-[25%] -left-[10%] w-[450px] h-[450px] rounded-full bg-accent/20 dark:bg-accent/25 blur-[70px] pointer-events-none -z-20 animate-aurora"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-[25%] -right-[10%] w-[420px] h-[420px] rounded-full bg-sky-400/15 dark:bg-amber-500/15 blur-[70px] pointer-events-none -z-20 animate-aurora [animation-delay:4s]"
        />

        {/* Background Layer 3: Continuous Conic Rotating Border Beam */}
        <div
          aria-hidden="true"
          className="absolute -top-[150%] -left-[50%] w-[200%] h-[400%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_280deg,var(--accent)_320deg,#38BDF8_345deg,transparent_360deg)] animate-border-beam pointer-events-none -z-10 opacity-70 dark:opacity-85"
        />

        {/* Background Layer 4: Crisp Inner Glass Surface */}
        <div
          aria-hidden="true"
          className="absolute inset-[1.5px] rounded-[30px] sm:rounded-[34px] bg-card/90 dark:bg-[#12161D]/92 backdrop-blur-2xl pointer-events-none -z-10"
        />

        {/* Main Content Body */}
        <div className="relative mx-auto max-w-2xl text-center z-10">
          {/* Eyebrow Status */}
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-5">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span>Open for Full-Time Engineering Roles</span>
          </div>

          {/* Headline with Fraunces Serif Italic Accent */}
          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight text-foreground leading-[1.12] text-balance">
            Looking to expand your{" "}
            <span className="font-serif italic font-normal text-accent underline decoration-accent/30 underline-offset-8">
              engineering team?
            </span>
          </h2>

          {/* Subheadline Narrative */}
          <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground text-balance">
            {subheadline}
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {/* Primary Action: Discuss an Open Role */}
            <Link
              href="/contact"
              className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 sm:px-8 py-3.5 text-sm font-bold text-accent-foreground shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-accent/30 active:scale-[0.98] overflow-hidden text-center"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 w-3/5 h-full bg-linear-to-r from-transparent via-white/35 to-transparent -skew-x-20 animate-shimmer-sweep pointer-events-none"
              />
              <span>Discuss an Engineering Role</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>

            {/* Secondary Action: View Resume & Background */}
            <Link
              href="/resume"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border/80 dark:border-white/15 bg-card/80 dark:bg-card/40 px-5 sm:px-7 py-3.5 text-sm font-semibold text-foreground shadow-xs transition-all duration-200 hover:border-accent hover:text-accent hover:bg-accent/5 hover:-translate-y-0.5 text-center"
            >
              <span>View Full Resume</span>
              <span className="text-muted-foreground text-xs">↗</span>
            </Link>
          </div>

          {/* Embedded Interactive Quick Email Copy Chip */}
          <div className="mt-6 flex justify-center">
            <CtaCopyButton email={email} />
          </div>

          {/* Bottom Trust & Telemetry Matrix */}
          <div className="mt-10 pt-6 border-t border-border/60 dark:border-white/10 flex flex-wrap items-center justify-center gap-3 sm:gap-6 font-mono text-[11px] text-muted-foreground text-center">
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>
                Target Role: <strong className="text-foreground">Full-Stack / Backend Engineer</strong>
              </span>
            </div>
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>
                Availability: <strong className="text-foreground">Immediate / Ready to Join</strong>
              </span>
            </div>
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>
                Location: <strong className="text-foreground">Surat, IN • Open to Relocation</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
