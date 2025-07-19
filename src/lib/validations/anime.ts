import { z } from "zod";

// Schema untuk create anime
export const createAnimeSchema = z.object({
  title: z
    .string()
    .min(1, "Judul anime tidak boleh kosong")
    .max(255, "Judul anime maksimal 255 karakter")
    .trim(),
  synopsis: z
    .string()
    .max(5000, "Sinopsis maksimal 5000 karakter")
    .optional()
    .or(z.literal("")),
  coverImage: z
    .string()
    .url("URL cover image tidak valid")
    .optional()
    .or(z.literal("")),
  releaseYear: z
    .number()
    .int()
    .min(1900, "Tahun rilis minimal 1900")
    .max(new Date().getFullYear() + 5, "Tahun rilis tidak valid")
    .optional(),
  status: z.enum(["ONGOING", "COMPLETED", "UPCOMING", "HIATUS"]),
  rating: z
    .number()
    .min(0, "Rating minimal 0")
    .max(10, "Rating maksimal 10")
    .optional(),
  totalEpisodes: z.number().int().min(1, "Total episode minimal 1").optional(),
  duration: z
    .number()
    .int()
    .min(1, "Durasi per episode minimal 1 menit")
    .optional(),
  animeTypeId: z.string().optional(),
  studioId: z.string().optional(),
  genreIds: z.array(z.string()).min(1, "Minimal pilih 1 genre"),
});

// Schema untuk update anime
export const updateAnimeSchema = z.object({
  title: z
    .string()
    .min(1, "Judul anime tidak boleh kosong")
    .max(255, "Judul anime maksimal 255 karakter")
    .trim(),
  synopsis: z
    .string()
    .max(5000, "Sinopsis maksimal 5000 karakter")
    .optional()
    .or(z.literal("")),
  coverImage: z
    .string()
    .url("URL cover image tidak valid")
    .optional()
    .or(z.literal("")),
  releaseYear: z
    .number()
    .int()
    .min(1900, "Tahun rilis minimal 1900")
    .max(new Date().getFullYear() + 5, "Tahun rilis tidak valid")
    .optional(),
  status: z.enum(["ONGOING", "COMPLETED", "UPCOMING", "HIATUS"]),
  rating: z
    .number()
    .min(0, "Rating minimal 0")
    .max(10, "Rating maksimal 10")
    .optional(),
  totalEpisodes: z.number().int().min(1, "Total episode minimal 1").optional(),
  duration: z
    .number()
    .int()
    .min(1, "Durasi per episode minimal 1 menit")
    .optional(),
  animeTypeId: z.string().optional(),
  studioId: z.string().optional(),
  genreIds: z.array(z.string()).min(1, "Minimal pilih 1 genre"),
});

// Schema untuk filter anime
export const animeFilterSchema = z.object({
  search: z.string().optional(),
  genreIds: z.array(z.string()).optional(),
  status: z.enum(["ONGOING", "COMPLETED", "UPCOMING", "HIATUS"]).optional(),
  animeTypeId: z.string().optional(),
  releaseYear: z.number().int().optional(),
  rating: z.number().optional(),
  sortBy: z
    .enum(["title", "rating", "releaseYear", "createdAt", "totalEpisodes"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Schema untuk pagination
export const paginationSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// TypeScript types dari schema
export type CreateAnimeInput = z.infer<typeof createAnimeSchema>;
export type UpdateAnimeInput = z.infer<typeof updateAnimeSchema>;
export type AnimeFilterInput = z.infer<typeof animeFilterSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;

// Helper function untuk generate slug
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};
