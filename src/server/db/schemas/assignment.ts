import {
	index,
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

import { timestamps } from "../timestamps";
import { coursesTable } from "./course";
import { usersTable } from "./user";

export const assignmentsTable = sqliteTable(
	"assignment_table",
	{
		...timestamps,
		name: text("name", { length: 255 }).notNull(),
		description: text("description", { length: 1000 }),
		dueDate: integer("due_date", { mode: "timestamp_ms" }).notNull(),
		points: integer("points").notNull(),
		type: text("type", {
			enum: ["homework", "quiz", "project", "exam"],
		}).notNull(),
		userId: text("user_id", { length: 255 })
			.references(() => usersTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			})
			.notNull(),
		courseId: text("course_id", { length: 255 }).references(
			() => coursesTable.id,
			{
				onUpdate: "cascade",
				onDelete: "cascade",
			},
		),
	},
	(t) => [
		primaryKey({ columns: [t.userId, t.courseId] }),
		index("assignment_user_id_idx").on(t.userId),
		index("assignment_course_id_idx").on(t.courseId),
	],
);
