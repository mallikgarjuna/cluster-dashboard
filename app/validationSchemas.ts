import { z } from "zod";

// grant form schema
// rename grantSchema to grantFormSchema
export const grantFormSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255),
  description: z.string().min(1, "Description is required.").max(65535),
  acronym: z.string().optional(),
  budgetTotal: z.number().optional(),
  submissionDate: z.coerce.date().optional(),
  deadline: z.coerce.date().optional(),
  decisionDate: z.coerce.date().optional(),
  notes: z.string().optional(),
});

export type GrantFormDataType = z.infer<typeof grantFormSchema>;

export const patchGrantSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255).optional(),
  description: z
    .string()
    .min(1, "Description is required.")
    .max(65535)
    .optional(),
  assignedToUserId: z
    .string()
    .min(1, "AssignedToUserId is required")
    .max(255)
    .optional()
    .nullable(),
  acronym: z.string().optional(),
  budgetTotal: z.number().optional(),
  submissionDate: z.coerce.date().optional(),
  deadline: z.coerce.date().optional(),
  decisionDate: z.coerce.date().optional(),
  notes: z.string().optional(),
});

export const SigninFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string({
    required_error: "Please enter your password",
  }),
});

export type SigninFormInputFieldsType = z.infer<typeof SigninFormSchema>;

export type SigninFormInputFieldsName = keyof SigninFormInputFieldsType;

// Signup form schema
export const SignupFormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(45, "First name must be less than 45 characters")
      .regex(
        new RegExp("^[a-zA-Z0-9]+$"),
        "No special characters are allowed!"
      ),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(45, "Last name must be less than 45 characters")
      .regex(
        new RegExp("^[a-zA-Z0-9]+$"),
        "No special characters are allowed!"
      ),
    email: z.string().email("Please enter a valid email address"),
    // .endsWith("@umcg.nl", "Please enter a valid UMCG email address"),
    password: z
      .string()
      .min(5, "Password must be at least 5 characters long")
      .max(45, "Password must be less than 45 characters long"),
    confirmPassword: z
      .string()
      .min(5, "Password must be at least 5 characters long")
      .max(45, "Password must be less than 45 characters long"),
    accepted: z.literal(true, {
      errorMap: () => ({
        message: "Please accept the terms and conditions",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and Confirm password do not match",
    path: ["confirmPassword"],
  });

export type SignupFormInputFieldsDataType = z.infer<typeof SignupFormSchema>;

export type SignupFormInputFieldsName = keyof SignupFormInputFieldsDataType;

// type for user activation API
export type ActivateUserDataType = {
  token: string;
};
