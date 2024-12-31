"use server";

import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";

import { authed, pub } from "~/server/api";
import { CredentialsSchema, TokenSchema } from "~/server/api/schemas/auth";
import { NewUserSchema, UserSchema } from "~/server/api/schemas/user";
import { hashPassword, verifyPassword } from "~/server/auth/password";
import { createSession, generateSessionToken } from "~/server/auth/session";
import { usersTable } from "~/server/db/schemas/user";
import { verificationCodesTable } from "~/server/db/schemas/verification-code";

export const signUp = pub
	.input(NewUserSchema)
	.output(UserSchema)
	.handler(async (input, context, meta) => {
		const existingUser = await context.db.query.usersTable.findFirst({
			where: eq(usersTable.email, input.email),
		});
		if (existingUser) {
			throw new ORPCError({
				code: "CONFLICT",
				message: "User already exists with this email.",
			});
		}

		const hashedPassword = await hashPassword(input.password);

		const result = await context.db
			.insert(usersTable)
			.values({
				email: input.email,
				password: hashedPassword,
			})
			.returning();

		if (result.length < 1 || !result[0]) {
			throw new ORPCError({
				code: "BAD_REQUEST",
				message: "User creation failed",
			});
		}
		const user = result[0];

		await context.db
			.delete(verificationCodesTable)
			.where(eq(verificationCodesTable.userId, user.id));

		const code = Math.floor(100000 + Math.random() * 900000).toString();

		await context.db.insert(verificationCodesTable).values({
			userId: user.id,
			email: user.email,
			code: code,
			expiresAt: Math.floor(Date.now() / 1000) + 15 * 60,
		});

		return {
			id: user.id,
			email: user.email,
			emailVerified: user.emailVerified ?? false,
		};
	});

export const signIn = pub
	.input(CredentialsSchema)
	.output(TokenSchema)
	.handler(async (input, context, meta) => {
		const user = await context.db.query.usersTable.findFirst({
			where: eq(usersTable.email, input.email),
		});

		if (!user?.password) {
			throw new ORPCError({ code: "BAD_REQUEST", message: "User not found." });
		}

		if (!user || !(await verifyPassword(input.password, user.password))) {
			throw new ORPCError({
				code: "UNAUTHORIZED",
				message: "Invalid email or password",
			});
		}

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id);

		return { token: sessionToken, session };
	});
