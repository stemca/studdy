"use server";

import { TRPCError } from "@trpc/server";
import { redirect } from "next/navigation";

import type { ActionState } from "~/@types/action-state";
import { setSessionCookie } from "~/server/auth";
import { api } from "~/trpc/server";
import { verifyEmailSchema } from "./schema";

export const verifyEmailAction = async (
  _prevState: ActionState,
  data: FormData,
): Promise<ActionState> => {
  const formData = Object.fromEntries(data);
  const parsed = verifyEmailSchema.safeParse(formData);

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

  try {
    const { code, email } = parsed.data;
    const { session, sessionToken } = await api.user.verifyEmail({
      code,
      email,
    });
    setSessionCookie(sessionToken, session.expiresAt);
  } catch (error) {
    if (error instanceof TRPCError) {
      return { message: error.message };
    }

    return { message: "Something went wrong, please try again later." };
  }

  redirect("/home");
};
