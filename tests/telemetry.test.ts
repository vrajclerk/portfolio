import assert from "node:assert/strict";
import test, { describe } from "node:test";
import { GET as healthHandler } from "../src/app/(frontend)/api/health/route";

describe("Live System Telemetry & Health API", () => {
  test("GET /api/health returns 200 OK with formatted JSON telemetry", async () => {
    const res = await healthHandler();
    assert.equal(res.status, 200, "Must return HTTP 200 OK");

    const json = await res.json();
    assert.equal(json.status, "healthy");
    assert.equal(json.service, "vraj-clerk-portfolio");
    assert.ok(typeof json.uptimeSeconds === "number");
    assert.ok(json.runtime && typeof json.runtime.node === "string");
    assert.ok(json.memory && typeof json.memory.heapUsedMb === "number");
    assert.ok(json.database && typeof json.database.status === "string");
    assert.ok(typeof json.latencyMs === "number");

    // Check headers
    const cacheControl = res.headers.get("Cache-Control");
    assert.ok(cacheControl?.includes("no-store"), "Must prevent caching of health telemetry");

    const responseTime = res.headers.get("X-Response-Time");
    assert.ok(responseTime?.endsWith("ms"), "Must include X-Response-Time header");
  });
});

