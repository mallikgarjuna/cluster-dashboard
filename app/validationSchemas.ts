import { StatusGrant, UserRole } from "@prisma/client";
import { z } from "zod";

// grant form schema
// rename grantSchema to grantFormSchema
export const grantFormSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255),
  description: z.string().min(1, "Description is required.").max(65535),
  acronym: z.string().optional(),
  budgetTotal: z.number().optional(),
  fundingAgency: z.string().optional(),
  fundingProgramme: z.string().optional(),
  fundingCall: z.string().optional(),
  submissionDate: z.optional(z.union([z.coerce.date(), z.literal("")])),
  deadline: z.optional(z.union([z.coerce.date(), z.literal("")])),
  decisionDate: z.optional(z.union([z.coerce.date(), z.literal("")])),
  projectStartDate: z.optional(z.union([z.coerce.date(), z.literal("")])),
  notes: z.string().optional(),
  assignedToUserId: z.string(),
  status: z.nativeEnum(StatusGrant),
  projectNumber: z.number().optional().nullable(),
  // .refine((value) => String(value).length === 6, {
  //   message: "Project number must be exactly 6 digits",
  //   path: ["projectNumber"],
  // })
});

export type GrantFormDataType = z.infer<typeof grantFormSchema>;
// export const statuses = Object.values(StatusGrant);

export const patchGrantSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255).optional(),
  description: z
    .string()
    .min(1, "Description is required.")
    .max(65535)
    .optional(),
  acronym: z.string().optional(),
  budgetTotal: z.number().optional(),
  fundingAgency: z.string().optional(),
  fundingProgramme: z.string().optional(),
  fundingCall: z.string().optional(),
  submissionDate: z.optional(z.union([z.coerce.date(), z.literal("")])),
  deadline: z.optional(z.union([z.coerce.date(), z.literal("")])),
  decisionDate: z.optional(z.union([z.coerce.date(), z.literal("")])),
  projectStartDate: z.optional(z.union([z.coerce.date(), z.literal("")])),
  notes: z.string().optional(),
  assignedToUserId: z
    .string()
    .min(1, "AssignedToUserId is required")
    .max(255)
    .optional()
    .nullable(),
  status: z.nativeEnum(StatusGrant),
  projectNumber: z.number().optional().nullable(),
  // .refine((value) => String(value).length === 6, {
  //   message: "Project number must be exactly 6 digits",
  //   path: ["projectNumber"],
  // })
});

export const SigninFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string({
    required_error: "Please enter your password",
  }),
});

export type SigninFormInputType = z.infer<typeof SigninFormSchema>;

export type SigninFormInputFieldsName = keyof SigninFormInputType;

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

export type SignupFormInputType = z.infer<typeof SignupFormSchema>;

export type SignupFormInputFieldsName = keyof SignupFormInputType;

// Signup form schema
export const CreateUserFormSchema = z
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
      .min(5, "Password must be at lest 5 characters long")
      .max(45, "Password must be less than 45 characters long"),
    role: z.nativeEnum(UserRole),
    departmentId: z.string(),
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

export type CreateUserFormInputType = z.infer<typeof CreateUserFormSchema>;

// type for user activation API
export type ActivateUserDataType = {
  token: string;
};

export const ForgotPasswordFormSchema = z.object({
  email: z.string().email("Please enter a valid email."),
});

export type ForgotPasswordFormInputType = z.infer<
  typeof ForgotPasswordFormSchema
>;
