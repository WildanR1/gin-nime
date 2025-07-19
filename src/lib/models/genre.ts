import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma-client";

export interface GenreFilters {
  searchQuery?: string;
  sortBy?: "name" | "animes" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface GenreWithCount {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    animes: number;
  };
}

export interface GenreStats {
  totalGenres: number;
  totalAnimes: number;
  mostPopularGenre: string | null;
}

export class GenreModel {
  /**
   * Get all genres with optional filtering and sorting
   */
  static async findMany(filters: GenreFilters = {}): Promise<GenreWithCount[]> {
    const { searchQuery, sortBy = "name", sortOrder = "asc" } = filters;

    const where: Prisma.GenreWhereInput = searchQuery
      ? {
          name: {
            contains: searchQuery,
          },
        }
      : {};

    const orderBy: Prisma.GenreOrderByWithRelationInput = (() => {
      switch (sortBy) {
        case "name":
          return { name: sortOrder };
        case "animes":
          return { animes: { _count: sortOrder } };
        case "createdAt":
          return { createdAt: sortOrder };
        default:
          return { name: "asc" };
      }
    })();

    return await prisma.genre.findMany({
      where,
      include: {
        _count: {
          select: {
            animes: true,
          },
        },
      },
      orderBy,
    });
  }

  /**
   * Get paginated genres
   */
  static async findManyPaginated(filters: GenreFilters = {}) {
    const { page = 1, pageSize = 10 } = filters;

    const allGenres = await this.findMany(filters);

    // Calculate pagination
    const totalPages = Math.ceil(allGenres.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const genres = allGenres.slice(startIndex, endIndex);

    return {
      data: genres,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: allGenres.length,
        pageSize,
        startIndex: startIndex + 1,
        endIndex: Math.min(endIndex, allGenres.length),
      },
      allData: allGenres, // For stats calculation
    };
  }

  /**
   * Find a single genre by ID
   */
  static async findById(id: string): Promise<GenreWithCount | null> {
    return await prisma.genre.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            animes: true,
          },
        },
      },
    });
  }

  /**
   * Find a single genre by slug
   */
  static async findBySlug(slug: string): Promise<GenreWithCount | null> {
    return await prisma.genre.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            animes: true,
          },
        },
      },
    });
  }

  /**
   * Create a new genre
   */
  static async create(data: {
    name: string;
    slug: string;
    description?: string;
  }): Promise<GenreWithCount> {
    return await prisma.genre.create({
      data,
      include: {
        _count: {
          select: {
            animes: true,
          },
        },
      },
    });
  }

  /**
   * Update a genre
   */
  static async update(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
    }
  ): Promise<GenreWithCount> {
    return await prisma.genre.update({
      where: { id },
      data,
      include: {
        _count: {
          select: {
            animes: true,
          },
        },
      },
    });
  }

  /**
   * Delete a genre
   */
  static async delete(id: string): Promise<GenreWithCount> {
    return await prisma.genre.delete({
      where: { id },
      include: {
        _count: {
          select: {
            animes: true,
          },
        },
      },
    });
  }

  /**
   * Check if genre name already exists (for validation)
   */
  static async existsByName(
    name: string,
    excludeId?: string
  ): Promise<boolean> {
    const existing = await prisma.genre.findFirst({
      where: {
        name: {
          equals: name,
        },
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    return !!existing;
  }

  /**
   * Check if genre slug already exists (for validation)
   */
  static async existsBySlug(
    slug: string,
    excludeId?: string
  ): Promise<boolean> {
    const existing = await prisma.genre.findFirst({
      where: {
        slug: {
          equals: slug,
        },
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    return !!existing;
  }

  /**
   * Get genre statistics
   */
  static async getStats(genres?: GenreWithCount[]): Promise<GenreStats> {
    const genreData = genres || (await this.findMany());

    const totalGenres = genreData.length;
    const totalAnimes = genreData.reduce(
      (sum, genre) => sum + genre._count.animes,
      0
    );
    const mostPopularGenre =
      genreData.length > 0
        ? genreData.reduce((prev, current) =>
            prev._count.animes > current._count.animes ? prev : current
          ).name
        : null;

    return {
      totalGenres,
      totalAnimes,
      mostPopularGenre,
    };
  }

  /**
   * Generate unique slug from name
   */
  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  /**
   * Generate unique slug (checking for duplicates)
   */
  static async generateUniqueSlug(
    name: string,
    excludeId?: string
  ): Promise<string> {
    let baseSlug = this.generateSlug(name);
    let slug = baseSlug;
    let counter = 1;

    while (await this.existsBySlug(slug, excludeId)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}
