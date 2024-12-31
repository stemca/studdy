import { cache } from "react";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import {
	encodeBase32LowerCaseNoPadding,
	encodeHexLowerCase,
} from "@oslojs/encoding";

import { sessionsTable, type Session } from "~/server/db/schemas/session";
import { usersTable, type User } from "~/server/db/schemas/user";
import { db } from "~/server/db";

export const generateSessionToken = (): string => {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	return encodeBase32LowerCaseNoPadding(bytes);
};

export const createSession = async (
	token: string,
	userId: string,
): Promise<Session> => {
	const sessionId = encodeHexLowerCase(new TextEncoder().encode(token));
	const session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).getTime(),
	} satisfies Session;

	await db.insert(sessionsTable).values(session);

	return session;
};

export const validateSessionToken = async (
	token: string,
): Promise<SessionValidationResult> => {
	const sessionId = encodeHexLowerCase(new TextEncoder().encode(token));
	const result = await db
		.select({ user: usersTable, session: sessionsTable })
		.from(sessionsTable)
		.innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
		.where(eq(sessionsTable.id, sessionId));

	if (result.length < 1 || !result[0]) {
		return { session: null, user: null };
	}

	const { session, user } = result[0];

	if (Date.now() >= session.expiresAt - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(
			Date.now() + 1000 * 60 * 60 * 24 * 30,
		).getTime();

		await db
			.update(sessionsTable)
			.set({ expiresAt: session.expiresAt })
			.where(eq(sessionsTable.id, session.id));
	}

	return { session, user };
};

export const invalidateSession = async (sessionId: string): Promise<void> => {
	await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
};

export const setSessionCookie = async (token: string, expiresAt: number) => {
	(await cookies()).set("studdy_session_cookie", token, {
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		expires: expiresAt,
	});
};

export const getCurrentSession = cache(
	async (): Promise<SessionValidationResult> => {
		const token = (await cookies()).get("studdy_session_cookie")?.value ?? null;
		if (token === null) {
			return { session: null, user: null };
		}

		const result = await validateSessionToken(token);
		return result;
	},
);

export const deleteSessionCookie = async (): Promise<void> => {
	(await cookies()).set("studdy_session_cookie", "", {
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 0,
	});
};

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };
