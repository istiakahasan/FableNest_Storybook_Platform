import z from "zod";


export const StaticConfigValidations = {
    changeHealthPlanFee: z.object({
        healthPlanFee: z.number().nonnegative({ message: "Health Plan Fee must be a non-negative number" })
    }),
    changeBookingFee: z.object({
        bookingFee: z.number().nonnegative({ message: "Booking Fee must be a non-negative number" })
    }),
    changeSupportEmail: z.object({
        bookingFee: z.string().email({ message: "Support email must be a valid email!" })
    }),

}