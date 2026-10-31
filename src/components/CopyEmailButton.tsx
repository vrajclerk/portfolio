"use client";

import React, { useState } from "react";

interface CopyEmailButtonProps {
  email: string;
  className?: string;
  showShortcut?: boolean;
}

export function CopyEmailButton({
  email,
  className = "",
  showShortcut = true,
}: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`group relative inline-flex items-center gap-2.5 rounded-full border px-4 py-2 font-mono text-xs transition-all duration-200 cursor-pointer shadow-xs overflow-hidden ${
        copied
          ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20"
          : "border-border/80 bg-card hover:border-accent hover:bg-card hover:-translate-y-0.5 text-foreground"
      } ${className}`}
      title="Click to copy email address (⌘C)"
      aria-label={`Copy email address ${email}`}
    >
      {/* Subtle Shimmer Sweep */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />

      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full transition-transform duration-200 ${
          copied ? "bg-emerald-500 text-white scale-110" : "text-accent group-hover:scale-110"
        }`}
      >
        {copied ? (
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ) : (
          <span className="text-xs">✉</span>
        )}
      </span>

      <span className="font-semibold tracking-tight">{email}</span>

      {showShortcut && (
        <span
          className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase transition-colors ${
            copied
              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300"
              : "bg-muted text-muted-foreground border border-border/60 group-hover:bg-accent/15 group-hover:text-accent"
          }`}
        >
          {copied ? "✓ Copied" : "⌘C Copy"}
        </span>
      )}
    </button>
  );
}
