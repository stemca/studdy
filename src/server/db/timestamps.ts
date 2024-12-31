import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/sqlite-core";

export const timestamps = {
	createdAt: integer("created_at", { mode: "timestamp_ms" }).default(
		sql`(unixepoch() * 1000)`,
	),
};
