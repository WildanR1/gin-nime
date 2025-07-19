"use server";

import { auth } from "@/auth";
import { AnimeTypeModel } from "@/lib/models/animeType";

export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

/**
 * Get all anime types
 */
export async function getAnimeTypes(): Promise<ActionResponse> {
  try {
    const animeTypes = await AnimeTypeModel.findMany();

    return {
      success: true,
      message: "Anime types berhasil diambil",
      data: animeTypes,
    };
  } catch (error) {
    console.error("Error fetching anime types:", error);
    return {
      success: false,
      message: "Gagal mengambil data anime types",
    };
  }
}

/**
 * Get anime type by ID
 */
export async function getAnimeTypeById(id: string): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized - Admin access required",
      };
    }

    const animeType = await AnimeTypeModel.findById(id);
    if (!animeType) {
      return {
        success: false,
        message: "Anime type tidak ditemukan",
      };
    }

    return {
      success: true,
      message: "Anime type berhasil diambil",
      data: animeType,
    };
  } catch (error) {
    console.error("Error fetching anime type:", error);
    return {
      success: false,
      message: "Gagal mengambil data anime type",
    };
  }
}

/**
 * Create new anime type
 */
export async function createAnimeType(data: {
  name: string;
}): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized - Admin access required",
      };
    }

    // Validate name
    const trimmedName = data.name.trim();
    if (!trimmedName) {
      return {
        success: false,
        message: "Nama anime type tidak boleh kosong",
      };
    }

    // Check if name already exists
    const exists = await AnimeTypeModel.existsByName(trimmedName);
    if (exists) {
      return {
        success: false,
        message: "Nama anime type sudah ada",
      };
    }

    const animeType = await AnimeTypeModel.create({ name: trimmedName });

    return {
      success: true,
      message: "Anime type berhasil dibuat",
      data: animeType,
    };
  } catch (error) {
    console.error("Error creating anime type:", error);
    return {
      success: false,
      message: "Gagal membuat anime type",
    };
  }
}

/**
 * Update anime type
 */
export async function updateAnimeType(
  id: string,
  data: { name: string }
): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized - Admin access required",
      };
    }

    // Validate name
    const trimmedName = data.name.trim();
    if (!trimmedName) {
      return {
        success: false,
        message: "Nama anime type tidak boleh kosong",
      };
    }

    // Check if anime type exists
    const existingAnimeType = await AnimeTypeModel.findById(id);
    if (!existingAnimeType) {
      return {
        success: false,
        message: "Anime type tidak ditemukan",
      };
    }

    // Check if name already exists (excluding current)
    const nameExists = await AnimeTypeModel.existsByName(trimmedName, id);
    if (nameExists) {
      return {
        success: false,
        message: "Nama anime type sudah ada",
      };
    }

    const animeType = await AnimeTypeModel.update(id, { name: trimmedName });

    return {
      success: true,
      message: "Anime type berhasil diperbarui",
      data: animeType,
    };
  } catch (error) {
    console.error("Error updating anime type:", error);
    return {
      success: false,
      message: "Gagal memperbarui anime type",
    };
  }
}

/**
 * Delete anime type
 */
export async function deleteAnimeType(id: string): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized - Admin access required",
      };
    }

    // Check if anime type exists
    const existingAnimeType = await AnimeTypeModel.findById(id);
    if (!existingAnimeType) {
      return {
        success: false,
        message: "Anime type tidak ditemukan",
      };
    }

    // Check if anime type is used by any anime
    if (existingAnimeType._count.animes > 0) {
      return {
        success: false,
        message: `Tidak dapat menghapus anime type karena masih digunakan oleh ${existingAnimeType._count.animes} anime`,
      };
    }

    const animeType = await AnimeTypeModel.delete(id);

    return {
      success: true,
      message: "Anime type berhasil dihapus",
      data: animeType,
    };
  } catch (error) {
    console.error("Error deleting anime type:", error);
    return {
      success: false,
      message: "Gagal menghapus anime type",
    };
  }
}
