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
});
