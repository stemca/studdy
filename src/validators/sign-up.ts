import { z } from "zod";

const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const signUpSchema = z.object({
  email: z
    .string({ required_error: "Email address required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .regex(regex, {
      message:
        "Password must contain at mix of lowercase and uppercase ketters, one number, and one special character.",
    })
    .min(8, { message: "Password must be between 8 and 32 characters." })
    .max(32, {
      message: "Password must be between 8 and 32 characters.",
    }),
});

export type SignUpType = z.infer<typeof signUpSchema>;
