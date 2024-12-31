import { createId } from "@paralleldrive/cuid2";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { timestamps } from "../timestamps";
import { usersTable } from "./user";

export const verificationCodesTable = sqliteTable(
	"verification_code_table",
	{
		...timestamps,
		id: text("id", { length: 255 })
			.primaryKey()
			.$defaultFn(() => createId()),
		code: text("code", { length: 6 }).notNull(),
		userId: text("user_id", { length: 255 })
			.unique()
			.references(() => usersTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			})
			.notNull(),
		email: text("email", { length: 255 }).notNull(),
		expiresAt: integer("expires_at").notNull(),
	},
	(t) => [index("verification_codes_email_idx").on(t.userId)],
);
