import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  extractPostTitle,
  extractPostExcerpt,
  extractHashtags,
  convertTextToLexical,
} from "../src/lib/buffer";
import { Posts } from "../src/collections/Posts";
import { Media } from "../src/collections/Media";

describe("Buffer & LinkedIn Ingestion Engine", () => {
  describe("Title Extraction", () => {
    test("extracts standard single-line technical hook", () => {
      const text =
        "The most important AI coding skill might be knowing when to say NO.\n\nAI can generate code in seconds, but speed without judgment turns small tasks into tech debt.";
      const title = extractPostTitle(text);
      assert.equal(
        title,
        "The most important AI coding skill might be knowing when to say NO."
      );
    });

    test("cleans emojis, bullet characters, and markdown headers", () => {
      const text =
        "🚀 ### Why Anthropic Built Scion: The New Bottleneck in AI Engineering\n\nIn May, Anthropic was merging around 2,500 code changes per day.";
      const title = extractPostTitle(text);
      assert.equal(
        title,
        "Why Anthropic Built Scion: The New Bottleneck in AI Engineering"
      );
    });

    test("combines short opening line with line 2", () => {
      const text = "A quick reminder:\nNever commit or push code on autopilot.\n\nAlways review your diff.";
      const title = extractPostTitle(text);
      assert.equal(title, "A quick reminder: Never commit or push code on autopilot.");
    });

    test("truncates excessively long opening sentences at word boundary", () => {
      const longLine =
        "This is an extraordinarily long opening sentence that exceeds one hundred characters easily and needs to be truncated gracefully at a clean word boundary without breaking words apart.";
      const title = extractPostTitle(longLine);
      assert.ok(title.length <= 100);
      assert.ok(title.endsWith("..."));
    });

    test("falls back gracefully for empty or whitespace strings", () => {
      assert.equal(extractPostTitle(""), "Untitled Post");
      assert.equal(extractPostTitle("   \n\n  "), "Untitled Post");
    });
  });

  describe("Excerpt Generation (≤ 240 chars Payload constraint)", () => {
    test("strictly guarantees length is <= 240 characters", () => {
      const longPost = `Understanding Webhook Reliability in Distributed Systems.
Webhooks are fundamentally at-least-once delivery systems. Payment gateways, authentication providers, and third-party SaaS platforms will retry event dispatches until they receive an HTTP 2xx acknowledgment. When network timeouts occur between the client receiving an event and returning the acknowledgment, duplicates will inevitably arrive. If your backend treats incoming events as blind mutations, you will charge customers twice, create duplicate user records, or corrupt internal state.`;

      const excerpt = extractPostExcerpt(longPost, "Understanding Webhook Reliability in Distributed Systems.");
      assert.ok(excerpt.length <= 240, `Excerpt length ${excerpt.length} exceeds 240 characters`);
      assert.ok(excerpt.endsWith("..."));
    });

    test("strips trailing hashtag blocks from excerpt", () => {
      const postWithHashtags = `Short note on git hygiene.
Always review your diff before creating a commit. Stage only the files intended for the commit.

#Git #Productivity #Engineering #Software`;

      const excerpt = extractPostExcerpt(postWithHashtags, "Short note on git hygiene.");
      assert.ok(!excerpt.includes("#Git"));
      assert.ok(!excerpt.includes("#Software"));
    });
  });

  describe("Hashtag Extraction", () => {
    test("extracts unique hashtags and cleans '#' prefix", () => {
      const post = `Building resilient APIs with #TypeScript, #Nextjs, and #PostgreSQL!
Remember that #TypeScript is great for type safety. #SystemDesign #concurrency_control #AI2026`;

      const tags = extractHashtags(post);
      assert.deepEqual(tags, [
        "TypeScript",
        "Nextjs",
        "PostgreSQL",
        "SystemDesign",
        "concurrency_control",
        "AI2026",
      ]);
    });

    test("ignores single '#' symbol without alphanumeric characters", () => {
      const post = "Rank # 1 in performance #fast";
      const tags = extractHashtags(post);
      assert.deepEqual(tags, ["fast"]);
    });
  });

  describe("Lexical RichText Serializer", () => {
    test("creates valid Lexical document root with paragraph children", () => {
      const rawText = "Paragraph 1 line.\n\nParagraph 2 line.";
      const lexical = convertTextToLexical(rawText);

      assert.equal(lexical.root.type, "root");
      assert.equal(lexical.root.children.length, 2);
      assert.equal(lexical.root.children[0].type, "paragraph");
      assert.equal(lexical.root.children[1].type, "paragraph");
    });

    test("handles single and multi-line content safely", () => {
      const rawText = "Check out the repo at https://github.com/vrajclerk/portfolio for source code.";
      const lexical = convertTextToLexical(rawText);

      assert.equal(lexical.root.type, "root");
      assert.equal(lexical.root.children.length, 1);
      const child = lexical.root.children[0];
      assert.equal(child.type, "paragraph");
      assert.equal((child.children[0] as Record<string, unknown>).text, rawText);
    });
  });

  describe("Posts Collection Schema Verification", () => {
    test("Posts collection contains bufferPostId with unique index", () => {
      const bufferPostIdField = Posts.fields.find(
        (f) => "name" in f && f.name === "bufferPostId"
      ) as Record<string, unknown> | undefined;
      assert.ok(bufferPostIdField, "bufferPostId field must exist");
      assert.equal(bufferPostIdField.type, "text");
      assert.equal(bufferPostIdField.unique, true);
      assert.equal(bufferPostIdField.index, true);
    });

    test("Posts collection contains source and linkedinUrl fields", () => {
      const sourceField = Posts.fields.find(
        (f) => "name" in f && f.name === "source"
      ) as Record<string, unknown> | undefined;
      assert.ok(sourceField, "source field must exist");
      assert.equal(sourceField.type, "select");
      assert.equal(sourceField.defaultValue, "native");

      const linkedinUrlField = Posts.fields.find(
        (f) => "name" in f && f.name === "linkedinUrl"
      ) as Record<string, unknown> | undefined;
      assert.ok(linkedinUrlField, "linkedinUrl field must exist");
      assert.equal(linkedinUrlField.type, "text");
    });
  });

  describe("Media & Carousel Slides Handling", () => {
    test("Media collection afterRead hook normalizes url to /media/<filename>", () => {
      const afterReadHook = Media.hooks?.afterRead?.[0];
      assert.ok(afterReadHook, "Media afterRead hook must be registered");

      const testDoc = { filename: "buffer-test-image.jpg", url: "/api/media/file/buffer-test-image.jpg" };
      const processed = afterReadHook({ doc: testDoc });
      assert.equal(processed.url, "/media/buffer-test-image.jpg");
    });
  });
});
