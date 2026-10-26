import React from "react";
import Link from "next/link";
import type { SiteSetting } from "@/payload-types";

interface FooterProps {
  siteSettings?: SiteSetting | null;
}

export function Footer({ siteSettings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const siteName = siteSettings?.siteName || "Vraj Clerk";
  const socialLinks = siteSettings?.socialLinks || [
    { id: "gh", label: "GitHub", url: "https://github.com/vrajclerk" },
    { id: "li", label: "LinkedIn", url: "https://linkedin.com/in/vrajclerk" },
  ];

  return (
    <footer className="border-t border-border bg-card/50 text-muted-foreground transition-colors">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <p className="text-sm font-medium text-foreground">
              © {currentYear} {siteName}. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Built with Next.js App Router, Payload CMS, and PostgreSQL. Hosted with zero recurring cost.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link href="/projects" className="hover:text-foreground transition-colors">
              Projects
            </Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link href="/resume" className="hover:text-foreground transition-colors">
              Resume
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.id || link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
