"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type AuthFormShellProps = {
  action: (formData: FormData) => Promise<void>;
  children: ReactNode;
  error?: string;
  pendingDescription: string;
  pendingLabel: string;
  submitLabel: string;
};

function SubmitButton({
  submitted,
  pendingLabel,
  submitLabel,
}: {
  submitted: boolean;
  pendingLabel: string;
  submitLabel: string;
}) {
  const { pending } = useFormStatus();
  const disabled = pending || submitted;

  return (
    <Button
      type="submit"
      className="w-full"
      disabled={disabled}
      aria-disabled={disabled}
    >
      {disabled ? pendingLabel : submitLabel}
    </Button>
  );
}

export function AuthFormShell({
  action,
  children,
  error,
  pendingDescription,
  pendingLabel,
  submitLabel,
}: AuthFormShellProps) {
  const [submitted, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(Boolean(error));

  return (
    <>
      <AlertDialog open={showError} onOpenChange={setShowError}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Authentication failed</AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowError(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={submitted}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Please wait</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      <form
        action={action}
        className="space-y-4"
        onSubmit={() => setSubmitted(true)}
      >
        {children}
        <SubmitButton
          submitted={submitted}
          pendingLabel={pendingLabel}
          submitLabel={submitLabel}
        />
      </form>
    </>
  );
}
