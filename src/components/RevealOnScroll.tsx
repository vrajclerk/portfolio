"use client";

import React, { useEffect, useRef, useState } from "react";

export interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  staggerIndex?: number;
  staggerDelayMs?: number;
  variant?: "spatial-3d" | "header" | "standard";
}

/**
 * RevealOnScroll Component (Concept 2: Spatial 3D Holographic Docking)
 *
 * Uses a single-shot IntersectionObserver to trigger hardware-accelerated 3D entry
 * animations when elements enter the viewport. Unobserves immediately upon trigger
 * to guarantee 0 running CPU cycles during interaction.
 */
export function RevealOnScroll({
  children,
  className = "",
  staggerIndex = 0,
  staggerDelayMs = 90,
  variant = "spatial-3d",
}: RevealOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    // Trigger when element enters the bottom 14% of the viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node); // Reveal only once: 0 continuous CPU cost
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  const totalDelay = staggerIndex * staggerDelayMs;

  const variantClass =
    variant === "header"
      ? "reveal-header-mode"
      : variant === "spatial-3d"
      ? "reveal-spatial-card"
      : "";

  return (
    <div
      ref={elementRef}
      style={{
        transitionDelay: `${totalDelay}ms`,
      }}
      className={`reveal-init h-full flex flex-col ${variantClass} ${isVisible ? "reveal-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
