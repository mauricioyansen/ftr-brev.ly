import {
  pgTable,
  text,
  integer,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const links = pgTable("links", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  code: varchar("code", { length: 50 }).unique().notNull(),
  originalUrl: text("original_url").notNull(),
  accessCount: integer("access_count").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
