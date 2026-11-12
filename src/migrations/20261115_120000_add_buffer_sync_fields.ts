import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "source" varchar DEFAULT 'native';
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "buffer_post_id" varchar;
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "linkedin_url" varchar;
    CREATE UNIQUE INDEX IF NOT EXISTS "posts_buffer_post_id_idx" ON "posts" ("buffer_post_id");

    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_source" varchar DEFAULT 'native';
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_buffer_post_id" varchar;
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_linkedin_url" varchar;
    CREATE INDEX IF NOT EXISTS "_posts_v_version_buffer_post_id_idx" ON "_posts_v" ("version_buffer_post_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "posts_buffer_post_id_idx";
    DROP INDEX IF EXISTS "_posts_v_version_buffer_post_id_idx";

    ALTER TABLE "posts" DROP COLUMN IF EXISTS "source";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "buffer_post_id";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "linkedin_url";

    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_source";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_buffer_post_id";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_linkedin_url";
  `);
}

