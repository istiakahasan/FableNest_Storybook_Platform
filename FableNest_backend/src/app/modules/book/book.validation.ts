import { Gender, Language, Style } from "@prisma/client";
import { z } from "zod";


export const bookValidations = {
  generateStorySchema: z.object({
    gender: z.nativeEnum(Gender),
    characterName: z
      .string()
      .min(1, "characterName is required")
      .max(50, "characterName must be less than 50 characters"),

    characterAge: z
      .number()
      .int("characterAge must be an integer")
      .min(3, "characterAge must be at least 3")
      .max(12, "characterAge must be at most 12"),

    style: z.nativeEnum(Style),
    language: z.nativeEnum(Language),
    user_input: z
      .string()
      .min(10, "Story prompt must be at least 10 characters")
      .max(1000, "Story prompt must be less than 1000 characters"),
  })
}

