"use server";

import { auth } from "@/auth";
import { StudioModel } from "@/lib/models/animeType";

export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

/**
 * Get all studios
 */
export async function getStudios(): Promise<ActionResponse> {
  try {
    const studios = await StudioModel.findMany();

    return {
      success: true,
      message: "Studios berhasil diambil",
      data: studios,
    };
  } catch (error) {
    console.error("Error fetching studios:", error);
    return {
      success: false,
      message: "Gagal mengambil data studios",
    };
  }
}

/**
 * Get studio by ID
 */
export async function getStudioById(id: string): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized - Admin access required",
      };
    }

    const studio = await StudioModel.findById(id);
    if (!studio) {
      return {
        success: false,
        message: "Studio tidak ditemukan",
      };
    }

    return {
      success: true,
      message: "Studio berhasil diambil",
      data: studio,
    };
  } catch (error) {
    console.error("Error fetching studio:", error);
    return {
      success: false,
      message: "Gagal mengambil data studio",
    };
  }
}

/**
 * Create new studio
 */
export async function createStudio(data: {
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
        message: "Nama studio tidak boleh kosong",
      };
    }

    // Check if name already exists
    const exists = await StudioModel.existsByName(trimmedName);
    if (exists) {
      return {
        success: false,
        message: "Nama studio sudah ada",
      };
    }

    const studio = await StudioModel.create({ name: trimmedName });

    return {
      success: true,
      message: "Studio berhasil dibuat",
      data: studio,
    };
  } catch (error) {
    console.error("Error creating studio:", error);
    return {
      success: false,
      message: "Gagal membuat studio",
    };
  }
}

/**
 * Update studio
 */
export async function updateStudio(
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
        message: "Nama studio tidak boleh kosong",
      };
    }

    // Check if studio exists
    const existingStudio = await StudioModel.findById(id);
    if (!existingStudio) {
      return {
        success: false,
        message: "Studio tidak ditemukan",
      };
    }

    // Check if name already exists (excluding current)
    const nameExists = await StudioModel.existsByName(trimmedName, id);
    if (nameExists) {
      return {
        success: false,
        message: "Nama studio sudah ada",
      };
    }

    const studio = await StudioModel.update(id, { name: trimmedName });

    return {
      success: true,
      message: "Studio berhasil diperbarui",
      data: studio,
    };
  } catch (error) {
    console.error("Error updating studio:", error);
    return {
      success: false,
      message: "Gagal memperbarui studio",
    };
  }
}

/**
 * Delete studio
 */
export async function deleteStudio(id: string): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized - Admin access required",
      };
    }

    // Check if studio exists
    const existingStudio = await StudioModel.findById(id);
    if (!existingStudio) {
      return {
        success: false,
        message: "Studio tidak ditemukan",
      };
    }

    // Check if studio is used by any anime
    if (existingStudio._count.animes > 0) {
      return {
        success: false,
        message: `Tidak dapat menghapus studio karena masih digunakan oleh ${existingStudio._count.animes} anime`,
      };
    }

    const studio = await StudioModel.delete(id);

    return {
      success: true,
      message: "Studio berhasil dihapus",
      data: studio,
    };
  } catch (error) {
    console.error("Error deleting studio:", error);
    return {
      success: false,
      message: "Gagal menghapus studio",
    };
  }
}
