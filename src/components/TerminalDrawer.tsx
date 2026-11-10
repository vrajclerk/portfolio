"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface CommandLog {
  id: string;
  type: "input" | "output" | "error" | "info";
  content: string | React.ReactNode;
}

export function TerminalDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: "welcome",
      type: "info",
      content: (
        <div className="space-y-1 text-xs">
          <div className="font-bold text-accent">Vraj Clerk CLI [Version 1.0.0]</div>
          <div className="text-muted-foreground">
            Python &amp; Backend Systems Engineer workstation shell.
          </div>
          <div className="text-[11px] text-muted-foreground/80">
            Type <span className="font-semibold text-accent">help</span> for available commands, or try <span className="text-foreground">skills</span>, <span className="text-foreground">projects</span>, <span className="text-foreground">whoami</span>.
          </div>
        </div>
      ),
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of terminal output
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Global event listener for toggle (e.g., from footer or shortcut)
  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle with backtick `~` if not currently focused in another text input
      if (
        e.key === "`" &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("terminal-toggle", handleToggle);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("terminal-toggle", handleToggle);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const executeCommand = async (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    // Save to command history
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);

    const logId = String(Date.now());
    const [command] = trimmed.split(" ");
    const cmdLower = command.toLowerCase();

    // 1. Add user command to log
    const userLog: CommandLog = {
      id: `${logId}-in`,
      type: "input",
      content: trimmed,
    };

    // 2. Compute response
    let responseLog: CommandLog;

    switch (cmdLower) {
      case "health":
      case "telemetry":
      case "status":
        try {
          const res = await fetch("/api/health");
          const data = await res.json();
          responseLog = {
            id: `${logId}-out`,
            type: "output",
            content: (
              <div className="text-xs space-y-1.5 font-mono py-1">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>LIVE SYSTEM TELEMETRY [HTTP 200 OK]</span>
                </div>
                <div className="text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-muted-foreground pt-1 border-t border-border/60">
                  <div>Status: <span className="text-foreground font-semibold uppercase">{data.status}</span></div>
                  <div>Latency: <span className="text-accent font-semibold">{data.latencyMs}ms</span></div>
                  <div>Uptime: <span className="text-foreground font-semibold">{data.uptimeSeconds}s</span></div>
                  <div>Database: <span className="text-foreground font-semibold">{data.database.status}</span></div>
                  <div>Heap Memory: <span className="text-foreground font-semibold">{data.memory.heapUsedMb} MB</span></div>
                  <div>Runtime: <span className="text-foreground font-semibold">Node {data.runtime.node} ({data.runtime.platform})</span></div>
                </div>
              </div>
            ),
          };
        } catch {
          responseLog = {
            id: `${logId}-out`,
            type: "error",
            content: "Telemetry probe failed: service unreachable.",
          };
        }
        break;

      case "curl":
        const target = trimmed.split(" ")[1];
        if (target === "/api/health" || target === "api/health") {
          try {
            const res = await fetch("/api/health");
            const data = await res.json();
            responseLog = {
              id: `${logId}-out`,
              type: "output",
              content: (
                <pre className="text-[11px] font-mono text-emerald-300 overflow-x-auto p-2 bg-black/40 rounded-lg">
                  {JSON.stringify(data, null, 2)}
                </pre>
              ),
            };
          } catch {
            responseLog = {
              id: `${logId}-out`,
              type: "error",
              content: "curl: (7) Failed to connect to host",
            };
          }
        } else {
          responseLog = {
            id: `${logId}-out`,
            type: "info",
            content: "Usage: curl /api/health",
          };
        }
        break;
      case "help":
        responseLog = {
          id: `${logId}-out`,
          type: "output",
          content: (
            <div className="space-y-1.5 py-1 text-xs">
              <div className="font-semibold text-accent">Available Commands:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 font-mono text-[11px]">
                <div><span className="text-accent font-bold">whoami</span> - Developer profile &amp; summary</div>
                <div><span className="text-accent font-bold">skills</span> - Core technologies &amp; architecture</div>
                <div><span className="text-accent font-bold">projects</span> - View case studies</div>
                <div><span className="text-accent font-bold">health</span> - Live server telemetry &amp; latency</div>
                <div><span className="text-accent font-bold">experience</span> - Work history &amp; contributions</div>
                <div><span className="text-accent font-bold">contact</span> - Email &amp; social profiles</div>
                <div><span className="text-accent font-bold">theme</span> - Toggle light/dark mode</div>
                <div><span className="text-accent font-bold">clear</span> - Clear terminal logs</div>
                <div><span className="text-accent font-bold">exit</span> - Minimize terminal drawer</div>
              </div>
            </div>
          ),
        };
        break;

      case "whoami":
        responseLog = {
          id: `${logId}-out`,
          type: "output",
          content: (
            <div className="text-xs space-y-1">
              <div className="font-bold text-foreground">Vraj Clerk</div>
              <div className="text-muted-foreground">
                Software Developer specializing in Python, FastAPI, PostgreSQL, AWS, and clean distributed architectures.
              </div>
              <div className="text-[11px] text-accent">
                Current Role: Junior Software Developer at Techlusion
              </div>
            </div>
          ),
        };
        break;

      case "skills":
        responseLog = {
          id: `${logId}-out`,
          type: "output",
          content: (
            <div className="text-xs space-y-1 font-mono">
              <div><strong className="text-accent">Languages:</strong> Python, TypeScript, SQL, JavaScript (ES6+)</div>
              <div><strong className="text-accent">Backend:</strong> FastAPI, RESTful APIs, Pydantic, OOP Packages</div>
              <div><strong className="text-accent">Cloud &amp; DevOps:</strong> AWS (Lambda, DynamoDB, S3, API Gateway, EC2, ECR), Docker</div>
              <div><strong className="text-accent">Databases:</strong> PostgreSQL, OpenSearch, DynamoDB Streams, MySQL</div>
              <div><strong className="text-accent">Architectures:</strong> Master-Child Catalog, RBAC (Auth0), Idempotency Queues</div>
            </div>
          ),
        };
        break;

      case "projects":
      case "ls":
        responseLog = {
          id: `${logId}-out`,
          type: "output",
          content: (
            <div className="text-xs space-y-1.5 font-mono">
              <div className="font-semibold text-accent">Published Engineering Case Studies:</div>
              <ul className="space-y-1 text-[11px] text-muted-foreground">
                <li>• <strong className="text-foreground">Pickleball Matchmaking &amp; Scoring Platform</strong> (FastAPI, WebSockets, Worker Queues)</li>
                <li>• <strong className="text-foreground">Enterprise Material Management Architecture</strong> (DynamoDB Streams, OpenSearch)</li>
                <li>• <strong className="text-foreground">LiquorScan Liquid Level Detection</strong> (Computer Vision, U-Net, ResNet34)</li>
                <li>• <strong className="text-foreground">High-Throughput Webhook Processing Pipeline</strong> (Partitioned PostgreSQL, Idempotency)</li>
              </ul>
              <div className="pt-1">
                <Link href="/projects" className="text-accent hover:underline text-[11px]">
                  Explore all projects in GUI →
                </Link>
              </div>
            </div>
          ),
        };
        break;

      case "experience":
        responseLog = {
          id: `${logId}-out`,
          type: "output",
          content: (
            <div className="text-xs space-y-1">
              <div className="font-semibold text-foreground">
                Techlusion • Software Developer Intern → Junior Software Developer
              </div>
              <div className="text-muted-foreground text-[11px]">Dec 2024 – Present (Surat / Ahmedabad, IN)</div>
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                Built internal Python OpenSearch packages, architected hierarchical Master-Child catalog models, managed AWS infrastructure, and integrated Auth0 RBAC patterns across services.
              </p>
            </div>
          ),
        };
        break;

      case "contact":
        responseLog = {
          id: `${logId}-out`,
          type: "output",
          content: (
            <div className="text-xs space-y-1 font-mono">
              <div><strong className="text-accent">Email:</strong> vrajclerk04@gmail.com</div>
              <div><strong className="text-accent">GitHub:</strong> github.com/vrajclerk</div>
              <div><strong className="text-accent">LinkedIn:</strong> linkedin.com/in/vrajclerk</div>
              <div className="pt-1">
                <Link href="/contact" className="text-accent hover:underline text-[11px]">
                  Open contact form →
                </Link>
              </div>
            </div>
          ),
        };
        break;

      case "theme":
        const currentDark =
          document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark";
        const next = currentDark ? "light" : "dark";

        if (next === "dark") {
          document.documentElement.classList.add("dark");
          document.documentElement.setAttribute("data-theme", "dark");
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          document.documentElement.setAttribute("data-theme", "light");
          localStorage.setItem("theme", "light");
        }
        window.dispatchEvent(new CustomEvent("theme-change", { detail: next }));

        responseLog = {
          id: `${logId}-out`,
          type: "output",
          content: `Switched theme to ${next.toUpperCase()} mode.`,
        };
        break;

      case "clear":
        setLogs([]);
        return;

      case "exit":
      case "close":
      case "quit":
        setIsOpen(false);
        return;

      case "sudo":
        responseLog = {
          id: `${logId}-out`,
          type: "error",
          content: "Permission denied: with great power comes great responsibility.",
        };
        break;

      case "matrix":
        responseLog = {
          id: `${logId}-out`,
          type: "output",
          content: (
            <div className="text-emerald-400 font-mono text-[11px] leading-relaxed animate-pulse">
              01010110 01110010 01100001 01101010 00100000 01000011 01101100 01100101 01110010 01101011<br />
              WAKE UP, NEO... THE BACKEND HAS YOU.
            </div>
          ),
        };
        break;

      default:
        responseLog = {
          id: `${logId}-out`,
          type: "error",
          content: `Command not found: "${command}". Type "help" for a list of available commands.`,
        };
        break;
    }

    setLogs((prev) => [...prev, userLog, responseLog]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    executeCommand(inputVal);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInputVal(history[nextIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= history.length) {
        setHistoryIdx(-1);
        setInputVal("");
      } else {
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx] || "");
      }
    }
  };

  return (
    <>
      {/* Minimized Floating Trigger Pill */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group fixed bottom-5 right-5 z-[9990] flex items-center gap-2 rounded-full border border-border/80 dark:border-white/10 bg-card/90 dark:bg-[#12161D]/90 px-3.5 py-2 text-xs font-mono font-bold text-foreground shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-accent hover:shadow-accent/20 hover:-translate-y-0.5 active:translate-y-0"
          aria-label="Open Interactive Developer Terminal"
        >
          <span className="flex h-2 w-2 items-center justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          </span>
          <span className="text-accent font-mono">&gt;_</span>
          <span className="text-[11px] font-semibold">Terminal</span>
          <kbd className="hidden sm:inline-block rounded bg-muted/80 px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground border border-border/60">
            ~
          </kbd>
        </button>
      )}

      {/* Expanded Terminal Drawer */}
      {isOpen && (
        <div
          className={`fixed bottom-0 right-0 sm:bottom-5 sm:right-5 z-[9995] flex flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl border border-border/80 dark:border-white/15 bg-card/95 dark:bg-[#0E1013]/98 shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
            isMaximized
              ? "w-full sm:w-[680px] h-[85vh] sm:h-[600px]"
              : "w-full sm:w-[520px] h-[400px] max-h-[80vh]"
          }`}
          role="dialog"
          aria-label="Developer Terminal Drawer"
        >
          {/* Terminal Window Header Bar */}
          <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 bg-muted/50 dark:bg-[#161A22]/80 px-4 py-2.5 font-mono text-xs select-none">
            {/* macOS / Linux style dots */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-3 w-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors focus:outline-hidden"
                title="Close terminal"
                aria-label="Close"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-3 w-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors focus:outline-hidden"
                title="Minimize terminal"
                aria-label="Minimize"
              />
              <button
                type="button"
                onClick={() => setIsMaximized(!isMaximized)}
                className="h-3 w-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors focus:outline-hidden"
                title="Maximize terminal"
                aria-label="Maximize"
              />
            </div>

            {/* Title / Session */}
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
              <span className="text-accent font-bold">vraj@clerk-workstation</span>
              <span>:</span>
              <span className="text-foreground">~ (zsh)</span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLogs([])}
                className="text-[10px] text-muted-foreground hover:text-accent font-mono transition-colors"
                title="Clear screen"
              >
                clear
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground text-xs leading-none p-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Terminal Output Log Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs leading-relaxed select-text"
          >
            {logs.map((log) => (
              <div key={log.id} className="min-w-0">
                {log.type === "input" ? (
                  <div className="flex items-center gap-2">
                    <span className="text-accent font-bold select-none">vraj@dev:~$</span>
                    <span className="text-foreground font-semibold">{log.content}</span>
                  </div>
                ) : log.type === "error" ? (
                  <div className="text-red-500 dark:text-red-400 pl-4">{log.content}</div>
                ) : (
                  <div className="text-muted-foreground pl-4">{log.content}</div>
                )}
              </div>
            ))}
          </div>

          {/* Terminal Input Prompt */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-border/80 dark:border-white/10 bg-muted/30 dark:bg-[#12161D]/80 px-4 py-2.5 font-mono text-xs"
          >
            <span className="text-accent font-bold select-none shrink-0">vraj@dev:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="type 'help', 'skills', 'projects'..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-hidden font-mono text-xs"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            <kbd className="hidden sm:inline-block rounded bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground/70 font-mono">
              ESC
            </kbd>
          </form>
        </div>
      )}
    </>
  );
}
