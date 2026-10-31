"use client";

import React, { useState } from "react";

interface HeroCopyButtonProps {
  email: string;
}

export function HeroCopyButton({ email }: HeroCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopyEmail}
      className={`group relative inline-flex items-center gap-2.5 sm:gap-3 rounded-full border bg-card/90 px-3.5 sm:px-4 py-2.5 text-xs font-mono max-w-full transition-all duration-300 hover:border-accent hover:shadow-xl hover:shadow-accent/15 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden ${
        copied
          ? "border-emerald-500/60 ring-2 ring-emerald-500/20"
          : "border-border hover:border-accent"
      }`}
      title="Click to copy email address (⌘C)"
      aria-label="Copy direct email address"
    >
      {/* Subtle Hover Shimmer Beam */}
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        aria-hidden="true"
      />

      {/* Left Animated Icon Circle */}
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
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
            aria-hidden="true"
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
            aria-hidden="true"
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
      <span className="font-semibold text-foreground tracking-tight transition-colors group-hover:text-accent truncate max-w-[150px] xs:max-w-[180px] sm:max-w-none">
        {email}
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
  );
}
