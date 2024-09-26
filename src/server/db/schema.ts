// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTableCreator,
  text,
} from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `studdy_${name}`);

export const posts = createTable(
  "post",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name", { length: 256 }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const userTable = createTable("user", {
  id: text("id", { length: 255 }).primaryKey(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
  email: text("email", { length: 255 }).unique().notNull(),
  password: text("password", { length: 255 }),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .default(false)
    .notNull(),
});

export const sessionTable = createTable("session", {
  id: text("id", { length: 255 }).primaryKey(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),

  userId: text("user_id", { length: 255 })
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
});

export const verificationCodeTable = createTable("verification_code", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull(),
  userId: text("user_id", { length: 255 })
    .unique()
    .notNull()
    .references(() => userTable.id),
  email: text("email", { length: 255 }).notNull(),
  expiresAt: integer("expires_at").notNull(),
});

// course table
// assignment table
