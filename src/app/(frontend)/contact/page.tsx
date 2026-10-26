import React from "react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/cms";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Direct contact details, professional profiles, and inquiry channels for software engineer Vraj Clerk.",
};

export default async function ContactPage() {
  const siteSettings = await getSiteSettings();
  const publicEmail = siteSettings.publicEmail || "vrajclerk.dev@gmail.com";
  const socialLinks = siteSettings.socialLinks || [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="max-w-2xl mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">
          Inquiries
        </span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Get in Touch
        </h1>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">
          Whether you want to discuss full-stack engineering roles, system architectures, or technical collaboration, feel free to reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Contact Info & Socials */}
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">
              Direct Contact
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Direct email is the fastest way to get in touch regarding technical roles or projects.
            </p>
            <a
              href={`mailto:${publicEmail}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-semibold text-accent hover:bg-muted transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              {publicEmail}
            </a>
          </div>

          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">
              Professional Profiles
            </h2>
            <div className="flex flex-col gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.id || link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between rounded-lg border border-border bg-card p-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {link.url.replace(/^https?:\/\/(www\.)?/, "")} ↗
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/40 p-5 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Response Time Notice</p>
            <p>
              I generally respond to recruiter and engineering inquiries within 24 to 48 hours during business days.
            </p>
          </div>
        </div>

        {/* Message Form */}
        <div>
          <ContactForm recipientEmail={publicEmail} />
        </div>
      </div>
    </div>
  );
}
