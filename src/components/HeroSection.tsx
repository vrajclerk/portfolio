"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface HeroMetric {
  value: string;
  label: string;
  isAccent?: boolean;
}

interface HeroSectionProps {
  headline?: string | null;
  subheadline?: string | null;
  avatarUrl?: string | null;
  email?: string | null;
  metrics?: HeroMetric[] | null;
}

/**
 * Parses and formats any headline to include modern typographic hierarchy:
 * First words in bold sans-serif, and final key phrase in serif italic accent with a subtle accent underline.
 */
function renderStyledHeadline(text?: string | null) {
  if (!text) {
    return (
      <>
        Systems built to{" "}
        <span className="font-serif italic font-normal text-accent underline decoration-accent/40 decoration-wavy underline-offset-8 inline-block animate-pulse-subtle">
          scale.
        </span>
      </>
    );
  }

  const clean = text.trim();
  const words = clean.split(/\s+/);

  if (words.length > 1) {
    const lastWord = words.pop()!;
    const leading = words.join(" ");
    return (
      <>
        {leading}{" "}
        <span className="font-serif italic font-normal text-accent underline decoration-accent/40 decoration-wavy underline-offset-8 inline-block">
          {lastWord.endsWith(".") ? lastWord : `${lastWord}.`}
        </span>
      </>
    );
  }

  return clean.endsWith(".") ? clean : `${clean}.`;
}

/**
 * Intelligent keyword highlighter that transforms walls of text into
 * an editorial, high-contrast engineering narrative.
 */
function renderHighlightedNarrative(text?: string | null) {
  const content =
    text ||
    "I build resilient cloud-native web applications, persistent PostgreSQL architectures, and autonomous self-hosted pipelines. Focused on clean system design, sub-45ms dynamic response times, and zero-cost cloud reliability.";

  const keywords = [
    "TypeScript",
    "PostgreSQL",
    "Next.js",
    "cloud-native web applications",
    "PostgreSQL architectures",
    "server-rendered architectures",
    "sub-45ms",
    "zero-cost",
    "evidence-based engineering",
    "operational efficiency",
  ];

  const regex = new RegExp(
    `(${keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi"
  );

  const parts = content.split(regex);

  return parts.map((part, i) => {
    const lower = part.toLowerCase();
    if (lower === "sub-45ms" || lower === "zero-cost") {
      return (
        <span
          key={i}
          className="font-mono font-bold text-accent px-1.5 py-0.5 rounded-md bg-accent/10 border border-accent/20"
        >
          {part}
        </span>
      );
    }
    if (
      lower === "postgresql" ||
      lower === "typescript" ||
      lower === "next.js" ||
      lower === "postgresql architectures"
    ) {
      return (
        <span
          key={i}
          className="font-semibold text-accent underline decoration-accent/30 decoration-1 underline-offset-4"
        >
          {part}
        </span>
      );
    }
    if (
      lower === "cloud-native web applications" ||
      lower === "server-rendered architectures" ||
      lower === "evidence-based engineering" ||
      lower === "operational efficiency"
    ) {
      return (
        <span key={i} className="font-semibold text-foreground">
          {part}
        </span>
      );
    }
    return part;
  });
}

export function HeroSection({
  headline,
  subheadline,
  avatarUrl,
  email,
  metrics,
}: HeroSectionProps) {
  const [copied, setCopied] = useState(false);
  const displayEmail = email || "vrajclerk.dev@gmail.com";

  const defaultMetrics: HeroMetric[] = [
    { value: "99.9%", label: "SLA Availability" },
    { value: "< 45ms", label: "Dynamic Edge TTFB" },
    { value: "$0.00", label: "Monthly Cloud Cost", isAccent: true },
  ];

  const activeMetrics = metrics && metrics.length > 0 ? metrics : defaultMetrics;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(displayEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
      {/* ---------------------------------------------------------------------
       * Dynamic Lighting & Ambient Aurora Atmosphere
       * --------------------------------------------------------------------- */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-pattern opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        aria-hidden="true"
      />
      
      {/* Breathing Accent Aurora Orb behind Hero */}
      <div
        className="animate-aurora pointer-events-none absolute -top-12 left-1/4 -z-10 h-96 w-[520px] rounded-full bg-accent/15 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="animate-float pointer-events-none absolute top-40 right-10 -z-10 h-72 w-80 rounded-full bg-accent/8 blur-[100px]"
        aria-hidden="true"
      />

      {/* Floating Architecture Ambient Chips */}
      <div
        className="animate-float pointer-events-none absolute top-8 left-8 hidden lg:inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3.5 py-1 text-[11px] font-mono text-muted-foreground/70 backdrop-blur-md shadow-xs opacity-60 hover:opacity-100 transition-opacity"
        aria-hidden="true"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
        <span>runtime: Node.js 22 • Next.js 16</span>
      </div>

      <div
        className="animate-float-slow pointer-events-none absolute bottom-12 right-12 hidden lg:inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3.5 py-1 text-[11px] font-mono text-muted-foreground/70 backdrop-blur-md shadow-xs opacity-60 hover:opacity-100 transition-opacity"
        aria-hidden="true"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span>database: PostgreSQL • connection-pooled</span>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-center">
          
          {/* ===================================================================
           * LEFT COLUMN: High-Authority Editorial Lead (7 Columns)
           * =================================================================== */}
          <div className="lg:col-span-7 text-left">
            
            {/* Eyebrow / Kicker Pill with Live Beacon */}
            <div className="animate-fade-in-up group relative inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-mono font-medium text-foreground shadow-xs transition-all duration-300 hover:border-accent hover:shadow-accent/15 overflow-hidden">
              <span
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
                aria-hidden="true"
              />
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="animate-radar absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30" />
              </span>
              <span className="tracking-wider uppercase font-bold text-accent">
                Full-Stack & Backend Architect
              </span>
              <span className="text-accent/30 font-bold">/</span>
              <span className="text-muted-foreground font-semibold">SURAT, IN</span>
            </div>

            {/* Stylized Display Headline */}
            <h1 className="animate-fade-in-up delay-100 mt-6 text-4xl sm:text-5xl lg:text-[62px] font-extrabold tracking-tight text-foreground leading-[1.06] text-balance">
              {renderStyledHeadline(headline)}
            </h1>

            {/* Impact Narrative with Smart Highlights */}
            <p className="animate-fade-in-up delay-200 mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-xl text-balance">
              {renderHighlightedNarrative(subheadline)}
            </p>

            {/* Action Buttons & Bespoke Copy Email Chip */}
            <div className="animate-fade-in-up delay-300 mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              
              {/* Primary CTA Button with Shimmer Sweep */}
              <Link
                href="/projects"
                className="group relative inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-accent-foreground shadow-md transition-all duration-300 hover:brightness-110 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
              >
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                  aria-hidden="true"
                />
                <span>Explore Case Studies</span>
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              {/* Secondary CTA: Resume */}
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-accent hover:text-accent hover:bg-accent/5 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>View Resume</span>
                <svg
                  className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-hover:text-accent group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </Link>

              {/* -------------------------------------------------------------
               * Bespoke Interactive Copy Email Chip (Redesigned)
               * Features animated icon, keyboard shortcut chip, and copied feedback
               * ------------------------------------------------------------- */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className={`group relative inline-flex items-center gap-3 rounded-full border bg-card/90 px-4 py-2.5 text-xs font-mono transition-all duration-300 hover:border-accent hover:shadow-xl hover:shadow-accent/15 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden ${
                  copied
                    ? "border-emerald-500/60 ring-2 ring-emerald-500/20"
                    : "border-border hover:border-accent"
                }`}
                title="Click to copy email address (⌘C)"
              >
                {/* Subtle Hover Shimmer Beam */}
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                  aria-hidden="true"
                />

                {/* Left Animated Icon Circle */}
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 ${
                    copied
                      ? "bg-emerald-500 text-white scale-110"
                      : "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground group-hover:scale-105"
                  }`}
                >
                  {copied ? (
                    <svg
                      className="h-3.5 w-3.5 animate-fade-in"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <svg
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.483-.04 1.258-.04 2.024-.04h.5c.766 0 1.54.001 2.024.04 1.131.094 1.976 1.057 1.976 2.192V7.5m-8.5 0h8.5m-8.5 0A2.25 2.25 0 0 0 5.25 9.75v9A2.25 2.25 0 0 0 7.5 21h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25"
                      />
                    </svg>
                  )}
                </span>

                {/* Email Address */}
                <span className="font-semibold text-foreground tracking-tight transition-colors group-hover:text-accent">
                  {displayEmail}
                </span>

                {/* Interactive Status / Shortcut Chip */}
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                    copied
                      ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 animate-fade-in"
                      : "bg-muted text-muted-foreground border border-border/70 group-hover:bg-accent/15 group-hover:text-accent group-hover:border-accent/40"
                  }`}
                >
                  {copied ? (
                    <>
                      <span>✓</span>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <span className="opacity-60 text-[9px]">⌘C</span>
                      <span>Copy</span>
                    </>
                  )}
                </span>
              </button>
            </div>

          </div>

          {/* ===================================================================
           * RIGHT COLUMN: Visual Anchor Frame & Floating Metric Card (5 Columns)
           * =================================================================== */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative mx-auto max-w-[380px] sm:max-w-[420px] lg:max-w-none">
              
              {/* Primary Visual Plate (Photo or Architectural Identity Frame) */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-2xl transition-all duration-300 hover:shadow-accent/10">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Vraj Clerk"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
                    className="object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
                    priority
                  />
                ) : (
                  /* Refined Architectural Identity Canvas */
                  <div className="flex h-full w-full flex-col justify-between p-6 sm:p-8 bg-gradient-to-br from-card via-muted/60 to-background text-left">
                    <div className="flex items-center justify-between border-b border-border/80 pb-4">
                      <div className="font-bold text-sm tracking-tight text-foreground flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                        <span>Vraj Clerk</span>
                      </div>
                      <span className="font-mono text-[10px] uppercase font-bold text-accent bg-accent/10 px-2.5 py-0.5 rounded-full border border-accent/20">
                        sys.online
                      </span>
                    </div>

                    {/* Centered Identity Plate */}
                    <div className="my-auto py-6 flex flex-col items-start gap-3">
                      <div className="h-16 w-16 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center font-mono text-2xl font-extrabold shadow-lg shadow-accent/25 transition-transform duration-300 hover:scale-105">
                        VC
                      </div>
                      <div>
                        <div className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                          Full-Stack Engineer
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground font-mono mt-1 flex items-center gap-1.5 flex-wrap">
                          <span className="text-accent font-bold">TypeScript</span>
                          <span className="text-border">•</span>
                          <span>Next.js</span>
                          <span className="text-border">•</span>
                          <span className="text-accent font-bold">PostgreSQL</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border/80 pt-3 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                      <span>status: available for roles</span>
                      <span className="text-accent font-bold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        LIVE
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ---------------------------------------------------------------
               * FLOATING PROOF CARD (Overlapping Bottom-Left Badge with HUD Float)
               * --------------------------------------------------------------- */}
              <div className="animate-float-slow absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-8 z-20 w-[200px] sm:w-[220px] rounded-2xl border border-border bg-[var(--badge-bg)] text-[var(--badge-fg)] p-5 sm:p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="space-y-4 text-left font-mono">
                  {activeMetrics.map((m, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <div className="h-px w-full bg-[var(--border)] opacity-60" />}
                      <div>
                        <div
                          className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${
                            m.isAccent || idx === activeMetrics.length - 1
                              ? "text-[var(--badge-accent)]"
                              : "text-[var(--badge-fg)]"
                          }`}
                        >
                          {m.value}
                        </div>
                        <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--badge-muted)]">
                          {m.label}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
