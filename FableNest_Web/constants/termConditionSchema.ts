import { z } from "zod";

export const termsAndConditionsSchema = z.object({
  title: z
    .string()
    .min(1, "Terms title is required")
    .min(3, "Terms title must be at least 3 characters")
    .max(100, "Terms title is too long"),

  features: z.array(z.string()).min(1, "At least one features is required"),
});

export type TermsAndConditionsFormData = z.infer<
  typeof termsAndConditionsSchema
>;
