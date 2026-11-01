"use client";

import React, { useState } from "react";

type LocationView = "gujarat" | "ahmedabad" | "surat";

const MAP_URLS: Record<LocationView, string> = {
  gujarat: "https://maps.google.com/maps?q=Gujarat,+India&t=&z=7&ie=UTF8&iwloc=&output=embed",
  ahmedabad: "https://maps.google.com/maps?q=Ahmedabad,+Gujarat,+India&t=&z=11&ie=UTF8&iwloc=&output=embed",
  surat: "https://maps.google.com/maps?q=Surat,+Gujarat,+India&t=&z=12&ie=UTF8&iwloc=&output=embed",
};

export function AboutLocationSection() {
  const [activeView, setActiveView] = useState<LocationView>("gujarat");

  return (
    <section className="mb-20 sm:mb-28 pt-8 border-t border-border/80" aria-labelledby="location-heading">
      {/* Section Header */}
      <div className="mb-8 pb-4 border-b border-border">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent flex items-center gap-2 mb-1">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Location &amp; Mobility
        </span>
        <h2 id="location-heading" className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Geographic Base &amp; Engineering Presence
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Operating out of Ahmedabad with foundational roots in Surat, India — open to local, hybrid, and remote engineering roles.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs backdrop-blur-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* LEFT: Google Map with Inside-Map Location Point Signs (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col rounded-2xl border border-border/80 bg-muted/40 overflow-hidden shadow-xs min-h-[440px] sm:min-h-[480px]">
            {/* Map Header Controls */}
            <div className="flex items-center justify-between flex-wrap gap-2 px-4 py-3 bg-card border-b border-border text-xs font-mono">
              <span className="font-bold text-foreground">
                Showing: {activeView === "gujarat" ? "Gujarat" : activeView === "ahmedabad" ? "Ahmedabad" : "Surat"}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveView("gujarat")}
                  className={`rounded-full px-3 py-1 font-semibold transition-all duration-200 cursor-pointer ${
                    activeView === "gujarat"
                      ? "bg-accent text-accent-foreground shadow-xs"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border/60"
                  }`}
                >
                  Gujarat
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView("ahmedabad")}
                  className={`rounded-full px-3 py-1 font-semibold transition-all duration-200 cursor-pointer ${
                    activeView === "ahmedabad"
                      ? "bg-accent text-accent-foreground shadow-xs"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border/60"
                  }`}
                >
                  Ahmedabad
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView("surat")}
                  className={`rounded-full px-3 py-1 font-semibold transition-all duration-200 cursor-pointer ${
                    activeView === "surat"
                      ? "bg-accent text-accent-foreground shadow-xs"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border/60"
                  }`}
                >
                  Surat
                </button>
              </div>
            </div>

            {/* Map Canvas */}
            <div className="relative flex-1 w-full h-full min-h-[380px] sm:min-h-[420px] bg-muted/60 overflow-hidden">
              <iframe
                title="Google Map showing Gujarat, Ahmedabad, and Surat"
                src={MAP_URLS[activeView]}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[380px] sm:min-h-[420px] border-0 block dark:[filter:invert(90%)_hue-rotate(180deg)_contrast(95%)] transition-all duration-300"
                allowFullScreen
              />

              {/* Focus Tag when Zoomed into City */}
              {activeView !== "gujarat" && (
                <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/95 px-3 py-1 font-mono text-xs font-bold text-foreground shadow-md backdrop-blur-md">
                    <span>{activeView === "ahmedabad" ? "💻" : "🏠"}</span>
                    <span>
                      {activeView === "ahmedabad" ? "Ahmedabad: Current Base" : "Surat: Hometown & Native Roots"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Synchronized City Detail Cards (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4 justify-center">
            
            {/* CARD 1: AHMEDABAD (Current Location with Laptop Sign) */}
            <div
              onClick={() => setActiveView("ahmedabad")}
              className={`rounded-2xl border p-5 sm:p-6 transition-all duration-300 cursor-pointer ${
                activeView === "ahmedabad" || activeView === "gujarat"
                  ? "border-accent bg-card shadow-md -translate-y-0.5"
                  : "border-border/80 bg-card/60 hover:border-accent/60 hover:bg-card"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-card border border-border text-base shadow-xs">
                    💻
                  </span>
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    Ahmedabad
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  CURRENT LOCATION
                </span>
              </div>

              <div className="font-mono text-xs text-muted-foreground mb-3">
                Ahmedabad, Gujarat, India
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Where I am currently based, living, and working. Active daily building reliable backend systems, writing production code, and collaborating with engineering teams. Open to local opportunities, hybrid roles, and remote work.
              </p>

              <div className="flex flex-wrap gap-1.5 mt-4">
                <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 font-mono text-[11px] text-foreground border border-border/60">
                  💻 Active Base
                </span>
                <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 font-mono text-[11px] text-foreground border border-border/60">
                  Available for Roles
                </span>
                <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 font-mono text-[11px] text-foreground border border-border/60">
                  IST (UTC+5:30)
                </span>
              </div>

              <a
                href="https://maps.google.com/?q=Ahmedabad,+Gujarat,+India"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-3.5 inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-accent hover:underline"
              >
                <span>Open in Google Maps</span>
                <span>↗</span>
              </a>
            </div>

            {/* CARD 2: SURAT (Hometown with Home Sign) */}
            <div
              onClick={() => setActiveView("surat")}
              className={`rounded-2xl border p-5 sm:p-6 transition-all duration-300 cursor-pointer ${
                activeView === "surat" || activeView === "gujarat"
                  ? "border-emerald-500 bg-card shadow-md -translate-y-0.5"
                  : "border-border/80 bg-card/60 hover:border-emerald-500/60 hover:bg-card"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-card border border-border text-base shadow-xs">
                    🏠
                  </span>
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    Surat
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/30 dark:bg-amber-500/10 dark:border-amber-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-accent dark:text-amber-400">
                  <span>🏠</span>
                  HOMETOWN • NATIVE PLACE
                </span>
              </div>

              <div className="font-mono text-xs text-muted-foreground mb-3">
                Surat, Gujarat, India
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                My hometown and native city where I was born and raised. Growing up in Surat gave me my foundational roots, personal values, and a practical, grounded work ethic.
              </p>

              <div className="flex flex-wrap gap-1.5 mt-4">
                <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 font-mono text-[11px] text-foreground border border-border/60">
                  🏠 Native Roots
                </span>
                <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 font-mono text-[11px] text-foreground border border-border/60">
                  Born &amp; Raised
                </span>
                <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 font-mono text-[11px] text-foreground border border-border/60">
                  Family Heritage
                </span>
              </div>

              <a
                href="https://maps.google.com/?q=Surat,+Gujarat,+India"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-3.5 inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-accent hover:underline"
              >
                <span>Open in Google Maps</span>
                <span>↗</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
