import { z } from "zod";

export const privacyPolicySchema = z.object({
  title: z
    .string()
    .min(1, "Policy title is required")
    .min(3, "Policy title must be at least 3 characters")
    .max(100, "Policy title is too long"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
});

export type PrivacyPolicyFormData = z.infer<typeof privacyPolicySchema>;
