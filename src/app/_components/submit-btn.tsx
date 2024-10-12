"use client";

import { useFormStatus } from "react-dom";

import { Button } from "~/components/ui/button";

interface SubmitButtonProps {
  title: string;
  disabled?: boolean;
}

export default function SubmitButton({ title, disabled }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled}>
      {title}
    </Button>
  );
}
