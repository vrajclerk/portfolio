import path from "path";
import { fileURLToPath } from "url";
import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";

import { Categories } from "@/collections/Categories";
import { Media } from "@/collections/Media";
import { Posts } from "@/collections/Posts";
import { Projects } from "@/collections/Projects";
import { Tags } from "@/collections/Tags";
import { Users } from "@/collections/Users";

import { HomepageSettings } from "@/globals/HomepageSettings";
import { Profile } from "@/globals/Profile";
import { SiteSettings } from "@/globals/SiteSettings";

import { migrations } from "@/migrations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, Tags, Posts, Projects],
  globals: [SiteSettings, Profile, HomepageSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "development_fallback_secret_must_be_changed",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || "",
    },
    push: false,
    prodMigrations: migrations,
  }),
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            enabled: true,
            collections: {
              media: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
});
