import { z } from "zod";

const envSchema = z.object({
	DATABASE_URL: z.string(),
	AUTH_TOKEN: z.string(),
	NODE_ENV: z.enum(["development", "production"]),
	RESEND_API_KEY: z.string(),
});

export const env = envSchema.parse({
	DATABASE_URL: process.env.DATABASE_URL,
	AUTH_TOKEN: process.env.AUTH_TOKEN,
	NODE_ENV: process.env.NODE_ENV || "development",
	RESEND_API_KEY: process.env.RESEND_API_KEY,
});
