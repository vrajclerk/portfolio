import assert from "node:assert/strict";
import test, { describe } from "node:test";

import { anyone } from "../src/access/anyone";
import { authenticated } from "../src/access/authenticated";
import { authenticatedOrPublished } from "../src/access/authenticatedOrPublished";
import { Categories } from "../src/collections/Categories";
import { Media } from "../src/collections/Media";
import { Posts } from "../src/collections/Posts";
import { Projects } from "../src/collections/Projects";
import { Tags } from "../src/collections/Tags";
import { Users } from "../src/collections/Users";
import { formatSlug } from "../src/utilities/slugify";

describe("Access Control Rules", () => {
  const anonymousReq = {
    req: { user: null },
  } as unknown as Parameters<typeof authenticated>[0];
  const authenticatedReq = {
    req: {
      user: {
        id: 1,
        email: "admin@example.com",
        role: "admin",
      },
    },
  } as unknown as Parameters<typeof authenticated>[0];

  test("authenticated denies anonymous requests", async () => {
    const result = await authenticated(anonymousReq);
    assert.equal(result, false);
  });

  test("authenticated permits logged-in users", async () => {
    const result = await authenticated(authenticatedReq);
    assert.equal(result, true);
  });

  test("anyone permits anonymous requests", async () => {
    const result = await anyone(anonymousReq);
    assert.equal(result, true);
  });

  test("authenticatedOrPublished restricts anonymous queries to published status only", async () => {
    const result = await authenticatedOrPublished(anonymousReq);
    assert.deepEqual(result, {
      _status: {
        equals: "published",
      },
    });
  });

  test("authenticatedOrPublished allows full access to authenticated users", async () => {
    const result = await authenticatedOrPublished(authenticatedReq);
    assert.equal(result, true);
  });
});

describe("Slug Utility", () => {
  test("generates kebab-case slug", () => {
    assert.equal(formatSlug("My First Project!"), "my-first-project");
    assert.equal(
      formatSlug("  Building scalable architectures with Next.js & Neon...  "),
      "building-scalable-architectures-with-next-js-neon"
    );
    assert.equal(formatSlug("Special @#$% Characters"), "special-characters");
  });
});

describe("Collections Configuration Integrity", () => {
  test("Users collection enforces admin authentication and disables public mutation", () => {
    assert.equal(Users.slug, "users");
    assert.ok(Users.auth);
    assert.equal(typeof Users.access?.create, "function");
    assert.equal(typeof Users.access?.read, "function");
    assert.equal(typeof Users.access?.update, "function");
    assert.equal(typeof Users.access?.delete, "function");
    assert.equal(typeof Users.access?.admin, "function");
  });

  test("Posts collection enables drafts and restricts public read", () => {
    assert.equal(Posts.slug, "posts");
    const versions = Posts.versions;
    assert.ok(typeof versions === "object" && Boolean(versions?.drafts));
    assert.equal(Posts.access?.read, authenticatedOrPublished);
    assert.equal(Posts.access?.create, authenticated);
  });

  test("Projects collection enables drafts and restricts public read", () => {
    assert.equal(Projects.slug, "projects");
    const versions = Projects.versions;
    assert.ok(typeof versions === "object" && Boolean(versions?.drafts));
    assert.equal(Projects.access?.read, authenticatedOrPublished);
    assert.equal(Projects.access?.create, authenticated);
  });

  test("Categories and Tags allow public reads but require authentication to mutate", () => {
    assert.equal(Categories.access?.read, anyone);
    assert.equal(Categories.access?.create, authenticated);
    assert.equal(Tags.access?.read, anyone);
    assert.equal(Tags.access?.create, authenticated);
  });

  test("Media collection validates decorative flag against alt text requirement", () => {
    assert.equal(Media.slug, "media");
    assert.equal(Media.access?.read, anyone);
    assert.equal(Media.access?.create, authenticated);

    const altField = Media.fields.find(
      (f) => "name" in f && f.name === "alt"
    );
    assert.ok(altField && "validate" in altField && typeof altField.validate === "function");
    const validate = altField.validate as (
      val: unknown,
      args: { siblingData?: Record<string, unknown> }
    ) => boolean | string;

    // Decorative image without alt should be valid
    const validDecorative = validate("", {
      siblingData: { decorative: true },
    });
    assert.equal(validDecorative, true);

    // Non-decorative image without alt should fail validation
    const invalidNonDecorative = validate("", {
      siblingData: { decorative: false },
    });
    assert.equal(typeof invalidNonDecorative, "string");

    // Non-decorative image with alt should be valid
    const validWithAlt = validate("Architecture diagram", {
      siblingData: { decorative: false },
    });
    assert.equal(validWithAlt, true);
  });
});
