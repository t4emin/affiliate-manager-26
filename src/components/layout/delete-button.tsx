"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  alertActionClassName,
  alertCancelClassName,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type DeleteButtonProps = {
  action: () => Promise<void>;
  label?: string;
  description?: string;
};

export function DeleteButton({
  action,
  label = "Delete",
  description = "This action cannot be undone.",
}: DeleteButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive">
          {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm delete</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={alertCancelClassName}>
            Cancel
          </AlertDialogCancel>
          <form action={action}>
            <AlertDialogAction className={alertActionClassName} type="submit">
              Delete
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
