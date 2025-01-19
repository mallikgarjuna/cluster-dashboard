import {
  StatusGrant,
  UserRole,
  enumApplicantRole,
  enumGroupMemberType,
  enumLocalityType,
  enumSectorType,
} from "@prisma/client";
import { isDataView } from "util/types";
import { z } from "zod";

// grant form schema
// rename grantSchema to grantFormSchema
export const grantFormSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255),
  description: z.string().min(1, "Description is required.").max(65535),
  acronym: z.string().optional(),
  applicantFullName: z.string().optional(),
  budgetTotal: z.number().optional(),
  budgetAssignedToPI: z.number().optional(),
  fundingAgency: z.string().optional(),
  fundingProgramme: z.string().optional(),
  fundingAction: z.string().optional(),
  fundingCall: z.string().optional(),
  urlFundingCall: z.string().optional(),
  submissionDate: z.optional(z.union([z.coerce.date(), z.literal("")])),
  deadline: z.optional(z.union([z.coerce.date(), z.literal("")])),
  decisionDate: z.optional(z.union([z.coerce.date(), z.literal("")])),
  projectStartDate: z.optional(z.union([z.coerce.date(), z.literal("")])),
  projectEndDate: z.optional(z.union([z.coerce.date(), z.literal("")])),
  notes: z.string().optional(),
  assignedToUserId: z.string(),
  groupMemberType: z.nativeEnum(enumGroupMemberType).optional(),
  status: z.nativeEnum(StatusGrant),
  projectNumber: z.number().optional().nullable(),
  applicantRole: z.nativeEnum(enumApplicantRole),
  fundingAgencyId: z.string().optional(),
  fundingProgrammeId: z.string().optional(),
  fundingActionId: z.string().optional(),
  fundingCallId: z.string().optional(),
  isBudgetApproved: z.boolean().optional(),
  isDMPSubmitted: z.boolean().optional(),
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
  applicantFullName: z.string().optional(),
  budgetTotal: z.number().optional(),
  budgetAssignedToPI: z.number().optional(),
  fundingAgency: z.string().optional(),
  fundingProgramme: z.string().optional(),
  fundingAction: z.string().optional(),
  fundingCall: z.string().optional(),
  urlFundingCall: z.string().optional(),
  submissionDate: z.optional(z.union([z.coerce.date(), z.literal("")])),
  deadline: z.optional(z.union([z.coerce.date(), z.literal("")])),
  decisionDate: z.optional(z.union([z.coerce.date(), z.literal("")])),
  projectStartDate: z.optional(z.union([z.coerce.date(), z.literal("")])),
  projectEndDate: z.optional(z.union([z.coerce.date(), z.literal("")])),
  notes: z.string().optional(),
  assignedToUserId: z
    .string()
    .min(1, "AssignedToUserId is required")
    .max(255)
    .optional()
    .nullable(),
  groupMemberType: z.nativeEnum(enumGroupMemberType).optional(),
  status: z.nativeEnum(StatusGrant),
  projectNumber: z.number().optional().nullable(),
  applicantRole: z.nativeEnum(enumApplicantRole),
  fundingAgencyId: z.string().optional(),
  fundingProgrammeId: z.string().optional(),
  fundingActionId: z.string().optional(),
  fundingCallId: z.string().optional(),
  isBudgetApproved: z.boolean().optional(),
  isDMPSubmitted: z.boolean().optional(),
  // .refine((value) => String(value).length === 6, {
  //   message: "Project number must be exactly 6 digits",
  //   path: ["projectNumber"],
  // })
});

export const LoginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string({
    required_error: "Please enter your password",
  }),
});

export type LoginFormInputType = z.infer<typeof LoginFormSchema>;

export type LoginFormInputFieldsName = keyof LoginFormInputType;

// Signup form schema
export const SignupFormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(45, "First name must be less than 45 characters")
      .regex(
        new RegExp("^[a-zA-Z0-9]+$"),
        "No special characters are allowed!",
      ),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(45, "Last name must be less than 45 characters")
      .regex(
        new RegExp("^[a-zA-Z0-9]+$"),
        "No special characters are allowed!",
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
        "No special characters are allowed!",
      ),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(45, "Last name must be less than 45 characters")
      .regex(
        new RegExp("^[a-zA-Z0-9]+$"),
        "No special characters are allowed!",
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

// Schema for createFundingAgencyForm validation
// For the prisma model:
// model FundingAgency {
//   id                String             @id @default(cuid())
//   name              String
//   localityType      enumLocalityType
//   sectorType        enumSectorType
//   url               String?
//   fundingProgrammes FundingProgramme[]
// }
export const CreateFundingAgencyFormSchema = z.object({
  name: z.string().min(1, "Please enter a name").max(45, "Name too long"),
  localityType: z.nativeEnum(enumLocalityType),
  sectorType: z.nativeEnum(enumSectorType),
  url: z.string().url("Please enter a valid URL"),
});

// Type for createFundingAgencyForm Input
export type CreateFundingAgencyFormInputType = z.infer<
  typeof CreateFundingAgencyFormSchema
>;

// Schema for FundingProgrammeForm validation
// Using the prisma mode:
// model FundingProgramme {
//   id                    String         @id @default(cuid())
//   name                  String
//   realatedFundingAgency FundingAgency? @relation(fields: [fundingAgencyId], references: [id])
//   fundingAgencyId       String?
//   fundingCalls          FundingCall[]
// }
export const CreateFundingProgrammeFormSchema = z.object({
  name: z.string().min(1, "Please enter a name").max(45, "Name too long"),
  fundingAgencyId: z.string().optional(),
});

// Type for FundingProgrammeForm Input
export type CreateFundingProgrammeFormFormInputType = z.infer<
  typeof CreateFundingProgrammeFormSchema
>;

// Schema for FundingAction model validation
// model FundingAction {
//   id                      String            @id @default(cuid())
//   name                    String
//   relatedFundingProgramme FundingProgramme? @relation(fields: [fundingProgrammeId], references: [id])
//   fundingProgrammeId      String?
//   fundingCalls            FundingCall[]
// }
export const CreateFundingActionFormSchema = z.object({
  name: z.string().min(1, "Please enter a name").max(45, "Name too long"),
  fundingProgrammeId: z.string().optional(),
});

// Type for FundingActionForm Input
export type CreateFundingActionFormInputType = z.infer<
  typeof CreateFundingActionFormSchema
>;

// Schema for FundingCall model validation
// model FundingCall {
//   id                   String         @id @default(cuid())
//   name                 String
//   url                  String?
//   relatedFundingAction FundingAction? @relation(fields: [fundingActionId], references: [id])
//   fundingActionId      String?
// }
export const CreateFundingCallFormSchema = z.object({
  name: z.string().min(1, "Please enter a name").max(45, "Name too long"),
  url: z.string().url("Please enter a valid URL"),
  fundingActionId: z.string().optional(),
});

// Type for FundingCallForm Input
export type CreateFundingCallFormInputType = z.infer<
  typeof CreateFundingCallFormSchema
>;
