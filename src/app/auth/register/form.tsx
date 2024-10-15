"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";

import type { SignUpType } from "./schema";
import type { ActionState } from "~/@types/action-state";
import SubmitButton from "~/app/_components/submit-btn";
import { Card, CardContent } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useToast } from "~/hooks/use-toast";
import { registerAction } from "./actions";
import { signUpSchema } from "./schema";

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

  const { toast } = useToast();

  useEffect(() => {
    // message will only be present if there is an error
    if (state.message !== undefined) {
      toast({
        description: state.message,
        variant: "destructive",
      });
    }
  }, [toast, state]);

  return (
    <Card className="w-full max-w-lg">
      <CardContent>
        <Form {...form}>
          <form action={formAction} className="w-full space-y-8 px-4 py-3">
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
              className="w-full"
              title="Sign up"
              disabled={Object.keys(form.formState.errors).length > 0}
            />
          </form>
        </Form>
      </CardContent>
      {/* @TODO: create oauth logins with google and discord */}
    </Card>
  );
}
