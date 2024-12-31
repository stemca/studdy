import type { Client } from "@libsql/client";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "~/env";
import * as accounts from "./schemas/account";
import * as users from "./schemas/user";
import * as sessions from "./schemas/session";
import * as verificationCodes from "./schemas/verification-code";
import * as courses from "./schemas/course";
import * as assignments from "./schemas/assignment";

const schema = {
	...accounts,
	...users,
	...sessions,
	...verificationCodes,
	...courses,
	...assignments,
};

const globalForDb = globalThis as unknown as {
	client: Client | undefined;
};

const client =
	globalForDb.client ??
	createClient({
		url: env.DATABASE_URL,
		authToken: env.AUTH_TOKEN,
	});

if (env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema, logger: true });
