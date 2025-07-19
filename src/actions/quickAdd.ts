"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface QuickAddResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: Record<string, string>;
}

/**
 * Quick add genre dari form anime
 */
export async function quickAddGenre(data: {
  name: string;
}): Promise<QuickAddResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized - Admin access required",
      };
    }

    const trimmedName = data.name.trim();
    if (!trimmedName) {
      return {
        success: false,
        message: "Nama genre tidak boleh kosong",
        errors: { name: "Nama genre harus diisi" },
      };
    }

    // Generate slug
    const slug = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if exists
    const exists = await prisma.genre.findFirst({
      where: {
        OR: [{ name: trimmedName }, { slug }],
      },
    });

    if (exists) {
      return {
        success: false,
        message: "Genre sudah ada",
        errors: { name: "Genre dengan nama tersebut sudah ada" },
      };
    }

    const genre = await prisma.genre.create({
      data: {
        name: trimmedName,
        slug,
      },
      include: {
        _count: {
          select: {
            animes: true,
          },
        },
      },
    });

    // Revalidate cache
    revalidatePath("/admin/anime/tambah");
    revalidatePath("/admin/anime/edit/[id]", "page");

    return {
      success: true,
      message: `Genre "${trimmedName}" berhasil ditambahkan`,
      data: genre,
    };
  } catch (error) {
    console.error("Error creating genre:", error);
    return {
      success: false,
      message: "Gagal menambahkan genre",
    };
  }
}

/**
 * Quick add studio dari form anime
 */
export async function quickAddStudio(data: {
  name: string;
}): Promise<QuickAddResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized - Admin access required",
      };
    }

    const trimmedName = data.name.trim();
    if (!trimmedName) {
      return {
        success: false,
        message: "Nama studio tidak boleh kosong",
        errors: { name: "Nama studio harus diisi" },
      };
    }

    // Check if exists
    const exists = await prisma.studio.findUnique({
      where: { name: trimmedName },
    });

    if (exists) {
      return {
        success: false,
        message: "Studio sudah ada",
        errors: { name: "Studio dengan nama tersebut sudah ada" },
      };
    }

    const studio = await prisma.studio.create({
      data: {
        name: trimmedName,
      },
      include: {
        _count: {
          select: {
            animes: true,
          },
        },
      },
    });

    // Revalidate cache
    revalidatePath("/admin/anime/tambah");
    revalidatePath("/admin/anime/edit/[id]", "page");

    return {
      success: true,
      message: `Studio "${trimmedName}" berhasil ditambahkan`,
      data: studio,
    };
  } catch (error) {
    console.error("Error creating studio:", error);
    return {
      success: false,
      message: "Gagal menambahkan studio",
    };
  }
}

/**
 * Quick add anime type dari form anime
 */
export async function quickAddAnimeType(data: {
  name: string;
}): Promise<QuickAddResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized - Admin access required",
      };
    }

    const trimmedName = data.name.trim();
    if (!trimmedName) {
      return {
        success: false,
        message: "Nama tipe anime tidak boleh kosong",
        errors: { name: "Nama tipe anime harus diisi" },
      };
    }

    // Check if exists
    const exists = await prisma.animeType.findUnique({
      where: { name: trimmedName },
    });

    if (exists) {
      return {
        success: false,
        message: "Tipe anime sudah ada",
        errors: { name: "Tipe anime dengan nama tersebut sudah ada" },
      };
    }

    const animeType = await prisma.animeType.create({
      data: {
        name: trimmedName,
      },
      include: {
        _count: {
          select: {
            animes: true,
          },
        },
      },
    });

    // Revalidate cache
    revalidatePath("/admin/anime/tambah");
    revalidatePath("/admin/anime/edit/[id]", "page");

    return {
      success: true,
      message: `Tipe anime "${trimmedName}" berhasil ditambahkan`,
      data: animeType,
    };
  } catch (error) {
    console.error("Error creating anime type:", error);
    return {
      success: false,
      message: "Gagal menambahkan tipe anime",
    };
  }
}
