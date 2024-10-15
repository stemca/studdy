"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";

import { ActionState } from "~/@types/action-state";
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
import { loginAction } from "./actions";
import { signInSchema, SignInType } from "./schema";

const initialState: ActionState = {
  message: undefined,
};

export default function LoginForm() {
  const [state, formAction] = useFormState(loginAction, initialState);
  const { toast } = useToast();
  const form = useForm<SignInType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    // message will only be present if there is an error
    if (state.message !== undefined) {
      toast({
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state]);

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
