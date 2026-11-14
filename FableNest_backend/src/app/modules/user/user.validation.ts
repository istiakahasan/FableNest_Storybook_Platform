import { UserRole } from "@prisma/client";
import { z } from "zod";
const createUserValidationSchema = z.object({
  firstName: z.string({
    required_error: "First Name is required.",
    invalid_type_error: "First Name must be a string.",
  }),
  lastName: z.string({
    required_error: "Last Name is required.",
    invalid_type_error: "Last Name must be a string.",
  }),
  email: z
    .string({ required_error: "Email is required." })
    .email("Invalid email address"),
  password: z
    .string({
      required_error: "Password is required.",
      invalid_type_error: "Password must be a string.",
    })
    .min(6, "Password must be at least 6 characters long."),
});
const createAdminValidationSchema = z.object({
  firstName: z.string({
    required_error: "First Name is required.",
    invalid_type_error: "First Name must be a string.",
  }),
  lastName: z.string({
    required_error: "Last Name is required.",
    invalid_type_error: "Last Name must be a string.",
  }),
  email: z
    .string({ required_error: "Email is required." })
    .email("Invalid email address"),
});

const updateUserValidationSchema = z.object({
  fullName: z
    .string({
      invalid_type_error: "Full name must be a string.",
    })
    .optional(),

});
const changeRoleValidation = z.object({
  role: z.nativeEnum(UserRole)
})
const updateFaceTokenSchema = z.object({
  faceToken: z
    .string({
      invalid_type_error: "Full name must be a string.",
      required_error: "Face token is required.",
    })
});

export const UserValidation = {
  updateFaceTokenSchema,
  changeRoleValidation,
  createUserValidationSchema,
  createAdminValidationSchema,
  updateUserValidationSchema,
};
