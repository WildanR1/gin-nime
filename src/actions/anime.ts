"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AnimeModel, type AnimeFilters } from "@/lib/models/anime";
import { AnimeTypeModel, StudioModel } from "@/lib/models/animeType";
import { GenreModel } from "@/lib/models/genre";
import {
  createAnimeSchema,
  updateAnimeSchema,
  type CreateAnimeInput,
  type UpdateAnimeInput,
} from "@/lib/validations/anime";

// Response types
export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

/**
 * Get animes with filtering and pagination
 */
export async function getAnimes(filters: AnimeFilters = {}) {
  try {
    const result = await AnimeModel.findManyPaginated(filters);
    const stats = await AnimeModel.getStats(result.allData);

    return {
      success: true,
      data: {
        animes: result.data,
        pagination: result.pagination,
        stats,
        allAnimes: result.allData,
      },
    };
  } catch (error) {
    console.error("Error fetching animes:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch animes",
    };
  }
}

/**
 * Get public animes (no auth required)
 */
export async function getPublicAnimes(filters: AnimeFilters = {}) {
  try {
    const result = await AnimeModel.findManyPaginated(filters);

    return {
      success: true,
      data: {
        animes: result.data,
        pagination: result.pagination,
      },
    };
  } catch (error) {
    console.error("Error fetching public animes:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch animes",
    };
  }
}

/**
 * Get a single anime by ID
 */
export async function getAnimeById(id: string): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized - Admin access required",
      };
    }

    const anime = await AnimeModel.findById(id);
    if (!anime) {
      return {
        success: false,
        message: "Anime tidak ditemukan",
      };
    }

    return {
      success: true,
      message: "Anime berhasil diambil",
      data: anime,
    };
  } catch (error) {
    console.error("Error fetching anime:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal mengambil data anime",
    };
  }
}

/**
 * Get a single anime by slug (public)
 */
export async function getAnimeBySlug(slug: string): Promise<ActionResponse> {
  try {
    const anime = await AnimeModel.findBySlug(slug);
    if (!anime) {
      return {
        success: false,
        message: "Anime tidak ditemukan",
      };
    }

    return {
      success: true,
      message: "Anime berhasil diambil",
      data: anime,
    };
  } catch (error) {
    console.error("Error fetching anime:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal mengambil data anime",
    };
  }
}

/**
 * Create a new anime
 */
export async function createAnime(
  data: CreateAnimeInput
): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized - Admin access required",
      };
    }

    // Validate with Zod
    const validationResult = createAnimeSchema.safeParse(data);

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          errors[issue.path[0] as string] = issue.message;
        }
      });

      return {
        success: false,
        message: "Data tidak valid",
        errors,
      };
    }

    const { title, genreIds, ...animeData } = validationResult.data;

    // Check if anime title already exists
    const existingAnime = await AnimeModel.existsByTitle(title);
    if (existingAnime) {
      return {
        success: false,
        message: "Anime dengan judul tersebut sudah ada",
        errors: { title: "Judul anime sudah digunakan" },
      };
    }

    // Generate unique slug
    const slug = await AnimeModel.generateUniqueSlug(title);

    // Create anime
    const anime = await AnimeModel.create({
      ...animeData,
      title,
      slug,
      genreIds,
    });

    return {
      success: true,
      message: "Anime berhasil ditambahkan",
      data: anime,
    };
  } catch (error) {
    console.error("Error creating anime:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal menambahkan anime",
    };
  }
}

/**
 * Update an anime
 */
export async function updateAnime(
  id: string,
  data: UpdateAnimeInput
): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized - Admin access required",
      };
    }

    // Validate with Zod
    const validationResult = updateAnimeSchema.safeParse(data);

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          errors[issue.path[0] as string] = issue.message;
        }
      });

      return {
        success: false,
        message: "Data tidak valid",
        errors,
      };
    }

    const { title, genreIds, ...animeData } = validationResult.data;

    // Check if anime exists
    const existingAnime = await AnimeModel.findById(id);
    if (!existingAnime) {
      return {
        success: false,
        message: "Anime tidak ditemukan",
      };
    }

    // Check if title is being changed and if new title already exists
    if (title && title !== existingAnime.title) {
      const titleExists = await AnimeModel.existsByTitle(title, id);
      if (titleExists) {
        return {
          success: false,
          message: "Anime dengan judul tersebut sudah ada",
          errors: { title: "Judul anime sudah digunakan" },
        };
      }
    }

    // Generate new slug if title changed
    let slug = existingAnime.slug;
    if (title && title !== existingAnime.title) {
      slug = await AnimeModel.generateUniqueSlug(title, id);
    }

    // Update anime
    const anime = await AnimeModel.update(id, {
      ...animeData,
      ...(title && { title }),
      ...(title && { slug }),
      genreIds,
    });

    return {
      success: true,
      message: "Anime berhasil diperbarui",
      data: anime,
    };
  } catch (error) {
    console.error("Error updating anime:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal memperbarui anime",
    };
  }
}

/**
 * Delete an anime
 */
export async function deleteAnime(id: string): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized - Admin access required",
      };
    }

    // Check if anime exists
    const existingAnime = await AnimeModel.findById(id);
    if (!existingAnime) {
      return {
        success: false,
        message: "Anime tidak ditemukan",
      };
    }

    // Delete anime (will cascade delete episodes and genres)
    await AnimeModel.delete(id);

    return {
      success: true,
      message: `Anime "${existingAnime.title}" berhasil dihapus`,
    };
  } catch (error) {
    console.error("Error deleting anime:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menghapus anime",
    };
  }
}

/**
 * Get anime types for form dropdowns
 */
export async function getAnimeTypes(): Promise<ActionResponse> {
  try {
    const animeTypes = await AnimeTypeModel.findMany();

    return {
      success: true,
      message: "Data tipe anime berhasil diambil",
      data: animeTypes,
    };
  } catch (error) {
    console.error("Error fetching anime types:", error);
    return {
      success: false,
      message: "Gagal mengambil data tipe anime",
    };
  }
}

/**
 * Get studios for form dropdowns
 */
export async function getStudios(): Promise<ActionResponse> {
  try {
    const studios = await StudioModel.findMany();

    return {
      success: true,
      message: "Data studio berhasil diambil",
      data: studios,
    };
  } catch (error) {
    console.error("Error fetching studios:", error);
    return {
      success: false,
      message: "Gagal mengambil data studio",
    };
  }
}

/**
 * Get all genres for form checkboxes
 */
export async function getAllGenres(): Promise<ActionResponse> {
  try {
    const genres = await GenreModel.findMany();

    return {
      success: true,
      message: "Data genre berhasil diambil",
      data: genres,
    };
  } catch (error) {
    console.error("Error fetching genres:", error);
    return {
      success: false,
      message: "Gagal mengambil data genre",
    };
  }
}

/**
 * Get trending animes (public)
 */
export async function getTrendingAnimes(
  limit: number = 10
): Promise<ActionResponse> {
  try {
    const animes = await AnimeModel.findTrending(limit);

    return {
      success: true,
      message: "Data anime trending berhasil diambil",
      data: animes,
    };
  } catch (error) {
    console.error("Error fetching trending animes:", error);
    return {
      success: false,
      message: "Gagal mengambil data anime trending",
    };
  }
}

/**
 * Get latest animes (public)
 */
export async function getLatestAnimes(
  limit: number = 10
): Promise<ActionResponse> {
  try {
    const animes = await AnimeModel.findLatest(limit);

    return {
      success: true,
      message: "Data anime terbaru berhasil diambil",
      data: animes,
    };
  } catch (error) {
    console.error("Error fetching latest animes:", error);
    return {
      success: false,
      message: "Gagal mengambil data anime terbaru",
    };
  }
}

/**
 * Get popular animes (public)
 */
export async function getPopularAnimes(
  limit: number = 10
): Promise<ActionResponse> {
  try {
    const animes = await AnimeModel.findPopular(limit);

    return {
      success: true,
      message: "Data anime populer berhasil diambil",
      data: animes,
    };
  } catch (error) {
    console.error("Error fetching popular animes:", error);
    return {
      success: false,
      message: "Gagal mengambil data anime populer",
    };
  }
}

/**
 * Redirect helper for form submissions
 */
export async function createAnimeAndRedirect(data: CreateAnimeInput) {
  const result = await createAnime(data);

  if (result.success) {
    redirect("/admin/anime");
  }

  return result;
}
