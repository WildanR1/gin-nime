import { z } from "zod";

export const studioValidation = z.object({
  name: z
    .string()
    .min(1, "Nama studio tidak boleh kosong")
    .min(2, "Nama studio minimal 2 karakter")
    .max(100, "Nama studio maksimal 100 karakter")
    .trim(),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .trim()
    .optional()
    .nullable(),
});

export type StudioValidationData = z.infer<typeof studioValidation>;
