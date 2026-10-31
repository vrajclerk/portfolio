import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_hidden" boolean DEFAULT false;
    ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
    ALTER TABLE "_projects_v" ADD COLUMN IF NOT EXISTS "version_hidden" boolean DEFAULT false;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "hidden";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_hidden";
    ALTER TABLE "projects" DROP COLUMN IF EXISTS "hidden";
    ALTER TABLE "_projects_v" DROP COLUMN IF EXISTS "version_hidden";
  `);
}
