import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (error: unknown) => {
  let message: string;

  if (error instanceof ZodError) {
    let errorMessage = "";
    let errors = error.flatten().fieldErrors;
    for (const [key, value] of Object.entries(errors)) {
      if (value && value.length > 0) {
        errorMessage += `${key}: ${value[0]}\n`;
      }
    }
    message = errorMessage;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message); // or error.message as string;
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "Unknown error. Something went wrong.";
  }

  return message;
};
