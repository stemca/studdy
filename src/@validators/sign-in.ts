import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string({ required_error: "Password is required" }),
});

export type SignInType = z.infer<typeof signInSchema>;
