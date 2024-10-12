import { hash, verify } from "@node-rs/argon2";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";

import { signInSchema } from "~/@validators/sign-in";
import { signUpSchema } from "~/@validators/sign-up";
import { createSession, generateSessionToken } from "~/server/auth";
import { userTable } from "~/server/db/schema";
import { generateEmailVerificationCode } from "../helpers/code";
import { sendVerificationEmail } from "../helpers/email";
import { createTRPCRouter, publicProcedure } from "../trpc";

/**
 * User and authentication methods
 * signUp
 * signIn
 * signOut
 * verifyEmail
 * forgotPassword
 * resetPassword
 */
export const userRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { email, password } = input;

      const user = await db.query.userTable.findFirst({
        where: eq(userTable.email, email),
      });

      if (user) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A user already exists with this email address.",
        });
      }

      const passwordHash = await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });

      const userId = generateIdFromEntropySize(10);

      await db.insert(userTable).values({
        id: userId,
        email: email,
        password: passwordHash,
      });

      const code = await generateEmailVerificationCode(userId, email);

      await sendVerificationEmail({ email, code });
    }),
  signIn: publicProcedure
    .input(signInSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { email, password } = input;

      const existingUser = await db.query.userTable.findFirst({
        where: eq(userTable.email, email),
      });

      if (!existingUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Incorrect email or password",
        });
      }

      if (!existingUser.password) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You have an account that is signed up with Google or Discord, please use those methods",
        });
      }

      const isValid = await verify(existingUser.password, password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });
      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Incorrect email or password",
        });
      }

      // if email is not validated, ask user to verify email
      if (!existingUser.emailVerified) {
        const code = await generateEmailVerificationCode(
          existingUser.id,
          existingUser.email,
        );
        await sendVerificationEmail({ email, code });
        return;
      }
      // then create session
      const sessionToken = generateSessionToken();
      const session = await createSession(sessionToken, existingUser.id);

      return session;
    }),
});
