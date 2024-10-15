"use server";

import { redirect } from "next/navigation";

import { ActionState } from "~/@types/action-state";
import {
  deleteSessionCookie,
  getCurrentSession,
  invalidateSession,
} from "~/server/auth";

export const logoutAction = async (): Promise<ActionState> => {
  const { session } = await getCurrentSession();
  if (session == null) {
    return {
      message: "Not authenticated",
    };
  }

  await invalidateSession(session.id);
  deleteSessionCookie();
  redirect("/");
};
