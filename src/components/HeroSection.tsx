"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  headline?: string | null;
  subheadline?: string | null;
  avatarUrl?: string | null;
}

export function HeroSection({
  headline,
  subheadline,
  avatarUrl,
}: HeroSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("vrajclerk@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-16 md:pt-10 md:pb-24">
      {/* Subtle Background Lighting & Technical Grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-pattern opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        aria-hidden="true"
      />
      <div
        className="animate-float pointer-events-none absolute top-12 left-1/4 -z-10 h-72 w-96 rounded-full bg-accent/8 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-center">
          
          {/* ===================================================================
           * LEFT COLUMN: High-Authority Editorial Lead (7 Columns)
           * =================================================================== */}
          <div className="lg:col-span-7 text-left">
            
            {/* Eyebrow / Kicker */}
            <div className="animate-fade-in-up inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card/80 px-4 py-1.5 text-xs font-mono font-medium text-muted-foreground shadow-xs backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-radar absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
              </span>
              <span className="tracking-wider uppercase">Full-Stack & Backend Architect</span>
              <span className="text-border">/</span>
              <span className="text-muted-foreground/80">SURAT, IN</span>
            </div>

            {/* Display Headline */}
            <h1 className="animate-fade-in-up delay-100 mt-6 text-4xl sm:text-5xl lg:text-[62px] font-extrabold tracking-tight text-foreground leading-[1.06] text-balance">
              {headline ? (
                headline.endsWith(".") ? headline : `${headline}.`
              ) : (
                <>
                  Systems built to{" "}
                  <span className="font-serif italic font-normal text-accent">
                    scale.
                  </span>
                </>
              )}
            </h1>

            {/* Impact Narrative */}
            <p className="animate-fade-in-up delay-200 mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-xl text-balance">
              {subheadline ||
                "I build resilient cloud-native web applications, persistent PostgreSQL architectures, and autonomous self-hosted pipelines. Focused on clean system design, sub-45ms dynamic response times, and zero-cost cloud reliability."}
            </p>

            {/* Action Buttons */}
            <div className="animate-fade-in-up delay-300 mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background shadow-xs transition-all duration-200 hover:opacity-90 hover:shadow-md hover:-translate-y-0.5"
              >
                <span>Explore Case Studies</span>
                <svg
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              <Link
                href="/resume"
                className="inline-flex items-center rounded-full border border-border/80 bg-card/80 px-7 py-3.5 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-muted hover:border-foreground/30 hover:-translate-y-0.5 backdrop-blur-xs"
              >
                View Resume
              </Link>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 rounded-full border border-dashed border-border/80 px-5 py-3 text-xs font-mono font-medium text-muted-foreground transition-all hover:text-foreground hover:border-foreground/40 hover:bg-card/60"
                title="Click to copy email address"
              >
                {copied ? (
                  <>
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.483-.04 1.258-.04 2.024-.04h.5c.766 0 1.54.001 2.024.04 1.131.094 1.976 1.057 1.976 2.192V7.5m-8.5 0h8.5m-8.5 0A2.25 2.25 0 0 0 5.25 9.75v9A2.25 2.25 0 0 0 7.5 21h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25" />
                    </svg>
                    <span>vrajclerk@gmail.com</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* ===================================================================
           * RIGHT COLUMN: Visual Anchor Frame & Floating Metric Card (5 Columns)
           * =================================================================== */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-[380px] sm:max-w-[420px] lg:max-w-none">
              
              {/* Primary Visual Plate (Photo or Architectural Telemetry Frame) */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-card to-muted/40 shadow-xl backdrop-blur-md">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Vraj Clerk"
                    fill
                    className="object-cover object-center grayscale contrast-105 hover:grayscale-0 transition-all duration-500"
                    priority
                  />
                ) : (
                  /* Elegant Architectural Fallback Canvas */
                  <div className="flex h-full w-full flex-col justify-between p-6 sm:p-8 bg-gradient-to-br from-card/90 via-muted/50 to-background/90 text-left">
                    <div className="flex items-center justify-between border-b border-border/50 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background font-mono text-xs font-bold">
                          VC
                        </span>
                        <span className="font-semibold text-xs tracking-tight">Vraj Clerk</span>
                      </div>
                      <span className="font-mono text-[10px] uppercase text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                        sys.online
                      </span>
                    </div>

                    {/* Monospace Code Telemetry Snippet */}
                    <div className="space-y-3 font-mono text-xs text-muted-foreground my-auto py-6">
                      <p className="text-foreground/90 font-semibold">
                        {"// Core Stack & Architecture"}
                      </p>
                      <div className="rounded-xl bg-background/80 p-3.5 border border-border/40 text-[11.5px] leading-relaxed text-muted-foreground space-y-1">
                        <div><span className="text-accent">runtime</span>: Next.js App Router (Node.js)</div>
                        <div><span className="text-accent">database</span>: PostgreSQL + Connection Pool</div>
                        <div><span className="text-accent">infra</span>: Caddy TLS + Systemd (Zero-Cost)</div>
                      </div>
                      <p className="text-[11px] text-muted-foreground/75">
                        &gt; 99.9% uptime across production runs.
                      </p>
                    </div>

                    <div className="border-t border-border/50 pt-3 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                      <span>status: open for roles</span>
                      <span className="text-accent">● live</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ---------------------------------------------------------------
               * FLOATING PROOF CARD (Overlapping Bottom-Left Badge)
               * The signature element from your inspiration reference!
               * --------------------------------------------------------------- */}
              <div className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-8 z-20 w-[200px] sm:w-[220px] rounded-2xl border border-border/90 bg-card p-5 sm:p-6 shadow-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-accent/10">
                <div className="space-y-4 text-left font-mono">
                  
                  {/* Metric 01 */}
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-sans">
                      99.9%
                    </div>
                    <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      SLA Availability
                    </div>
                  </div>

                  <div className="h-px w-full bg-border/60" />

                  {/* Metric 02 */}
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-sans">
                      &lt; 45ms
                    </div>
                    <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Dynamic Edge TTFB
                    </div>
                  </div>

                  <div className="h-px w-full bg-border/60" />

                  {/* Metric 03 */}
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-accent font-sans">
                      $0.00
                    </div>
                    <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Monthly Cloud Cost
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
