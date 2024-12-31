import { ORPCError, os } from "@orpc/server";
import { headers } from "next/headers";
import { db } from "~/server/db";
import { validateSessionToken } from "~/server/auth/session";

const base = os
	.use(async (input, context, meta) => {
		const start = Date.now();

		try {
			return await meta.next({});
		} catch (e) {
			console.error(e);
			throw e;
		} finally {
			console.log(`[${meta.path.join("/")}] ${Date.now() - start}ms`);
		}
	})
	.use(async (input, context, meta) => {
		const headersList = await headers();

		const token = headersList.get("authorization");
		if (!token) {
			return meta.next({
				context: {
					db: db,
					user: null,
				},
			});
		}

		const result = await validateSessionToken(token);
		return meta.next({
			context: {
				db: db,
				user: result.user,
			},
		});
	});

export const pub = base;

export const authed = pub.use(async (input, context, meta) => {
	if (context.user) {
		throw new ORPCError({
			code: "UNAUTHORIZED",
			message: "You must be logged in to perform this action",
		});
	}

	return meta.next({
		context: {
			user: context.user,
		},
	});
});
