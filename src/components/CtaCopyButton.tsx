"use client";

import React, { useState } from "react";

interface CtaCopyButtonProps {
  email: string;
}

export function CtaCopyButton({ email }: CtaCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
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
      onClick={handleCopy}
      className={`group inline-flex items-center gap-2.5 rounded-full border px-4 py-2 font-mono text-xs transition-all duration-200 cursor-pointer shadow-xs ${
        copied
          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "border-border/80 bg-muted/60 dark:bg-card/60 text-foreground hover:border-accent hover:bg-card hover:-translate-y-0.5"
      }`}
      title="Click to copy email address"
      aria-label="Copy direct email address"
    >
      <span className="text-sm">✉</span>
      <span className="font-semibold">{email}</span>
      <span
        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase transition-colors ${
          copied
            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300"
            : "bg-muted text-muted-foreground border border-border/60 group-hover:bg-accent/15 group-hover:text-accent"
        }`}
      >
        {copied ? "✓ Copied" : "⌘C Copy"}
      </span>
    </button>
  );
}
