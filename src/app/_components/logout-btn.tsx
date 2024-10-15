"use client";

import { useFormState } from "react-dom";

import { ActionState } from "~/@types/action-state";
import { logoutAction } from "~/app/actions";
import SubmitButton from "./submit-btn";

const initialState: ActionState = {
  message: undefined,
};

export function LogoutButton() {
  const [, action] = useFormState(logoutAction, initialState);
  return (
    <form action={action}>
      <SubmitButton title="Sign out" />
    </form>
  );
}
