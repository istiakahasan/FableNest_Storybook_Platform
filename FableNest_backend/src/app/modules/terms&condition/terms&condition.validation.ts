import { z } from "zod";

export const TermsConditionValidation = {
    createSchema: z.object({
        title: z.string().min(3, "Title must be at least 3 characters long"),
        features: z.array(z.string()).nonempty("At least one feature is required"),
    }),

    updateSchema: z.object({
        title: z.string().min(3).optional(),
        features: z.array(z.string()).optional(),
    }),
};
