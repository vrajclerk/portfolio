import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroCopyButton } from "@/components/HeroCopyButton";

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
    "Building resilient backend services, reusable Python packages, and cloud-native architectures with FastAPI, PostgreSQL, AWS, and OpenSearch. Focused on high-throughput reliability, clean system design, and evidence-based performance.";

  const keywords = [
    "FastAPI",
    "PostgreSQL",
    "AWS",
    "OpenSearch",
    "Python",
    "DynamoDB",
    "Docker",
    "TypeScript",
    "Next.js",
    "reusable Python packages",
    "high-throughput reliability",
    "clean system design",
    "evidence-based performance",
  ];

  const regex = new RegExp(
    `(${keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi"
  );

  const parts = content.split(regex);

  return parts.map((part, i) => {
    const lower = part.toLowerCase();
    if (
      lower === "fastapi" ||
      lower === "postgresql" ||
      lower === "aws" ||
      lower === "opensearch" ||
      lower === "python" ||
      lower === "dynamodb" ||
      lower === "docker"
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
      lower === "high-throughput reliability" ||
      lower === "clean system design" ||
      lower === "evidence-based performance" ||
      lower === "reusable python packages"
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
  const displayEmail = email || "vrajclerk04@gmail.com";

  const defaultMetrics: HeroMetric[] = [
    { value: "800+", label: "Concurrent Load Tested (Locust)" },
    { value: "< 100ms", label: "Match & Query Latency" },
    { value: "Python & AWS", label: "Cloud & Search Stack", isAccent: true },
  ];

  const activeMetrics = metrics && metrics.length > 0 ? metrics : defaultMetrics;

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 lg:py-20">
      {/* ---------------------------------------------------------------------
       * Fluid Ambient Glows with Hardware Acceleration
       * --------------------------------------------------------------------- */}
      <div
        className="pointer-events-none absolute -top-12 left-1/4 -z-10 h-96 w-[520px] rounded-full bg-accent/12 blur-[100px] will-change-transform"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-40 right-10 -z-10 h-72 w-80 rounded-full bg-accent/6 blur-[80px] will-change-transform"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-center">
          
          {/* ===================================================================
           * LEFT COLUMN: High-Authority Editorial Lead (7 Columns)
           * =================================================================== */}
          <div className="lg:col-span-7 text-left">
            
            {/* Eyebrow / Kicker with Live Beacon */}
            <div className="flex items-center gap-2.5 text-xs font-semibold tracking-wide text-foreground">
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                Available for Full-Time Roles
              </span>
              <span className="text-border dark:text-white/20">•</span>
              <span className="text-muted-foreground font-medium hidden sm:inline">
                Python &amp; Backend Systems Engineer
              </span>
            </div>

            {/* Stylized Display Headline (LCP Candidate - Immediate Visible Paint) */}
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[62px] font-extrabold tracking-tight text-foreground leading-[1.06] text-balance">
              {renderStyledHeadline(headline)}
            </h1>

            {/* Impact Narrative with Smart Highlights */}
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-xl text-balance">
              {renderHighlightedNarrative(subheadline)}
            </p>

            {/* Action Buttons & Bespoke Copy Email Chip */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              
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
                  aria-hidden="true"
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
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </Link>

              {/* Isolated Micro Client Component for Copy Email */}
              <HeroCopyButton email={displayEmail} />
            </div>

          </div>

          {/* ===================================================================
           * RIGHT COLUMN: Visual Anchor Frame & Floating Metric Card (5 Columns)
           * =================================================================== */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative mx-auto max-w-[380px] sm:max-w-[420px] lg:max-w-none">
              
              {/* Primary Visual Plate (Photo or Architectural Identity Frame) */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-2xl transition-all duration-300 hover:shadow-accent/10">

                {(avatarUrl || "/media/IMG_20240306_180503_775.webp") ? (
                  <Image
                    src={avatarUrl || "/media/IMG_20240306_180503_775.webp"}
                    alt="Vraj Clerk"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
                    className="object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
                    priority
                    fetchPriority="high"
                    quality={85}
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
                          Python &amp; Backend Engineer
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground font-mono mt-1 flex items-center gap-1.5 flex-wrap">
                          <span className="text-accent font-bold">FastAPI</span>
                          <span className="text-border">•</span>
                          <span>AWS</span>
                          <span className="text-border">•</span>
                          <span>OpenSearch</span>
                        </div>
                      </div>
                    </div>

                    {/* Verification Metric Footnote */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/70 text-xs font-mono">
                      <span className="text-muted-foreground">Specialization</span>
                      <span className="text-foreground font-bold">Distributed Systems</span>
                    </div>
                  </div>
                )}
              </div>

              {/* -------------------------------------------------------------
               * Dynamic Multi-Metric Dock Card
               * ------------------------------------------------------------- */}
              <div
                className="mt-4 w-full rounded-2xl border border-border/90 bg-card/95 p-4 sm:p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-accent/40"
              >
                <div className="grid grid-cols-3 divide-x divide-border/60 text-center">
                  {activeMetrics.slice(0, 3).map((metric, idx) => (
                    <div key={idx} className="px-2 sm:px-3 first:pl-0 last:pr-0">
                      <div
                        className={`text-base sm:text-xl font-mono font-extrabold tracking-tight ${
                          metric.isAccent ? "text-accent" : "text-foreground"
                        }`}
                      >
                        {metric.value}
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-1 leading-tight line-clamp-2">
                        {metric.label}
                      </div>
                    </div>
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
