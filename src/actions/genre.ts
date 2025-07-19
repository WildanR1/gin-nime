"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { GenreModel, type GenreFilters } from "@/lib/models/genre";
import {
  createGenreSchema,
  updateGenreSchema,
  generateSlug,
} from "@/lib/validations/genre";
import type {
  CreateGenreInput,
  UpdateGenreInput,
} from "@/lib/validations/genre";

// Response types
export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

/**
 * Get genres with filtering and pagination
 */
export async function getGenres(filters: GenreFilters = {}) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const result = await GenreModel.findManyPaginated(filters);
    const stats = await GenreModel.getStats(result.allData);

    return {
      success: true,
      data: {
        genres: result.data,
        pagination: result.pagination,
        stats,
        allGenres: result.allData,
      },
    };
  } catch (error) {
    console.error("Error fetching genres:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch genres",
    };
  }
}

/**
 * Get a single genre by ID
 */
export async function getGenreById(id: string): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const genre = await GenreModel.findById(id);
    if (!genre) {
      return {
        success: false,
        message: "Genre tidak ditemukan",
      };
    }

    return {
      success: true,
      message: "Genre berhasil diambil",
      data: genre,
    };
  } catch (error) {
    console.error("Error fetching genre:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal mengambil data genre",
    };
  }
}

/**
 * Create a new genre
 */
export async function createGenre(formData: FormData): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized - Admin access required",
      };
    }

    // Extract form data
    const rawData = {
      name: formData.get("name")?.toString() || "",
      description: formData.get("description")?.toString() || "",
    };

    // Validate with Zod
    const validationResult = createGenreSchema.safeParse(rawData);

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

    const { name, description } = validationResult.data;

    // Check if genre name already exists
    if (await GenreModel.existsByName(name)) {
      return {
        success: false,
        message: "Genre dengan nama tersebut sudah ada",
        errors: { name: "Genre dengan nama tersebut sudah ada" },
      };
    }

    // Generate unique slug
    const slug = await GenreModel.generateUniqueSlug(name);

    // Create genre
    const genre = await GenreModel.create({
      name,
      slug,
      description: description || undefined,
    });

    // Revalidate pages
    revalidatePath("/admin/genre");

    return {
      success: true,
      message: "Genre berhasil ditambahkan",
      data: genre,
    };
  } catch (error) {
    console.error("Error creating genre:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal menambahkan genre",
    };
  }
}

/**
 * Create genre action (React Hook Form compatible)
 */
export async function createGenreRHF(
  data: CreateGenreInput
): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized - Admin access required",
      };
    }

    // Validate with Zod (should already be validated on client, but double-check)
    const validationResult = createGenreSchema.safeParse(data);

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

    const { name, description } = validationResult.data;

    // Check if genre name already exists
    if (await GenreModel.existsByName(name)) {
      return {
        success: false,
        message: "Genre dengan nama tersebut sudah ada",
        errors: { name: "Genre dengan nama tersebut sudah ada" },
      };
    }

    // Generate unique slug
    const slug = await GenreModel.generateUniqueSlug(name);

    // Create genre
    const genre = await GenreModel.create({
      name,
      slug,
      description: description || undefined,
    });

    // Revalidate pages
    revalidatePath("/admin/genre");

    return {
      success: true,
      message: "Genre berhasil ditambahkan",
      data: genre,
    };
  } catch (error) {
    console.error("Error creating genre:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal menambahkan genre",
    };
  }
}

/**
 * Update a genre
 */
export async function updateGenre(
  id: string,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized - Admin access required",
      };
    }

    // Check if genre exists
    const existingGenre = await GenreModel.findById(id);
    if (!existingGenre) {
      return {
        success: false,
        message: "Genre tidak ditemukan",
      };
    }

    // Extract form data
    const rawData = {
      name: formData.get("name")?.toString() || "",
      description: formData.get("description")?.toString() || "",
    };

    // Validate with Zod
    const validationResult = updateGenreSchema.safeParse(rawData);

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

    const { name, description } = validationResult.data;

    // Check if genre name already exists (excluding current genre)
    if (await GenreModel.existsByName(name, id)) {
      return {
        success: false,
        message: "Genre dengan nama tersebut sudah ada",
        errors: { name: "Genre dengan nama tersebut sudah ada" },
      };
    }

    // Generate new slug if name changed
    let slug = existingGenre.slug;
    if (name !== existingGenre.name) {
      slug = await GenreModel.generateUniqueSlug(name, id);
    }

    // Update genre
    const updatedGenre = await GenreModel.update(id, {
      name,
      slug,
      description: description || undefined,
    });

    // Revalidate pages
    revalidatePath("/admin/genre");
    revalidatePath(`/admin/genre/edit/${id}`);

    return {
      success: true,
      message: "Genre berhasil diupdate",
      data: updatedGenre,
    };
  } catch (error) {
    console.error("Error updating genre:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal mengupdate genre",
    };
  }
}

/**
 * Update genre action (React Hook Form compatible)
 */
export async function updateGenreRHF(
  id: string,
  data: UpdateGenreInput
): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized - Admin access required",
      };
    }

    // Check if genre exists
    const existingGenre = await GenreModel.findById(id);
    if (!existingGenre) {
      return {
        success: false,
        message: "Genre tidak ditemukan",
      };
    }

    // Validate with Zod
    const validationResult = updateGenreSchema.safeParse(data);

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

    const { name, description } = validationResult.data;

    // Check if genre name already exists (excluding current genre)
    if (await GenreModel.existsByName(name, id)) {
      return {
        success: false,
        message: "Genre dengan nama tersebut sudah ada",
        errors: { name: "Genre dengan nama tersebut sudah ada" },
      };
    }

    // Generate new slug if name changed
    let slug = existingGenre.slug;
    if (name !== existingGenre.name) {
      slug = await GenreModel.generateUniqueSlug(name, id);
    }

    // Update genre
    const updatedGenre = await GenreModel.update(id, {
      name,
      slug,
      description: description || undefined,
    });

    // Revalidate pages
    revalidatePath("/admin/genre");
    revalidatePath(`/admin/genre/edit/${id}`);

    return {
      success: true,
      message: "Genre berhasil diupdate",
      data: updatedGenre,
    };
  } catch (error) {
    console.error("Error updating genre:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal mengupdate genre",
    };
  }
}

/**
 * Delete a genre
 */
export async function deleteGenre(id: string): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized - Admin access required",
      };
    }

    // Check if genre exists
    const existingGenre = await GenreModel.findById(id);
    if (!existingGenre) {
      return {
        success: false,
        message: "Genre tidak ditemukan",
      };
    }

    // Check if genre is being used by any anime
    if (existingGenre._count.animes > 0) {
      return {
        success: false,
        message: `Cannot delete genre. It is being used by ${existingGenre._count.animes} anime(s)`,
      };
    }

    // Delete genre
    const deletedGenre = await GenreModel.delete(id);

    // Revalidate pages
    revalidatePath("/admin/genre");

    return {
      success: true,
      message: "Genre berhasil dihapus",
      data: deletedGenre,
    };
  } catch (error) {
    console.error("Error deleting genre:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menghapus genre",
    };
  }
}

/**
 * Redirect helper for form submissions
 */
export async function createGenreAndRedirect(formData: FormData) {
  const result = await createGenre(formData);

  if (result.success) {
    redirect("/admin/genre");
  }

  return result;
}

/**
 * Update genre and redirect helper
 */
export async function updateGenreAndRedirect(id: string, formData: FormData) {
  const result = await updateGenre(id, formData);

  if (result.success) {
    redirect("/admin/genre");
  }

  return result;
}
