"use client";

import { useFormState } from "react-dom";

import type { ActionState } from "~/@types/action-state";
import { logoutAction } from "~/app/actions";
import SubmitButton from "./submit-btn";

const initialState: ActionState = {
  message: undefined,
};

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const [, action] = useFormState(logoutAction, initialState);
  return (
    <form action={action}>
      <SubmitButton title="Sign out" className={className} />
    </form>
  );
}
