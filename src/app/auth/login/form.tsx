"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";

import type { SignInType } from "./schema";
import type { ActionState } from "~/@types/action-state";
import SubmitButton from "~/app/_components/submit-btn";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { useToast } from "~/hooks/use-toast";
import { loginAction } from "./actions";
import { signInSchema } from "./schema";

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
  }, [toast, state]);

  return (
    <Card className="w-full max-w-lg">
      <CardContent>
        <Form {...form}>
          <form action={formAction} className="space-y-4 pt-4">
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
      <CardFooter className="flex flex-col space-y-5">
        <Separator />

        <Button asChild className="w-full">
          <Link href="/auth/login/discord" prefetch={false}>
            <DiscordLogoIcon className="mr-3 h-5 w-5" />
            Login with Discord
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
