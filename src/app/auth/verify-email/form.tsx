"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useSearchParams } from "next/navigation";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";

import type { VerifyEmailType } from "./schema";
import type { ActionState } from "~/@types/action-state";
import SubmitButton from "~/app/_components/submit-btn";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { useToast } from "~/hooks/use-toast";
import { verifyEmailAction } from "./actions";
import { verifyEmailSchema } from "./schema";

const initialState: ActionState = {
  message: undefined,
};

export default function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  // let the user know that an email address is required to access this page
  if (!email) {
    redirect("/");
  }

  const { toast } = useToast();

  const [state, formAction] = useFormState(verifyEmailAction, initialState);
  const form = useForm<VerifyEmailType>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
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
  }, [state, toast]);

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification code</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Enter the verification code sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <input type="hidden" name="email" value={email} />
        <SubmitButton title="Submit" />
      </form>
    </Form>
  );
}
