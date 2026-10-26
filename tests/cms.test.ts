import assert from "node:assert/strict";
import test, { describe } from "node:test";
import {
  getHomepageSettings,
  getPostBySlug,
  getProfile,
  getProjectBySlug,
  getPublishedPosts,
  getPublishedProjects,
  getSiteSettings,
} from "../src/lib/cms";

describe("CMS Data Access Layer & Access Contract", () => {
  test("getSiteSettings returns valid schema data", async () => {
    const settings = await getSiteSettings();
    assert.ok(settings);
    assert.ok(settings.siteName);
    assert.ok(settings.siteUrl);
  });

  test("getProfile returns valid profile with skills and experience", async () => {
    const profile = await getProfile();
    assert.ok(profile);
    assert.ok(profile.headline);
    assert.ok(Array.isArray(profile.experience));
    assert.ok(Array.isArray(profile.skills));
  });

  test("getHomepageSettings returns hero headline and featured relations", async () => {
    const homepage = await getHomepageSettings();
    assert.ok(homepage);
    assert.ok(homepage.heroHeadline);
    assert.ok(Array.isArray(homepage.featuredProjects));
  });

  test("getPublishedProjects returns only published projects (no drafts)", async () => {
    const projects = await getPublishedProjects();
    assert.ok(projects.length > 0);
    for (const project of projects) {
      assert.equal(project._status, "published");
    }
  });

  test("getPublishedProjects filters by projectType correctly", async () => {
    const professionalProjects = await getPublishedProjects({
      projectType: "professional",
    });
    assert.ok(professionalProjects.length > 0);
    for (const project of professionalProjects) {
      assert.equal(project.projectType, "professional");
    }
  });

  test("getProjectBySlug returns published project and rejects drafts", async () => {
    const published = await getProjectBySlug("webhook-processing-pipeline");
    assert.ok(published);
    assert.equal(published?.slug, "webhook-processing-pipeline");
    assert.equal(published?._status, "published");

    // Draft project fixture: 'draft-query-cache-experiment' MUST return null to anonymous users
    const draft = await getProjectBySlug("draft-query-cache-experiment");
    assert.equal(draft, null);

    // Non-existent slug MUST return null
    const missing = await getProjectBySlug("non-existent-project-slug");
    assert.equal(missing, null);
  });

  test("getPublishedPosts returns only published posts (no drafts)", async () => {
    const posts = await getPublishedPosts();
    assert.ok(posts.length > 0);
    for (const post of posts) {
      assert.equal(post._status, "published");
    }
  });

  test("getPostBySlug returns published post and rejects drafts", async () => {
    const published = await getPostBySlug("designing-idempotent-webhook-handlers");
    assert.ok(published);
    assert.equal(published?.slug, "designing-idempotent-webhook-handlers");
    assert.equal(published?._status, "published");

    // Draft post fixture: 'draft-internal-database-notes' MUST return null to anonymous users
    const draft = await getPostBySlug("draft-internal-database-notes");
    assert.equal(draft, null);

    // Non-existent slug MUST return null
    const missing = await getPostBySlug("non-existent-post-slug");
    assert.equal(missing, null);
  });
});
