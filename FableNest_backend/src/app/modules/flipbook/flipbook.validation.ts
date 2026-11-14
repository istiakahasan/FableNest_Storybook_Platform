import { z } from "zod";

const createFromUrlValidationSchema = z.object({
    pdfUrl: z.string({
      required_error: "PDF URL is required",
    }).url({ message: "Invalid PDF URL format" }),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
});

const createFromUrlAsyncValidationSchema = z.object({
    pdfUrl: z.string({
      required_error: "PDF URL is required",
    }).url({ message: "Invalid PDF URL format" }),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
});

const uploadAndCreateValidationSchema = z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
});

const getFlipbookByIdValidationSchema = z.object({
    id: z.string({
      required_error: "Flipbook ID is required",
    }).min(1, { message: "Flipbook ID cannot be empty" }),
});

const deleteFlipbookValidationSchema = z.object({
    id: z.string({
      required_error: "Flipbook ID is required",
    }).min(1, { message: "Flipbook ID cannot be empty" }),
});

export const FlipbookValidation = {
  createFromUrlValidationSchema,
  createFromUrlAsyncValidationSchema,
  uploadAndCreateValidationSchema,
  getFlipbookByIdValidationSchema,
  deleteFlipbookValidationSchema,
};