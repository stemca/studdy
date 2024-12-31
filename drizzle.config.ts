import type { Config } from "drizzle-kit";

import { env } from "~/env";

export default {
	schema: "./src/server/db/schemas/*",
	dialect: "turso",
	dbCredentials: {
		url: env.DATABASE_URL,
		authToken: env.AUTH_TOKEN,
	},
	verbose: true,
	tablesFilter: ["studdy_*"],
} satisfies Config;
