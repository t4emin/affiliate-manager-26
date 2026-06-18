"use client";

import { Chrome } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type OAuthSubmitButtonProps = {
  label: string;
  pendingLabel: string;
};

export function OAuthSubmitButton({
  label,
  pendingLabel,
}: OAuthSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="outline"
      className="w-full"
      disabled={pending}
      aria-disabled={pending}
    >
      <Chrome className="h-4 w-4" aria-hidden="true" />
      {pending ? pendingLabel : label}
    </Button>
  );
}
