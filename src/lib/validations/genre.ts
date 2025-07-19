import { z } from "zod";

// Schema untuk create genre
export const createGenreSchema = z.object({
  name: z
    .string()
    .min(2, "Nama genre minimal 2 karakter")
    .max(50, "Nama genre maksimal 50 karakter")
    .trim()
    .refine((value) => !/^\s*$/.test(value), "Nama genre tidak boleh kosong"),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional()
    .or(z.literal("")),
});

// Schema untuk update genre
export const updateGenreSchema = z.object({
  name: z
    .string()
    .min(2, "Nama genre minimal 2 karakter")
    .max(50, "Nama genre maksimal 50 karakter")
    .trim()
    .refine((value) => !/^\s*$/.test(value), "Nama genre tidak boleh kosong"),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional()
    .or(z.literal("")),
});

// Schema untuk search/filter
export const genreFilterSchema = z.object({
  search: z.string().optional(),
  sortBy: z.enum(["name", "animes", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Schema untuk pagination (terpisah)
export const paginationSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// TypeScript types dari schema
export type CreateGenreInput = z.infer<typeof createGenreSchema>;
export type UpdateGenreInput = z.infer<typeof updateGenreSchema>;
export type GenreFilterInput = z.infer<typeof genreFilterSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;

// Helper function untuk generate slug
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};
