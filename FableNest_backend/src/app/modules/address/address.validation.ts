import { z } from "zod";



export const AddressValidation = {
    update: z.object({
        id: z.string().optional(),

        firstName: z
            .string()
            .min(1, "First name is required"),

        lastName: z
            .string()
            .min(1, "Last name is required"),

        phoneNumber: z
            .string()
            .min(7, "Phone number is too short")
            .max(20, "Phone number is too long"),

        street: z
            .string()
            .min(1, "Street is required"),

        city: z
            .string()
            .min(1, "City is required"),

        state: z
            .string()
            .min(1, "State is required"),

        postCode: z
            .string()
    })
}
