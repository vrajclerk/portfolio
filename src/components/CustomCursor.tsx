"use client";

import React, { useEffect, useRef } from "react";

/**
 * CustomCursor component.
 *
 * Implements a precision crosshair target reticle cursor matching the developer's
 * brand identity:
 * - Light Mode: Copenhagen Deep Cobalt (#1D4ED8)
 * - Dark Mode: High-Voltage Blaze Orange (#FF6B00)
 *
 * Technical Requirements:
 * - 0ms latency tracking via hardware-accelerated transform3d.
 * - Zero React re-renders on pointer movement.
 * - Direct DOM element ref attachment with guaranteed mount.
 * - Intelligent pointer detection: works with mouse & trackpad, automatically
 *   yields to native behavior on pure touch gestures.
 * - Smooth hover scale and 45° target lock-on on interactive elements.
 * - Preserves native I-beam for typing/selecting text in input fields.
 * - Complete pointer-events: none (never interferes with clicking, scrolling, or drag).
 * - Respects prefers-reduced-motion.
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    let isVisible = false;
    let isMouseActive = false;

    // Pointer movement handler
    const handlePointerMove = (e: PointerEvent) => {
      // Ignore touch events so mobile devices retain 100% native touch UX
      if (e.pointerType === "touch") {
        if (isVisible) {
          isVisible = false;
          cursorEl.style.opacity = "0";
          document.body.classList.remove("custom-cursor-enabled");
        }
        return;
      }

      if (!isMouseActive) {
        isMouseActive = true;
        document.body.classList.add("custom-cursor-enabled");
      }

      if (!isVisible) {
        isVisible = true;
        cursorEl.style.opacity = "1";
      }

      cursorEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") {
        cursorEl.classList.add("cursor-clicking");
      }
    };

    const handlePointerUp = () => {
      cursorEl.classList.remove("cursor-clicking");
    };

    const handleMouseLeave = () => {
      isVisible = false;
      cursorEl.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      if (isMouseActive) {
        isVisible = true;
        cursorEl.style.opacity = "1";
      }
    };

    // Hover state management for links, buttons, and interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Text input fields: hide custom reticle so native I-beam is clearly visible
      const isTextInput = target.closest(
        'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]'
      );
      if (isTextInput) {
        cursorEl.style.opacity = "0";
        return;
      } else if (isVisible) {
        cursorEl.style.opacity = "1";
      }

      // Interactive targets
      const isInteractive = target.closest(
        'a, button, [role="button"], select, summary, .cursor-pointer, [data-cursor="pointer"]'
      );
      if (isInteractive) {
        cursorEl.classList.add("cursor-hovering");
      } else {
        cursorEl.classList.remove("cursor-hovering");
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      document.body.classList.remove("custom-cursor-enabled");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="custom-reticle-cursor pointer-events-none fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-150 will-change-transform"
      style={{
        width: 30,
        height: 30,
        zIndex: 99999,
      }}
    >
      {/* 
        Precision Crosshair Target Reticle SVG:
        Drives color dynamically via currentColor mapped to var(--accent).
      */}
      <svg
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full text-accent transition-transform duration-200 ease-out"
        style={{
          filter: "drop-shadow(0 0 6px var(--accent))",
        }}
      >
        {/* Outer Circular Ring */}
        <circle cx="14" cy="14" r="7.5" stroke="currentColor" strokeWidth="1.25" />

        {/* Inner Precision Ring / Core */}
        <circle
          cx="14"
          cy="14"
          r="2.75"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeDasharray="2 1.5"
        />

        {/* 4 Outer Crosshair Extension Ticks (North, South, West, East) */}
        <line
          x1="14"
          y1="1.5"
          x2="14"
          y2="6.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <line
          x1="14"
          y1="21.5"
          x2="14"
          y2="26.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <line
          x1="1.5"
          y1="14"
          x2="6.5"
          y2="14"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <line
          x1="21.5"
          y1="14"
          x2="26.5"
          y2="14"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />

        {/* Precision Center Dot */}
        <circle cx="14" cy="14" r="0.75" fill="currentColor" />
      </svg>
    </div>
  );
}
