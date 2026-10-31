"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";

interface HeaderProps {
  siteName?: string;
}

const navItems = [
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Resume", href: "/resume" },
];

export function Header({ siteName = "Vraj Clerk" }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-3 sm:top-5 z-40 w-full px-3 sm:px-6 pointer-events-none animate-dock-entrance">
      <div className="relative mx-auto max-w-5xl">
        {/* Ambient Pulsing Aurora Halo */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[130%] rounded-full bg-accent/20 dark:bg-accent/25 blur-2xl pointer-events-none -z-10 animate-aurora"
        />

        {/* Floating Capsule Dock */}
        <div className="pointer-events-auto relative rounded-full bg-card/90 dark:bg-[#12161D]/90 backdrop-blur-2xl border border-border/80 dark:border-white/10 shadow-lg dark:shadow-2xl px-3 sm:px-4 py-2 flex items-center justify-between overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-dock-float">
          {/* Continuous Rotating Border Beam */}
          <div
            aria-hidden="true"
            className="absolute -top-[150%] -left-[50%] w-[200%] h-[400%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_280deg,var(--accent)_320deg,#38BDF8_345deg,transparent_360deg)] animate-border-beam pointer-events-none -z-1 opacity-60 dark:opacity-75"
          />
          {/* Inner Crisp Surface Mask */}
          <div
            aria-hidden="true"
            className="absolute inset-[1.5px] rounded-full bg-card/95 dark:bg-[#12161D]/95 backdrop-blur-2xl pointer-events-none -z-1"
          />

          {/* Left: Brand with Monogram & Live Status Indicator */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 sm:gap-3 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Home"
          >
            {/* Tactile Logo Brand Icon with 3D spring tilt */}
            <span className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
              <Logo size={36} />
            </span>

            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-foreground transition-colors group-hover:text-accent">
                {siteName}
              </span>
            </div>
          </Link>

          {/* Center: Segmented Navigation */}
          <nav
            className="hidden md:flex items-center gap-1 rounded-full bg-muted/60 dark:bg-muted/40 p-1 border border-border/60 dark:border-white/10 shadow-inner"
            aria-label="Main Navigation"
          >
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-card dark:bg-card text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot"
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Quick CTA & Appearance Controls */}
          <div className="flex items-center gap-2">
            {/* Quick "Let's Talk →" CTA pill */}
            <Link
              href="/contact"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-accent-foreground shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all group overflow-hidden relative"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 w-3/5 h-full bg-linear-to-r from-transparent via-white/35 to-transparent -skew-x-20 animate-shimmer-sweep pointer-events-none"
              />
              <span>Let&apos;s Talk</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>

            {/* Theme Toggle Button with hover spin */}
            <ThemeToggle className="ml-0.5 transition-transform duration-300 hover:rotate-180 hover:scale-105" />

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 dark:border-white/10 text-muted-foreground md:hidden hover:text-foreground hover:bg-muted/60 transition-colors focus:outline-hidden"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto mt-2 rounded-2xl border border-border/80 dark:border-white/10 bg-card/95 dark:bg-[#12161D]/95 backdrop-blur-2xl p-4 shadow-xl md:hidden animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-2" aria-label="Mobile Navigation">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-accent/10 text-accent font-bold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                  </Link>
                );
              })}
              <div className="flex items-center justify-between pt-3 border-t border-border/50 px-2 mt-2">
                <span className="text-xs font-medium text-muted-foreground">Appearance</span>
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
