"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
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
 * Get genres with optional filtering and pagination
 */
export async function getGenres({
  search = "",
  page = 1,
  pageSize = 20,
  orderBy = "name",
  order = "asc",
}: {
  search?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  order?: "asc" | "desc";
} = {}) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const where = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};

    const total = await prisma.genre.count({ where });
    const genres = await prisma.genre.findMany({
      where,
      orderBy: { [orderBy]: order },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { _count: { select: { animes: true } } },
    });

    // Stats example: total genres, used genres, unused genres
    const usedCount = await prisma.genre.count({
      where: { animes: { some: {} } },
    });
    const unusedCount = total - usedCount;
    const stats = { total, used: usedCount, unused: unusedCount };

    return {
      success: true,
      data: {
        genres,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
        stats,
        allGenres: genres, // for compatibility
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

    const genre = await prisma.genre.findUnique({
      where: { id },
      include: { _count: { select: { animes: true } } },
    });
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

    const { name } = validationResult.data;

    // Check if genre name already exists
    const exists = await prisma.genre.findFirst({ where: { name } });
    if (exists) {
      return {
        success: false,
        message: "Genre dengan nama tersebut sudah ada",
        errors: { name: "Genre dengan nama tersebut sudah ada" },
      };
    }

    // Generate unique slug
    let slug = generateSlug(name);
    let slugExists = await prisma.genre.findFirst({ where: { slug } });
    let counter = 1;
    while (slugExists) {
      slug = generateSlug(`${name}-${counter}`);
      slugExists = await prisma.genre.findFirst({ where: { slug } });
      counter++;
    }

    // Create genre
    const genre = await prisma.genre.create({
      data: { name, slug },
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

    const { name } = validationResult.data;

    // Check if genre name already exists
    const exists = await prisma.genre.findFirst({ where: { name } });
    if (exists) {
      return {
        success: false,
        message: "Genre dengan nama tersebut sudah ada",
        errors: { name: "Genre dengan nama tersebut sudah ada" },
      };
    }

    // Generate unique slug
    let slug = generateSlug(name);
    let slugExists = await prisma.genre.findFirst({ where: { slug } });
    let counter = 1;
    while (slugExists) {
      slug = generateSlug(`${name}-${counter}`);
      slugExists = await prisma.genre.findFirst({ where: { slug } });
      counter++;
    }

    // Create genre
    const genre = await prisma.genre.create({
      data: { name, slug },
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
    const existingGenre = await prisma.genre.findUnique({ where: { id } });
    if (!existingGenre) {
      return {
        success: false,
        message: "Genre tidak ditemukan",
      };
    }

    // Extract form data
    const rawData = {
      name: formData.get("name")?.toString() || "",
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

    const { name } = validationResult.data;

    // Check if genre name already exists (excluding current genre)
    const exists = await prisma.genre.findFirst({
      where: { name, NOT: { id } },
    });
    if (exists) {
      return {
        success: false,
        message: "Genre dengan nama tersebut sudah ada",
        errors: { name: "Genre dengan nama tersebut sudah ada" },
      };
    }

    // Generate new slug if name changed
    let slug = existingGenre.slug;
    if (name !== existingGenre.name) {
      let newSlug = generateSlug(name);
      let slugExists = await prisma.genre.findFirst({
        where: { slug: newSlug, NOT: { id } },
      });
      let counter = 1;
      while (slugExists) {
        newSlug = generateSlug(`${name}-${counter}`);
        slugExists = await prisma.genre.findFirst({
          where: { slug: newSlug, NOT: { id } },
        });
        counter++;
      }
      slug = newSlug;
    }

    // Update genre
    const updatedGenre = await prisma.genre.update({
      where: { id },
      data: { name, slug },
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
    const existingGenre = await prisma.genre.findUnique({ where: { id } });
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

    const { name } = validationResult.data;

    // Check if genre name already exists (excluding current genre)
    const exists = await prisma.genre.findFirst({
      where: { name, NOT: { id } },
    });
    if (exists) {
      return {
        success: false,
        message: "Genre dengan nama tersebut sudah ada",
        errors: { name: "Genre dengan nama tersebut sudah ada" },
      };
    }

    // Generate new slug if name changed
    let slug = existingGenre.slug;
    if (name !== existingGenre.name) {
      let newSlug = generateSlug(name);
      let slugExists = await prisma.genre.findFirst({
        where: { slug: newSlug, NOT: { id } },
      });
      let counter = 1;
      while (slugExists) {
        newSlug = generateSlug(`${name}-${counter}`);
        slugExists = await prisma.genre.findFirst({
          where: { slug: newSlug, NOT: { id } },
        });
        counter++;
      }
      slug = newSlug;
    }

    // Update genre
    const updatedGenre = await prisma.genre.update({
      where: { id },
      data: { name, slug },
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
    const existingGenre = await prisma.genre.findUnique({
      where: { id },
      include: { _count: { select: { animes: true } } },
    });
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
    const deletedGenre = await prisma.genre.delete({ where: { id } });

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
