import { z } from "zod";

// Enum values must match your Prisma schema

export const PromoCodeValidation = {
    // Create schema
    createPromoCodeSchema: z.object({
        code: z.string().min(3, "Promo code must be at least 3 characters"),
        discountValue: z.number().positive("Discount value must be positive"),
        minimumAmount: z.number().nonnegative().optional(),
        startTime: z.string().datetime("Invalid start time"),
        endTime: z.string().datetime("Invalid end time"),
        useLimit: z.number().int().nonnegative().optional(),
    }),

    // Update schema (all fields optional)
    updatePromoCodeSchema: z.object({
        code: z.string().min(3).optional(),
        discountValue: z.number().positive().optional(),
        minimumAmount: z.number().nonnegative().optional(),
        startTime: z.string().datetime().optional(),
        endTime: z.string().datetime().optional(),
        useLimit: z.number().int().nonnegative().optional(),
        isActive: z.boolean().optional(),
    }),
};
