import { config } from "dotenv";
config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { env } from "@/env";

export async function runMigrations() {
  console.log(
    `Running migrations on database: ${env.DATABASE_URL.split("@")[1]}`
  );
  const migrationClient = postgres(env.DATABASE_URL, { max: 1 });
  const db = drizzle(migrationClient);

  await migrate(db, { migrationsFolder: "src/infra/db/migrations" });
  console.log("Migrations applied successfully! ✅");
  await migrationClient.end();
}

if (require.main === module) {
  runMigrations().catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
}
