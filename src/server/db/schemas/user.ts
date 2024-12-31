import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

import { timestamps } from "../timestamps";

export const usersTable = sqliteTable(
	"users_table",
	{
		...timestamps,
		id: text("id", { length: 255 })
			.primaryKey()
			.$defaultFn(() => createId()),
		email: text("email", { length: 255 }).unique().notNull(),
		password: text("password", { length: 255 }),
		emailVerified: integer("email_verified", { mode: "boolean" }).default(
			false,
		),
	},
	(t) => [index("users_email_idx").on(t.email)],
);

export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
