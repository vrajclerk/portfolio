"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

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
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 font-bold tracking-tight text-foreground transition-opacity hover:opacity-85"
          aria-label="Home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background font-mono text-xs font-bold shadow-xs">
            VC
          </span>
          <span className="font-semibold text-base tracking-tight">{siteName}</span>
        </Link>

        {/* Desktop Navigation & Actions */}
        <div className="hidden md:flex items-center gap-2">
          <nav className="flex items-center gap-1 rounded-full bg-muted/50 p-1 border border-border/40" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-background text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle Button (Controlled via NEXT_PUBLIC_ENABLE_THEME_TOGGLE) */}
          <ThemeToggle className="ml-1" />
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground md:hidden hover:text-foreground hover:bg-muted focus:outline-hidden"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background px-4 py-4 md:hidden animate-in slide-in-from-top-2">
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
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-muted text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="flex items-center justify-between pt-2 border-t border-border/50 px-2">
              <span className="text-xs text-muted-foreground">Appearance</span>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
