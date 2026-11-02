"use client";

import React, { useState } from "react";

interface ContactFormProps {
  recipientEmail: string;
}

const INQUIRY_TYPES = [
  { id: "collaboration", label: "Technical Collaboration" },
  { id: "opportunities", label: "Career & Opportunities" },
  { id: "architecture", label: "Architecture / Systems" },
  { id: "general", label: "General Inquiry" },
];

export function ContactForm({ recipientEmail }: ContactFormProps) {
  const [selectedType, setSelectedType] = useState("collaboration");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus("error");
      setErrorMessage("Please fill in all required fields (Name, Email, Message).");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    // Simulate reliable submission delay
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", company: "", subject: "", message: "" });
    }, 700);
  };

  return (
    <div className="relative rounded-[30px] sm:rounded-[34px] overflow-hidden p-[1.5px] border border-border/80 dark:border-white/10 shadow-2xl transition-all duration-300">
      {/* Continuous Conic Rotating Border Beam */}
      <div
        aria-hidden="true"
        className="absolute -top-[150%] -left-[50%] w-[200%] h-[400%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_280deg,var(--accent)_320deg,#38BDF8_345deg,transparent_360deg)] animate-border-beam pointer-events-none -z-10 opacity-70 dark:opacity-85"
      />

      {/* Crisp Inner Glass Surface Mask */}
      <div className="rounded-[28px] sm:rounded-[32px] bg-card/95 dark:bg-[#12161D]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 h-full">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Send an Inquiry
            </h2>
            <span className="font-mono text-[10px] uppercase font-bold text-accent bg-accent/10 px-2.5 py-0.5 rounded-full border border-accent/20">
              Direct Route
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Fill out the details below or email directly to{" "}
            <a href={`mailto:${recipientEmail}`} className="text-accent font-semibold hover:underline">
              {recipientEmail}
            </a>
            .
          </p>
        </div>

        {/* Inquiry Type Selector Pills */}
        <div className="mb-6">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Inquiry Topic
          </label>
          <div className="flex flex-wrap gap-2">
            {INQUIRY_TYPES.map((type) => {
              const isSelected = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-mono transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-accent text-accent-foreground font-bold shadow-xs scale-102"
                      : "border border-border/80 bg-muted/50 text-muted-foreground hover:border-accent hover:text-foreground"
                  }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {status === "success" ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 sm:p-8 text-center text-foreground animate-fade-in">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground">Message Received!</h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Thank you for reaching out. I prioritize engineering opportunities and will respond within 24 hours to{" "}
              <strong className="text-foreground">{recipientEmail}</strong>.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-5 py-2 text-xs font-semibold text-foreground hover:border-accent hover:text-accent transition-colors"
            >
              <span>Send another message</span>
              <span>↺</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === "error" && errorMessage && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-600 dark:text-red-400 animate-fade-in">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-foreground mb-1.5">
                  Your Name <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sarah Connor"
                  className="w-full rounded-xl border border-border/80 bg-background/80 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-hidden transition-all"
                />
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-foreground mb-1.5">
                  Email Address <span className="text-accent">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="sarah@company.com"
                  className="w-full rounded-xl border border-border/80 bg-background/80 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-hidden transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Company / Organization */}
              <div>
                <label htmlFor="company" className="block text-xs font-semibold text-foreground mb-1.5">
                  Company / Organization
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Tech Corp / Startup"
                  className="w-full rounded-xl border border-border/80 bg-background/80 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-hidden transition-all"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-xs font-semibold text-foreground mb-1.5">
                  Subject / Role Title
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Full-Stack Engineer Opening"
                  className="w-full rounded-xl border border-border/80 bg-background/80 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-hidden transition-all"
                />
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label htmlFor="message" className="block text-xs font-semibold text-foreground mb-1.5">
                Message & Role Context <span className="text-accent">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about the engineering team, tech stack, or problem you are solving..."
                className="w-full rounded-xl border border-border/80 bg-background/80 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-hidden transition-all resize-y"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="group relative w-full inline-flex items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-bold text-accent-foreground shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-accent/30 active:scale-[0.99] disabled:opacity-50 overflow-hidden cursor-pointer"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 w-3/5 h-full bg-linear-to-r from-transparent via-white/35 to-transparent -skew-x-20 animate-shimmer-sweep pointer-events-none"
              />
              <span>{status === "submitting" ? "Sending Inquiry..." : "Submit Engineering Inquiry"}</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
