import { z } from "zod";


const loginValidationSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters long" }),
});

const changePasswordValidationSchema = z.object({
	currentPassword: z
		.string({ required_error: "Current password is required" })
		.min(6, {
			message: "Current password must be at least 6 characters long",
		}),
	newPassword: z
		.string({ required_error: "New password is required" })
		.min(6, { message: "New password must be at least 6 characters long" }),
});

const resetPasswordValidationSchema = z.object({
	newPassword: z.string().min(8, "Password must be at least 8 characters"),
})
const verifyOtpSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	OTP: z.number().nonnegative("OTP is required!")

})
const forgotPasswordValidationSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
});

const resendOtpValidationSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
});

export const AuthValidation = {
	loginValidationSchema,
	verifyOtpSchema,
	resendOtpValidationSchema,
	resetPasswordValidationSchema,
	changePasswordValidationSchema,
	forgotPasswordValidationSchema,
};
