import type { InferSelectModel } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTableCreator,
  text,
} from "drizzle-orm/sqlite-core";

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

export const accountsTable = createTable(
  "account",
  {
    providerId: text("provider_id", { length: 255 }).notNull(),
    providerUserId: text("provider_user_id", { length: 255 }).notNull(),
    userId: text("user_id", { length: 255 })
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.providerId, table.providerUserId] }),
  }),
);

export const coursesTable = createTable(
  "course",
  {
    id: text("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name", { length: 255 }).notNull(),
    description: text("description"), // optional
    startDate: integer("start_date", { mode: "timestamp" }).notNull(),
    endDate: integer("end_date", { mode: "timestamp" }).notNull(),
    credits: real("credits"), // optional,
    code: text("code", { length: 255 }), // optional
    userId: text("user_id", { length: 255 }).references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  },
  (table) => {
    return {
      userIdIdx: index("course_user_id_idx").on(table.userId),
    };
  },
);

export const assignmentsTable = createTable(
  "assignment",
  {
    id: text("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name", { length: 255 }).notNull(),
    description: text("description", { length: 255 }), // optional
    dueDate: integer("due_date", { mode: "timestamp" }).notNull(),
    points: integer("points").notNull(),
    type: text("type", {
      enum: ["homework", "quiz", "project", "exam"],
    }).notNull(),
    userId: text("user_id", { length: 255 }).references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    courseId: text("course_id", { length: 255 }).references(
      () => coursesTable.id,
      {
        onDelete: "cascade",
        onUpdate: "cascade",
      },
    ),
  },
  (table) => {
    return {
      userIdIdx: index("assignment_user_id_idx").on(table.userId),
      courseIdIdx: index("assignment_course_id_idx").on(table.courseId),
    };
  },
);

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
export type VerificationCode = InferSelectModel<typeof verificationCodeTable>;
export type Account = InferSelectModel<typeof accountsTable>;
export type Course = InferSelectModel<typeof coursesTable>;
export type Assignment = InferSelectModel<typeof assignmentsTable>;
