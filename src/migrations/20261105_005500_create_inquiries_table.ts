import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "inquiries" (
      "id" serial PRIMARY KEY,
      "name" varchar NOT NULL,
      "email" varchar NOT NULL,
      "company" varchar,
      "topic" varchar DEFAULT 'collaboration',
      "subject" varchar,
      "message" text NOT NULL,
      "status" varchar DEFAULT 'new',
      "email_sent" boolean DEFAULT false,
      "email_error" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "inquiries_created_at_idx" ON "inquiries" ("created_at");
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "inquiries_id" integer;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "inquiries";
  `);
}
