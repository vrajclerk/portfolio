import { ImageResponse } from "next/og";
import { getPostBySlug, getPublishedPosts, getSiteSettings } from "@/lib/cms";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([
    getPostBySlug(slug),
    getSiteSettings(),
  ]);

  const title = post?.title || "Technical Article";
  const category =
    post?.category && typeof post.category === "object" && "name" in post.category
      ? (post.category as { name: string }).name
      : "Engineering";
  const siteName = settings.siteName || "Vraj Clerk";

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
          backgroundColor: "#0E1013",
          color: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle grid pattern simulation */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "radial-gradient(circle at 20px 20px, rgba(255, 107, 0, 0.12) 2px, transparent 0)",
            backgroundSize: "40px 40px",
            zIndex: 0,
          }}
        />

        {/* Top telemetry bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
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
                fontWeight: 700,
                color: "#FF6B00",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              {category}
            </span>
          </div>

          <span
            style={{
              fontSize: "18px",
              color: "#9BA3AF",
              fontFamily: "monospace",
            }}
          >
            {siteName} • Technical Writing
          </span>
        </div>

        {/* Center Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            zIndex: 1,
            maxWidth: "1040px",
          }}
        >
          <h1
            style={{
              fontSize: title.length > 55 ? "48px" : "58px",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#FFFFFF",
              letterSpacing: "-1.5px",
              margin: 0,
            }}
          >
            {title}
          </h1>
          {post?.excerpt && (
            <p
              style={{
                fontSize: "22px",
                color: "#9BA3AF",
                lineHeight: 1.4,
                margin: 0,
                maxHeight: "65px",
                overflow: "hidden",
              }}
            >
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Bottom Author & Brand Plate */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #2D333F",
            paddingTop: "24px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "#FF6B00",
                color: "#0E1013",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 900,
              }}
            >
              VC
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "20px", fontWeight: 700, color: "#FFFFFF" }}>
                Vraj Clerk
              </span>
              <span style={{ fontSize: "14px", color: "#9BA3AF", fontFamily: "monospace" }}>
                Software Developer • Python &amp; Systems Architecture
              </span>
            </div>
          </div>

          <div
            style={{
              fontSize: "14px",
              fontFamily: "monospace",
              color: "#FF6B00",
              backgroundColor: "rgba(255, 107, 0, 0.1)",
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid rgba(255, 107, 0, 0.3)",
            }}
          >
            sys.online
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

