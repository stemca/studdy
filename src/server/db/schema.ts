import type { InferSelectModel } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { integer, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

export const createTable = sqliteTableCreator((name) => `studdy_${name}`);

export const userTable = createTable("user", {
  id: text("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => createId()),
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
  id: text("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => createId()),

  userId: text("user_id", { length: 255 })
    .notNull()
    .references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  expiresAt: integer("expires_at").notNull(),
});

export const verificationCodeTable = createTable("verification_code", {
  id: text("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => createId()),
  code: text("code").notNull(),
  userId: text("user_id", { length: 255 })
    .unique()
    .notNull()
    .references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  email: text("email", { length: 255 }).notNull(),
  expiresAt: integer("expires_at").notNull(),
});

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
export type VerificationcODE = InferSelectModel<typeof verificationCodeTable>;

// course table
// assignment table
