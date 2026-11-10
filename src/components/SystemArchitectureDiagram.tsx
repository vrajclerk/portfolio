"use client";

import React, { useState } from "react";

type TopologyView = "pipeline" | "idempotency" | "failure";

interface NodeDetail {
  id: string;
  label: string;
  role: string;
  badge: string;
  tech: string;
  description: string;
}

const PIPELINE_NODES: NodeDetail[] = [
  {
    id: "ingress",
    label: "1. Edge / API Ingress",
    role: "Traffic Entry",
    badge: "FastAPI / Next.js",
    tech: "HTTP/2, TLS 1.3",
    description: "Terminates incoming client requests, validates JSON schema payloads via Pydantic/Zod, and extracts client authentication & correlation headers.",
  },
  {
    id: "dedup",
    label: "2. Deduplication Guard",
    role: "Idempotency Lock",
    badge: "Unique Constraint",
    tech: "PostgreSQL / Redis Key",
    description: "Checks incoming Idempotency-Key against recent execution ledger. Duplicate calls return previous cached result with 0 duplicate mutations.",
  },
  {
    id: "queue",
    label: "3. Partitioned Queue",
    role: "Async Buffer",
    badge: "In-Memory / Stream",
    tech: "Ordered Partition Key",
    description: "Buffers bursts up to 800+ concurrent requests. Partitions events by entity ID to guarantee strictly sequential execution per customer.",
  },
  {
    id: "worker",
    label: "4. Worker Consumer",
    role: "Core Execution",
    badge: "Python AsyncIO",
    tech: "Concurrency Limit: 50",
    description: "Pool of non-blocking worker coroutines processing queued jobs with deterministic timeout budgets and structured telemetry logging.",
  },
  {
    id: "datastore",
    label: "5. Storage & Search",
    role: "Persistence Layer",
    badge: "PostgreSQL & Search",
    tech: "B-Tree Indexes + OpenSearch",
    description: "Commits transactional state via ACID transactions. Emits change streams to search indices for low-latency (<100ms) full-text query matching.",
  },
];

const IDEMPOTENCY_STEPS = [
  { step: "01", name: "Client Request", detail: "Payload submitted with unique `Idempotency-Key: UUIDv4` header" },
  { step: "02", name: "Ledger Lookup", detail: "Queries DB for existing key status (STARTED, COMPLETED, FAILED)" },
  { step: "03", name: "In-Flight Detection", detail: "If status is STARTED and within lock window, returns HTTP 409 Conflict / Retry-After" },
  { step: "04", name: "Atomic Mutation", detail: "Executes business logic within a single ACID transaction block" },
  { step: "05", name: "Response Replay", detail: "Caches final response envelope; subsequent duplicate calls return cached payload" },
];

const FAILURE_STEPS = [
  { step: "Attempt 1", name: "Initial Execution", status: "Primary Execution", action: "Fast path direct write" },
  { step: "Retry 1", name: "Immediate Retry", status: "Backoff: 200ms + Jitter", action: "Transient connection drop recovery" },
  { step: "Retry 2", name: "Exponential Backoff", status: "Backoff: 1000ms + Jitter", action: "Downstream service saturation relief" },
  { step: "DLQ Route", name: "Dead-Letter Quarantine", status: "Status: QUARANTINED", action: "Preserves payload for inspection without blocking pipeline" },
];

export function SystemArchitectureDiagram() {
  const [activeView, setActiveView] = useState<TopologyView>("pipeline");
  const [activeNode, setActiveNode] = useState<string>("ingress");

  const selectedNodeData = PIPELINE_NODES.find((n) => n.id === activeNode) || PIPELINE_NODES[0];

  return (
    <div className="rounded-3xl border border-border/80 bg-card/90 dark:bg-[#12161D]/90 p-5 sm:p-7 shadow-xl backdrop-blur-xl transition-all duration-300">
      {/* Header bar with view toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-border/70 pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-accent mb-1">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span>Interactive System Topology</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Distributed Execution Architecture
          </h3>
        </div>

        {/* View Switcher Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60">
          <button
            type="button"
            onClick={() => setActiveView("pipeline")}
            className={`rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-all cursor-pointer ${
              activeView === "pipeline"
                ? "bg-foreground text-background font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Data Pipeline
          </button>
          <button
            type="button"
            onClick={() => setActiveView("idempotency")}
            className={`rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-all cursor-pointer ${
              activeView === "idempotency"
                ? "bg-foreground text-background font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Idempotency Flow
          </button>
          <button
            type="button"
            onClick={() => setActiveView("failure")}
            className={`rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-all cursor-pointer ${
              activeView === "failure"
                ? "bg-foreground text-background font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Fault &amp; Retry Policy
          </button>
        </div>
      </div>

      {/* VIEW 1: DATA PIPELINE (Interactive Nodes) */}
      {activeView === "pipeline" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {PIPELINE_NODES.map((node, idx) => {
              const isSelected = activeNode === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveNode(node.id)}
                  className={`group relative text-left rounded-2xl border p-3.5 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-accent bg-accent/10 dark:bg-accent/15 shadow-md shadow-accent/10 scale-[1.02]"
                      : "border-border/80 bg-muted/30 hover:border-accent/40 hover:bg-muted/60"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-muted-foreground mb-1">
                    <span>STEP 0{idx + 1}</span>
                    <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-accent" : "bg-border"}`} />
                  </div>
                  <div className="text-xs font-bold text-foreground truncate">{node.role}</div>
                  <div className="text-[11px] font-mono text-accent truncate mt-1">{node.badge}</div>
                </button>
              );
            })}
          </div>

          {/* Active Node Deep-Dive Card */}
          <div className="rounded-2xl border border-accent/30 bg-muted/20 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <div className="font-bold text-sm text-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span>{selectedNodeData.label}</span>
                <span className="text-xs font-mono font-normal text-muted-foreground">({selectedNodeData.role})</span>
              </div>
              <div className="text-xs font-mono font-semibold text-accent bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                {selectedNodeData.tech}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {selectedNodeData.description}
            </p>
          </div>
        </div>
      )}

      {/* VIEW 2: IDEMPOTENCY FLOW */}
      {activeView === "idempotency" && (
        <div className="space-y-3 font-mono">
          <div className="text-xs text-muted-foreground mb-2">
            Prevents duplicate processing on network retries or double form submits:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {IDEMPOTENCY_STEPS.map((step) => (
              <div
                key={step.step}
                className="rounded-2xl border border-border/80 bg-muted/30 p-3.5 space-y-1.5"
              >
                <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                  {step.step}
                </span>
                <div className="text-xs font-bold text-foreground font-sans pt-1">{step.name}</div>
                <div className="text-[11px] text-muted-foreground leading-relaxed">{step.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: FAULT & RETRY POLICY */}
      {activeView === "failure" && (
        <div className="space-y-3 font-mono">
          <div className="text-xs text-muted-foreground mb-2">
            Automated resilience lifecycle protecting upstream services from cascading failure:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FAILURE_STEPS.map((step) => (
              <div
                key={step.step}
                className="rounded-2xl border border-border/80 bg-muted/30 p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{step.step}</span>
                  <span className="text-[10px] text-accent font-semibold">{step.status}</span>
                </div>
                <div className="text-xs font-sans font-bold text-foreground">{step.name}</div>
                <div className="text-[11px] text-muted-foreground leading-relaxed">{step.action}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

