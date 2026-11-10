"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import type { SiteSetting } from "@/payload-types";

export interface FooterProps {
  siteSettings?: SiteSetting | null;
  showProjects?: boolean;
  showBlog?: boolean;
}

export function Footer({
  siteSettings,
  showProjects = true,
  showBlog = true,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const siteName = siteSettings?.siteName || "Vraj Clerk";
  const shortSiteName = siteName.split("|")[0].trim() || siteName;
  const publicEmail = siteSettings?.publicEmail || "vrajclerk04@gmail.com";

  // Dynamic real-time IST clock (UTC+5:30) for engineering presence
  const [istTime, setIstTime] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const formatTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(now);
        setIstTime(formatted);
      } catch {
        setIstTime(new Date().toLocaleTimeString());
      }
    };

    formatTime();
    const interval = setInterval(formatTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(publicEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    ...(showProjects ? [{ label: "Projects", href: "/projects" }] : []),
    ...(showBlog ? [{ label: "Blog", href: "/blog" }] : []),
    { label: "Contact", href: "/contact" },
    { label: "Resume", href: "/resume" },
  ];

  const focusAreas = [
    "FastAPI & Python Microservices",
    "AWS Cloud Architecture",
    "OpenSearch & Search Indices",
    "PostgreSQL & DynamoDB",
    "Locust Concurrency Testing",
    "Distributed Systems Resilience",
  ];

  return (
    <footer
      className="relative mt-20 border-t border-border/80 bg-background text-foreground overflow-hidden transition-colors"
      aria-label="Site Footer"
    >
      {/* Ambient Aurora Glow in the footer background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 rounded-full bg-accent/8 blur-[120px] -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 rounded-full bg-sky-400/5 dark:bg-amber-500/5 blur-[100px] -z-10"
      />

      {/* Top Subtle Gradient Beam Line */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 max-w-4xl bg-gradient-to-r from-transparent via-accent/50 to-transparent pointer-events-none"
      />

      <div className="mx-auto max-w-6xl px-4 pt-14 pb-12 sm:px-6 lg:px-8">
        {/* =====================================================================
         * MAIN MULTI-COLUMN GRID (System specs removed)
         * ===================================================================== */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 pb-12 border-b border-border/70">
          
          {/* Column 1: Brand, Tagline, IST Clock & Direct Contact (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-5">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
              aria-label={`${shortSiteName} Home`}
            >
              <span className="flex h-10 w-10 items-center justify-center transition-transform duration-300 group-hover:-rotate-6">
                <Logo size={40} />
              </span>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-foreground transition-colors group-hover:text-accent">
                  {shortSiteName}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Python &amp; Backend Systems Engineer
                </span>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-md text-balance">
              Architecting high-throughput backend services, distributed data pipelines,
              and resilient cloud platforms built with Python, FastAPI, and AWS.
            </p>

            {/* Professional Status Beacon with Dynamic IST Clock */}
            <div className="inline-flex flex-col sm:flex-row sm:items-center gap-2 rounded-2xl border border-border/70 bg-card/60 dark:bg-card/40 px-3.5 py-2 text-xs backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                <span className="font-semibold text-foreground">
                  Active Software Developer
                </span>
              </div>
              <span className="hidden sm:inline text-border dark:text-white/20">•</span>
              <div className="flex items-center gap-1.5 font-mono text-muted-foreground">
                <svg
                  className="h-3.5 w-3.5 text-muted-foreground/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>India (IST)</span>
                {istTime && (
                  <span className="font-bold text-foreground">
                    {istTime}
                  </span>
                )}
              </div>
            </div>

            {/* Interactive Quick Copy Email Pill */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleCopyEmail}
                className={`group relative inline-flex items-center gap-2.5 rounded-full border bg-card/80 px-3.5 py-2 text-xs font-mono transition-all duration-300 hover:border-accent hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 ${
                  copied
                    ? "border-emerald-500/60 ring-2 ring-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : "border-border text-foreground hover:border-accent"
                }`}
                title="Click to copy direct email address"
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full transition-all duration-200 ${
                    copied
                      ? "bg-emerald-500 text-white"
                      : "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground"
                  }`}
                >
                  {copied ? (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                    </svg>
                  )}
                </span>
                <span className="font-medium truncate max-w-[150px] xs:max-w-[180px] sm:max-w-none">{publicEmail}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider pl-1 shrink-0">
                  {copied ? "Copied!" : "Copy"}
                </span>
              </button>
            </div>
          </div>

          {/* Column 2: Navigation Links (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-muted-foreground transition-all duration-200 hover:text-foreground hover:translate-x-1"
                  >
                    <span className="text-accent/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      ›
                    </span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Engineering Focus Areas (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
              Focus Areas
            </h3>
            <ul className="space-y-2.5 text-xs text-muted-foreground leading-relaxed" role="list">
              {focusAreas.map((area, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent/60 shrink-0" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* =====================================================================
         * SOCIAL CHANNELS & PROFILES SHELF
         * ===================================================================== */}
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/60">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span>Connect &amp; Profiles:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {/* GitHub */}
            <a
              href="https://github.com/vrajclerk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3.5 py-1.5 text-xs font-medium text-foreground transition-all duration-200 hover:border-foreground hover:bg-card hover:-translate-y-0.5"
              aria-label="GitHub Profile"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/vrajclerk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3.5 py-1.5 text-xs font-medium text-foreground transition-all duration-200 hover:border-[#0A66C2] hover:text-[#0A66C2] hover:bg-card hover:-translate-y-0.5"
              aria-label="LinkedIn Profile"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6Z" />
              </svg>
              <span>LinkedIn</span>
            </a>

            {/* Resume Link */}
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3.5 py-1.5 text-xs font-medium text-foreground transition-all duration-200 hover:border-accent hover:text-accent hover:bg-card hover:-translate-y-0.5"
              aria-label="Interactive Resume"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span>Resume</span>
            </Link>
          </div>
        </div>

        {/* =====================================================================
         * BOTTOM COLOPHON & BACK TO TOP ACTION
         * ===================================================================== */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>© {currentYear} {shortSiteName}. All rights reserved.</span>
            <span className="hidden sm:inline text-border dark:text-white/20">•</span>
            <span>Crafted for high performance &amp; zero recurring cloud cost.</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Interactive CLI Terminal Trigger */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("terminal-toggle"))}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-3.5 py-1.5 font-mono text-xs font-semibold text-foreground transition-all duration-200 hover:border-accent hover:text-accent hover:bg-card hover:-translate-y-0.5 active:translate-y-0"
              aria-label="Open Interactive CLI Terminal"
            >
              <span className="text-accent font-bold">&gt;_</span>
              <span>CLI</span>
            </button>

            {/* Smooth Back to Top Button */}
            <button
              type="button"
              onClick={handleScrollToTop}
              className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-1.5 font-medium text-foreground transition-all duration-200 hover:border-accent hover:text-accent hover:bg-card hover:-translate-y-0.5 active:translate-y-0"
              aria-label="Back to top of page"
            >
              <span>Back to top</span>
              <svg
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
