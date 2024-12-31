import { createId } from "@paralleldrive/cuid2";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { usersTable } from "./user";

export const sessionsTable = sqliteTable("session_table", {
	id: text("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => createId()),
	userId: text("user_id", { length: 255 })
		.references(() => usersTable.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.notNull(),
	expiresAt: integer("expires_at").notNull(),
});

export type Session = typeof sessionsTable.$inferSelect;
export type SessionInsert = typeof sessionsTable.$inferInsert;
