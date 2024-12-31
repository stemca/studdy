import { createId } from "@paralleldrive/cuid2";
import {
	index,
	integer,
	real,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

import { usersTable } from "./user";
import { timestamps } from "../timestamps";

export const coursesTable = sqliteTable(
	"course_table",
	{
		...timestamps,
		id: text("id", { length: 255 })
			.primaryKey()
			.$default(() => createId()),
		name: text("name").notNull(),
		description: text("description", { length: 255 }),
		startDate: integer("start_date", { mode: "timestamp" }).notNull(),
		endDate: integer("end_date", { mode: "timestamp" }).notNull(),
		credits: real("credits"),
		code: text("code"),
		userId: text("user_id", { length: 255 })
			.notNull()
			.references(() => usersTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
	},
	(t) => [index("course_user_id_idx").on(t.userId)],
);
