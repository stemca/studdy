"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { ActionState } from "~/@types/action-state";
import type { SignUpType } from "~/@validators/sign-up";
import { signUpSchema } from "~/@validators/sign-up";
import SubmitButton from "~/app/_components/submit-btn";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { registerAction } from "./actions";

const initialState: ActionState = {
  message: undefined,
};

export function RegisterForm() {
  const [state, formAction] = useFormState(registerAction, initialState);
  const form = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    // message will only be present if there is an error
    if (state.message !== undefined) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Form {...form}>
      <form action={formAction} className="w-full max-w-lg space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="john.doe@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  }
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton
          title="Sign up"
          disabled={
            form.formState.errors.email !== undefined ||
            form.formState.errors.password !== undefined
          }
        />
      </form>
    </Form>
  );
}
