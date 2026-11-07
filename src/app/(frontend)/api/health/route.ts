import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const start = performance.now();

  const mem = process.memoryUsage();
  const hasDbConfig = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);

  let dbStatus: "connected" | "fallback-fixtures" | "disconnected" = "fallback-fixtures";
  let dbLatencyMs: number | null = null;

  if (hasDbConfig) {
    try {
      const dbStart = performance.now();
      const { default: configPromise } = await import("@payload-config");
      const { getPayload } = await import("payload");
      const payload = await getPayload({ config: configPromise });

      if (payload) {
        dbLatencyMs = Math.round(performance.now() - dbStart);
        dbStatus = "connected";
      }
    } catch {
      dbStatus = "fallback-fixtures";
    }
  }

  const durationMs = Math.round(performance.now() - start);

  const payloadData = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "vraj-clerk-portfolio",
    version: "1.0.0",
    uptimeSeconds: Math.floor(process.uptime()),
    runtime: {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      env: process.env.NODE_ENV || "development",
    },
    database: {
      status: dbStatus,
      driver: "@payloadcms/db-vercel-postgres",
      latencyMs: dbLatencyMs,
    },
    memory: {
      heapUsedMb: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
      heapTotalMb: Math.round((mem.heapTotal / 1024 / 1024) * 100) / 100,
      rssMb: Math.round((mem.rss / 1024 / 1024) * 100) / 100,
    },
    latencyMs: durationMs,
  };

  return NextResponse.json(payloadData, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Response-Time": `${durationMs}ms`,
    },
  });
}

