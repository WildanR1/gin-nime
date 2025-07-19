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

// Schema untuk episode server
export const episodeServerSchema = z.object({
  name: z
    .string()
    .min(1, "Nama server tidak boleh kosong")
    .max(50, "Nama server maksimal 50 karakter"),
  videoUrl: z.string().url("URL video tidak valid"),
  quality: z
    .string()
    .min(1, "Quality tidak boleh kosong")
    .max(20, "Quality maksimal 20 karakter"),
});

// Schema untuk create episode
export const createEpisodeSchema = z.object({
  episodeNumber: z.number().int().min(1, "Nomor episode minimal 1"),
  title: z
    .string()
    .max(255, "Judul episode maksimal 255 karakter")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(2000, "Deskripsi episode maksimal 2000 karakter")
    .optional()
    .or(z.literal("")),
  thumbnail: z
    .string()
    .url("URL thumbnail tidak valid")
    .optional()
    .or(z.literal("")),
  duration: z
    .number()
    .int()
    .min(1, "Durasi episode minimal 1 detik")
    .optional(),
  releaseDate: z.date().optional(),
  servers: z.array(episodeServerSchema).min(1, "Minimal tambahkan 1 server"),
});

// Schema untuk update episode
export const updateEpisodeSchema = z.object({
  title: z
    .string()
    .max(255, "Judul episode maksimal 255 karakter")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(2000, "Deskripsi episode maksimal 2000 karakter")
    .optional()
    .or(z.literal("")),
  thumbnail: z
    .string()
    .url("URL thumbnail tidak valid")
    .optional()
    .or(z.literal("")),
  duration: z
    .number()
    .int()
    .min(1, "Durasi episode minimal 1 detik")
    .optional(),
  releaseDate: z.date().optional(),
  servers: z
    .array(episodeServerSchema)
    .min(1, "Minimal tambahkan 1 server")
    .optional(),
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
export type CreateEpisodeInput = z.infer<typeof createEpisodeSchema>;
export type UpdateEpisodeInput = z.infer<typeof updateEpisodeSchema>;
export type EpisodeServerInput = z.infer<typeof episodeServerSchema>;
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
