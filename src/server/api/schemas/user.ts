import { oz } from "@orpc/zod";
import { z } from "zod";

export const NewUserSchema = oz.openapi(
	z.object({
		email: z.string().email(),
		password: z.string(),
		emailVerified: z.boolean().default(false),
	}),
	{
		examples: [
			{ email: "user@example.com", password: "password", emailVerified: false },
		],
	},
);

export const UserSchema = oz.openapi(
	z.object({
		id: z.string().cuid2(),
		email: z.string().email(),
		emailVerified: z.boolean(),
	}),
	{
		examples: [
			{
				id: "tz4a98xxat96iws9zmbrgj3a",
				email: "user@example.com ",
				emailVerified: true,
			},
		],
	},
);
