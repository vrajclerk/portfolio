import React from "react";

export type BadgeVariant =
  | "default"
  | "professional"
  | "personal"
  | "open-source"
  | "experiment"
  | "outline";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-muted text-muted-foreground border-border",
  professional:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
  personal:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
  "open-source":
    "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
  experiment:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
  outline:
    "bg-transparent text-foreground border-border hover:bg-muted/50",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const styles = variantStyles[variant] || variantStyles.default;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${styles} ${className}`}
    >
      {children}
    </span>
  );
}
