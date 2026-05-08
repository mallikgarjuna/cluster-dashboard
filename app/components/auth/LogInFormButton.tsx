"use client";
// not necessary to make this a CC
// b/c the LoginForm is already a CC b/c of using `useForm()` hook and we're importing this into the LoginForm
// but still make it a CC explicitly for clarity;

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export default function LogInFormButton() {
  // Renaming `pending` to `isSubmitting` the parent form, for clarity;
  const { pending: isSubmitting } = useFormStatus();

  return (
    <Button type="submit" disabled={isSubmitting} className="min-w-32">
      {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
      Log in
    </Button>
  );
}
