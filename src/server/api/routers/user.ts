import { hash, verify } from "@node-rs/argon2";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

import { signInSchema } from "~/app/auth/login/schema";
import { signUpSchema } from "~/app/auth/register/schema";
import { verifyEmailSchema } from "~/app/auth/verify-email/schema";
import { createSession, generateSessionToken } from "~/server/auth";
import { userTable, verificationCodeTable } from "~/server/db/schema";
import { generateEmailVerificationCode } from "../helpers/code";
import { sendVerificationEmail } from "../helpers/email";
import { authedProcedure, createTRPCRouter, publicProcedure } from "../trpc";

/**
 * User and authentication methods
 * forgotPassword
 * resetPassword
 */
export const userRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { email, password } = input;

      await db.transaction(async (tx) => {
        const user = await tx.query.userTable.findFirst({
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

        const newUsers = await tx
          .insert(userTable)
          .values({
            email: email,
            password: passwordHash,
          })
          .returning({ insertedId: userTable.id });

        if (newUsers.length < 1 || newUsers[0]?.insertedId === undefined) {
          tx.rollback();
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Something went wrong, please try again later.",
          });
        }

        const userId = newUsers[0].insertedId;

        await tx
          .delete(verificationCodeTable)
          .where(eq(verificationCodeTable.userId, userId));

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        await tx.insert(verificationCodeTable).values({
          userId,
          email,
          code,
          expiresAt: Math.floor(Date.now() / 1000) + 15 * 60,
        });

        const { error } = await sendVerificationEmail({ email, code });
        if (error) {
          tx.rollback();
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Something went wrong, please try again later.",
          });
        }
      });
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
        return null;
      }
      // if email is validated, create session
      const sessionToken = generateSessionToken();
      const session = await createSession(sessionToken, existingUser.id);

      return { session, sessionToken };
    }),
  verifyEmail: publicProcedure
    .input(verifyEmailSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      const verificationCode = await db.query.verificationCodeTable.findFirst({
        where: and(
          eq(verificationCodeTable.email, input.email),
          eq(verificationCodeTable.code, input.code),
        ),
      });
      console.log(verificationCode);

      if (!verificationCode) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Incorrect verification code.",
        });
      }

      if (verificationCode.expiresAt < Math.floor(Date.now() / 1000)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Verification code has expired.",
        });
      }

      await db
        .update(userTable)
        .set({
          emailVerified: true,
        })
        .where(eq(userTable.email, input.email));

      await db
        .delete(verificationCodeTable)
        .where(eq(verificationCodeTable.id, verificationCode.id));

      const sessionToken = generateSessionToken();
      const session = await createSession(
        sessionToken,
        verificationCode.userId,
      );

      return { session, sessionToken };
    }),
});
