"use server";

import { TRPCError } from "@trpc/server";
import { redirect } from "next/navigation";

import type { ActionState } from "~/@types/action-state";
import { signUpSchema } from "~/@validators/sign-up";
import { api } from "~/trpc/server";

export const registerAction = async (
  _prevState: ActionState,
  data: FormData,
): Promise<ActionState> => {
  const formData = Object.fromEntries(data);
  const parsed = signUpSchema.safeParse(formData);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key] ? formData[key].toString() : `Invalid ${key}`;
    }
    return {
      message: "Invalid form data",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const { email, password } = parsed.data;
    await api.user.signUp({ email, password });
    return redirect("/auth/verify-email");
  } catch (error) {
    if (error instanceof TRPCError) {
      return { message: error.message };
    }

    return { message: "Something went wrong, please try again later." };
  }
};
