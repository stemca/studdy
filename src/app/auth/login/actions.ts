"use server";

import { TRPCError } from "@trpc/server";
import { redirect } from "next/navigation";

import type { ActionState } from "~/@types/action-state";
import { setSessionCookie } from "~/server/auth";
import { api } from "~/trpc/server";
import { signInSchema } from "./schema";

export const loginAction = async (
  _prevState: ActionState,
  data: FormData,
): Promise<ActionState> => {
  const formData = Object.fromEntries(data);
  const parsed = signInSchema.safeParse(formData);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key]
        ? JSON.stringify(formData[key])
        : "Invalid field";
    }
    return {
      message: "Invalid form data",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  let isEmailVerified = false;
  try {
    const { email, password } = parsed.data;
    const response = await api.user.signIn({ email, password });

    if (response) {
      isEmailVerified = true;
      const { session, sessionToken } = response;
      setSessionCookie(sessionToken, session.expiresAt);
    }
  } catch (error) {
    if (error instanceof TRPCError) {
      return { message: error.message };
    }

    return { message: "Something went wrong, please try again later." };
  }

  if (isEmailVerified) {
    redirect("/home");
  } else {
    redirect(`/auth/verify-email/${parsed.data.email}`);
  }
};
