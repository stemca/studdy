"use client";

import { useFormStatus } from "react-dom";

import { Button } from "~/components/ui/button";

interface SubmitButtonProps {
  title: string;
  disabled?: boolean;
  className?: string;
}

export default function SubmitButton({
  title,
  disabled,
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} className={className}>
      {title}
    </Button>
  );
}
