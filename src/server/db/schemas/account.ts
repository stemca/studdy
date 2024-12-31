import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { usersTable } from "./user";
import { timestamps } from "../timestamps";

export const accountsTable = sqliteTable(
	"account_table",
	{
		...timestamps,
		providerId: text("provider_id", { length: 255 }).notNull(),
		providerUserId: text("provider_user_id", { length: 255 }).notNull(),
		userId: text("user_id", { length: 255 })
			.notNull()
			.references(() => usersTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
	},
	(t) => [primaryKey({ columns: [t.providerId, t.providerUserId] })],
);
