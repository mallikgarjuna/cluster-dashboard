"use client";
// not necessary to make this a CC
// b/c the LoginForm is already a CC b/c of using `useForm()` hook and we're importing this into the LoginForm
// but still make it a CC explicitly for clarity;

import { Button } from "@nextui-org/react";
import { useFormStatus } from "react-dom";

export default function LogInFormButton() {
  // Renaming `pending` to `isSubmitting` the parent form, for clarity;
  const { pending: isSubmitting } = useFormStatus();

  return (
    <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
      Log in
    </Button>
  );
}
