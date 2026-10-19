/**
 * Not-found page for the (frontend) route group.
 *
 * Rendered when `notFound()` is called from within a route segment in this group,
 * or when a URL under the frontend routes does not match any page.
 *
 * The root `app/not-found.tsx` (above this layout) handles completely unmatched
 * URLs at the application level.
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you requested could not be found.",
};

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          404
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Page not found
        </h1>
        <p className="max-w-sm text-base text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>

      <Link
        href="/"
        className="inline-flex items-center rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:opacity-90"
      >
        Return home
      </Link>
    </main>
  );
}
