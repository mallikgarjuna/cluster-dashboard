import { z } from "zod";

// grant form schema
// rename grantSchema to grantFormSchema
export const grantFormSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255),
  description: z.string().min(1, "Description is required.").max(65535),
  // acronym: z.string().optional().nullable(),
  // budgetTotal: z.number().optional().nullable(),
  submissionDate: z.coerce.date().optional().nullable(),
  // deadline: z.date().optional().nullable(),
  // decisionDate: z.date().optional().nullable(),
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
});
