import React from "react";

interface PreviewBannerProps {
  exitUrl: string;
}

export function PreviewBanner({ exitUrl }: PreviewBannerProps) {
  return (
    <aside
      className="sticky top-16 z-50 flex items-center justify-between border-b border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-900 shadow-xs dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200"
      aria-label="Preview mode banner"
    >
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
        <span>
          <strong>Draft Preview Mode Active</strong> — Viewing unpublished editorial draft content.
        </span>
      </div>

      <a
        href={`/api/exit-preview?url=${encodeURIComponent(exitUrl)}`}
        className="rounded-md border border-amber-400 bg-amber-200 px-3 py-1 font-bold text-amber-950 transition-colors hover:bg-amber-300 dark:border-amber-600 dark:bg-amber-900 dark:text-amber-100 dark:hover:bg-amber-800"
      >
        Exit Preview ✕
      </a>
    </aside>
  );
}
