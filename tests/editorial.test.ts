import assert from "node:assert/strict";
import test, { describe } from "node:test";
import { Media } from "../src/collections/Media";
import { getPostBySlug, getProjectBySlug } from "../src/lib/cms";
import {
  revalidateHomepageAfterChange,
  revalidatePostAfterChange,
  revalidatePostAfterDelete,
  revalidateProfileAfterChange,
  revalidateProjectAfterChange,
  revalidateProjectAfterDelete,
  revalidateSiteSettingsAfterChange,
} from "../src/utilities/revalidate";
import { formatSlug } from "../src/utilities/slugify";

describe("Phase 4: Editorial, Draft, and Media Workflow", () => {
  describe("Draft Protection & Preview Mode", () => {
    test("draft post is rejected when isDraftMode is false", async () => {
      const post = await getPostBySlug("draft-internal-database-notes", false);
      assert.equal(post, null, "Anonymous visitors must NEVER see draft posts");
    });

    test("draft post is accessible when isDraftMode is true", async () => {
      const post = await getPostBySlug("draft-internal-database-notes", true);
      assert.ok(post, "Draft post should be retrievable when draft mode is active");
      assert.equal(post?.slug, "draft-internal-database-notes");
      assert.equal(post?._status, "draft");
    });

    test("draft project is rejected when isDraftMode is false", async () => {
      const project = await getProjectBySlug("draft-query-cache-experiment", false);
      assert.equal(
        project,
        null,
        "Anonymous visitors must NEVER see draft projects"
      );
    });

    test("draft project is accessible when isDraftMode is true", async () => {
      const project = await getProjectBySlug("draft-query-cache-experiment", true);
      assert.ok(
        project,
        "Draft project should be retrievable when draft mode is active"
      );
      assert.equal(project?.slug, "draft-query-cache-experiment");
      assert.equal(project?._status, "draft");
    });

    test("published post is accessible in both standard and draft modes", async () => {
      const standard = await getPostBySlug(
        "designing-idempotent-webhook-handlers",
        false
      );
      const draft = await getPostBySlug(
        "designing-idempotent-webhook-handlers",
        true
      );
      assert.ok(standard);
      assert.ok(draft);
      assert.equal(standard?.id, draft?.id);
    });

    test("non-existent slugs return null regardless of draft mode", async () => {
      const standard = await getPostBySlug("definitely-not-a-slug", false);
      const draft = await getPostBySlug("definitely-not-a-slug", true);
      assert.equal(standard, null);
      assert.equal(draft, null);
    });
  });

  describe("Slug Formatting & Normalization", () => {
    test("converts title to clean kebab-case slug", () => {
      assert.equal(
        formatSlug("Building a Resilient Webhook Ingestion Engine"),
        "building-a-resilient-webhook-ingestion-engine"
      );
    });

    test("handles special characters and punctuation gracefully", () => {
      assert.equal(
        formatSlug("What's New in Next.js 16? [Full Breakdown!]"),
        "whats-new-in-next-js-16-full-breakdown"
      );
    });

    test("trims leading, trailing, and duplicate hyphens", () => {
      assert.equal(formatSlug("  ---my---custom---slug---  "), "my-custom-slug");
    });
  });

  describe("Media Alt Text Validation", () => {
    const altField = Media.fields?.find(
      (f) => "name" in f && f.name === "alt"
    );
    assert.ok(altField && "validate" in altField);
    const validateAlt = altField.validate as (
      val: unknown,
      args: { siblingData?: Record<string, unknown> }
    ) => true | string;

    test("requires alt text when decorative is false", () => {
      const missingAlt = validateAlt("", { siblingData: { decorative: false } });
      assert.equal(
        missingAlt,
        "Alt text is required for non-decorative images."
      );

      const whitespaceAlt = validateAlt("   ", {
        siblingData: { decorative: false },
      });
      assert.equal(
        whitespaceAlt,
        "Alt text is required for non-decorative images."
      );
    });

    test("allows meaningful alt text when decorative is false", () => {
      const validAlt = validateAlt("Architecture diagram of ingestion pipeline", {
        siblingData: { decorative: false },
      });
      assert.equal(validAlt, true);
    });

    test("allows empty alt text when decorative is true", () => {
      const decorativeEmpty = validateAlt("", {
        siblingData: { decorative: true },
      });
      assert.equal(decorativeEmpty, true);

      const decorativeUndefined = validateAlt(undefined, {
        siblingData: { decorative: true },
      });
      assert.equal(decorativeUndefined, true);
    });
  });

  describe("Cache Invalidation Hooks", () => {
    test("revalidation hooks execute without throwing outside request context", () => {
      const dummyPost = { id: "1", slug: "test-post", _status: "published" };
      const dummyProject = { id: "2", slug: "test-proj", _status: "published" };
      const dummyGlobal = { id: "3" };

      // None of these should throw when called in background / script environment
      assert.doesNotThrow(() => {
        // @ts-expect-error Mock hook invocation
        revalidatePostAfterChange({ doc: dummyPost, previousDoc: dummyPost });
        // @ts-expect-error Mock hook invocation
        revalidatePostAfterDelete({ doc: dummyPost });
        // @ts-expect-error Mock hook invocation
        revalidateProjectAfterChange({ doc: dummyProject, previousDoc: dummyProject });
        // @ts-expect-error Mock hook invocation
        revalidateProjectAfterDelete({ doc: dummyProject });
        // @ts-expect-error Mock hook invocation
        revalidateSiteSettingsAfterChange({ doc: dummyGlobal });
        // @ts-expect-error Mock hook invocation
        revalidateProfileAfterChange({ doc: dummyGlobal });
        // @ts-expect-error Mock hook invocation
        revalidateHomepageAfterChange({ doc: dummyGlobal });
      });
    });
  });
});
