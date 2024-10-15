import { z } from "zod";

export const verifyEmailSchema = z.object({
  code: z.string().min(6, {
    message: "Your verification code must be 6 characters.",
  }),
  email: z.string().email(),
});

export type VerifyEmailType = z.infer<typeof verifyEmailSchema>;
