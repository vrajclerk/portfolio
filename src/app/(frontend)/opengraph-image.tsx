import { ImageResponse } from "next/og";
import { getProfile, getSiteSettings } from "@/lib/cms";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [profile, settings] = await Promise.all([
    getProfile(),
    getSiteSettings(),
  ]);

  const siteName = settings.siteName || "Vraj Clerk";
  const headline = profile.headline || "Python Developer | FastAPI, PostgreSQL, AWS & Distributed Systems";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          backgroundColor: "#0B0F17",
          color: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle grid texture overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 20px 20px, rgba(255, 107, 0, 0.15) 2px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Top Branding Telemetry */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#FF6B00",
              }}
            />
            <span
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: "#FF6B00",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
              }}
            >
              ENGINEERING PORTFOLIO
            </span>
          </div>

          <span
            style={{
              fontSize: "18px",
              color: "#9BA3AF",
              fontFamily: "monospace",
            }}
          >
            vrajclerk.vercel.app
          </span>
        </div>

        {/* Center Main Identity */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "1040px",
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 900,
              lineHeight: 1.1,
              color: "#FFFFFF",
              letterSpacing: "-2px",
              margin: 0,
            }}
          >
            {siteName}
          </h1>

          <p
            style={{
              fontSize: "26px",
              color: "#E2E8F0",
              lineHeight: 1.4,
              margin: 0,
              fontWeight: 500,
              maxWidth: "960px",
            }}
          >
            {headline}
          </p>
        </div>

        {/* Bottom Technical Architecture Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            paddingTop: "24px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              fontSize: "16px",
              color: "#94A3B8",
              fontFamily: "monospace",
            }}
          >
            <span>Next.js 16</span>
            <span>•</span>
            <span>Payload CMS 3</span>
            <span>•</span>
            <span>Neon PostgreSQL</span>
            <span>•</span>
            <span>FastAPI</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "15px",
              color: "#FF6B00",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            <span>Production Architecture & Case Studies ↗</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

