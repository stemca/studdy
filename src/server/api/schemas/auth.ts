import { oz } from "@orpc/zod";
import { z } from "zod";

export const CredentialsSchema = oz.openapi(
	z.object({
		email: z.string().email(),
		password: z.string(),
	}),
	{
		examples: [
			{
				email: "user@example.com",
				password: "password",
			},
		],
	},
);

export const TokenSchema = oz.openapi(
	z.object({
		token: z.string(),
		session: z.object({
			id: z.string(),
			userId: z.string(),
			expiresAt: z.number().int(),
		}),
	}),
	{
		examples: [
			{
				token: "session-token",
				session: {
					id: "id",
					userId: "userId",
					expiresAt: 12319,
				},
			},
		],
	},
);
