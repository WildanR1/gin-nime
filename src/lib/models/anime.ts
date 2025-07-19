import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma-client";

export interface AnimeFilters {
  searchQuery?: string;
  genreIds?: string[];
  status?: "ONGOING" | "COMPLETED" | "UPCOMING" | "HIATUS";
  animeTypeId?: string;
  releaseYear?: number;
  rating?: number;
  sortBy?: "title" | "rating" | "releaseYear" | "createdAt" | "totalEpisodes";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface AnimeWithDetails {
  id: string;
  title: string;
  slug: string;
  synopsis?: string | null;
  coverImage?: string | null;
  releaseYear?: number | null;
  status: string;
  rating?: number | null;
  totalEpisodes?: number | null;
  duration?: number | null;
  createdAt: Date;
  updatedAt: Date;
  animeType?: {
    id: string;
    name: string;
  } | null;
  studio?: {
    id: string;
    name: string;
  } | null;
  genres: {
    id: string;
    name: string;
    slug: string;
  }[];
  _count: {
    episodes: number;
    genres: number;
  };
}

export interface AnimeStats {
  totalAnimes: number;
  totalEpisodes: number;
  mostPopularGenre: string | null;
  latestAnime: string | null;
}

export class AnimeModel {
  /**
   * Get all animes with optional filtering and sorting
   */
  static async findMany(
    filters: AnimeFilters = {}
  ): Promise<AnimeWithDetails[]> {
    const {
      searchQuery,
      genreIds,
      status,
      animeTypeId,
      releaseYear,
      rating,
      sortBy = "title",
      sortOrder = "asc",
    } = filters;

    const where: Prisma.AnimeWhereInput = {
      AND: [
        // Search by title
        searchQuery
          ? {
              title: {
                contains: searchQuery,
              },
            }
          : {},
        // Filter by status
        status ? { status } : {},
        // Filter by anime type
        animeTypeId ? { animeTypeId } : {},
        // Filter by release year
        releaseYear ? { releaseYear } : {},
        // Filter by rating (greater than or equal)
        rating ? { rating: { gte: rating } } : {},
        // Filter by genres
        genreIds && genreIds.length > 0
          ? {
              genres: {
                some: {
                  genreId: {
                    in: genreIds,
                  },
                },
              },
            }
          : {},
      ],
    };

    const orderBy: Prisma.AnimeOrderByWithRelationInput = (() => {
      switch (sortBy) {
        case "rating":
          return { rating: sortOrder };
        case "releaseYear":
          return { releaseYear: sortOrder };
        case "totalEpisodes":
          return { totalEpisodes: sortOrder };
        case "createdAt":
          return { createdAt: sortOrder };
        case "title":
        default:
          return { title: sortOrder };
      }
    })();

    return (await prisma.anime.findMany({
      where,
      include: {
        animeType: {
          select: {
            id: true,
            name: true,
          },
        },
        studio: {
          select: {
            id: true,
            name: true,
          },
        },
        genres: {
          include: {
            genre: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            episodes: true,
          },
        },
      },
      orderBy,
    })) as any;
  }

  /**
   * Get paginated animes
   */
  static async findManyPaginated(filters: AnimeFilters = {}) {
    const { page = 1, pageSize = 12 } = filters;

    const allAnimes = await this.findMany(filters);

    // Calculate pagination
    const totalPages = Math.ceil(allAnimes.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const animes = allAnimes.slice(startIndex, endIndex);

    return {
      data: animes,
      allData: allAnimes,
      pagination: {
        currentPage: page,
        totalPages,
        pageSize,
        totalItems: allAnimes.length,
        startIndex: startIndex + 1,
        endIndex: Math.min(endIndex, allAnimes.length),
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Find a single anime by ID
   */
  static async findById(id: string): Promise<AnimeWithDetails | null> {
    return (await prisma.anime.findUnique({
      where: { id },
      include: {
        animeType: {
          select: {
            id: true,
            name: true,
          },
        },
        studio: {
          select: {
            id: true,
            name: true,
          },
        },
        genres: {
          include: {
            genre: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        episodes: {
          include: {
            servers: true,
          },
          orderBy: {
            episodeNumber: "asc",
          },
        },
        _count: {
          select: {
            episodes: true,
          },
        },
      },
    })) as any;
  }

  /**
   * Find a single anime by slug
   */
  static async findBySlug(slug: string): Promise<AnimeWithDetails | null> {
    return (await prisma.anime.findUnique({
      where: { slug },
      include: {
        animeType: {
          select: {
            id: true,
            name: true,
          },
        },
        studio: {
          select: {
            id: true,
            name: true,
          },
        },
        genres: {
          include: {
            genre: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        episodes: {
          include: {
            servers: true,
          },
          orderBy: {
            episodeNumber: "asc",
          },
        },
        _count: {
          select: {
            episodes: true,
          },
        },
      },
    })) as any;
  }

  /**
   * Create a new anime
   */
  static async create(data: {
    title: string;
    slug: string;
    synopsis?: string;
    coverImage?: string;
    releaseYear?: number;
    status?: "ONGOING" | "COMPLETED" | "UPCOMING" | "HIATUS";
    rating?: number;
    totalEpisodes?: number;
    duration?: number;
    animeTypeId?: string;
    studioId?: string;
    genreIds: string[];
  }): Promise<AnimeWithDetails> {
    const { genreIds, ...animeData } = data;

    return (await prisma.anime.create({
      data: {
        ...animeData,
        genres: {
          create: genreIds.map((genreId) => ({
            genreId,
          })),
        },
      },
      include: {
        animeType: {
          select: {
            id: true,
            name: true,
          },
        },
        studio: {
          select: {
            id: true,
            name: true,
          },
        },
        genres: {
          include: {
            genre: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            episodes: true,
          },
        },
      },
    })) as any;
  }

  /**
   * Update an anime
   */
  static async update(
    id: string,
    data: {
      title?: string;
      slug?: string;
      synopsis?: string;
      coverImage?: string;
      releaseYear?: number;
      status?: "ONGOING" | "COMPLETED" | "UPCOMING" | "HIATUS";
      rating?: number;
      totalEpisodes?: number;
      duration?: number;
      animeTypeId?: string;
      studioId?: string;
      genreIds?: string[];
    }
  ): Promise<AnimeWithDetails> {
    const { genreIds, ...animeData } = data;

    return (await prisma.anime.update({
      where: { id },
      data: {
        ...animeData,
        ...(genreIds && {
          genres: {
            deleteMany: {},
            create: genreIds.map((genreId) => ({
              genreId,
            })),
          },
        }),
      },
      include: {
        animeType: {
          select: {
            id: true,
            name: true,
          },
        },
        studio: {
          select: {
            id: true,
            name: true,
          },
        },
        genres: {
          include: {
            genre: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            episodes: true,
          },
        },
      },
    })) as any;
  }

  /**
   * Delete an anime
   */
  static async delete(id: string): Promise<AnimeWithDetails> {
    return (await prisma.anime.delete({
      where: { id },
      include: {
        animeType: {
          select: {
            id: true,
            name: true,
          },
        },
        studio: {
          select: {
            id: true,
            name: true,
          },
        },
        genres: {
          include: {
            genre: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            episodes: true,
          },
        },
      },
    })) as any;
  }

  /**
   * Check if anime title already exists (for validation)
   */
  static async existsByTitle(
    title: string,
    excludeId?: string
  ): Promise<boolean> {
    const anime = await prisma.anime.findFirst({
      where: {
        title,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    return !!anime;
  }

  /**
   * Check if anime slug already exists (for validation)
   */
  static async existsBySlug(
    slug: string,
    excludeId?: string
  ): Promise<boolean> {
    const anime = await prisma.anime.findFirst({
      where: {
        slug,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    return !!anime;
  }

  /**
   * Get anime statistics
   */
  static async getStats(animes?: AnimeWithDetails[]): Promise<AnimeStats> {
    const animeData = animes || (await this.findMany());

    const totalAnimes = animeData.length;

    // Get most popular genre
    const genreCounts: Record<string, number> = {};
    animeData.forEach((anime) => {
      anime.genres.forEach((genre) => {
        genreCounts[genre.name] = (genreCounts[genre.name] || 0) + 1;
      });
    });

    const mostPopularGenre =
      Object.keys(genreCounts).length > 0
        ? Object.entries(genreCounts).reduce((prev, current) =>
            prev[1] > current[1] ? prev : current
          )[0]
        : null;

    const latestAnime =
      animeData.length > 0
        ? animeData.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0].title
        : null;

    // Calculate total episodes across all animes
    const totalEpisodes =
      animes?.reduce(
        (total, anime) => total + (anime._count?.episodes || 0),
        0
      ) || 0;

    return {
      totalAnimes,
      totalEpisodes,
      mostPopularGenre,
      latestAnime,
    };
  }

  /**
   * Generate unique slug from title
   */
  static generateSlug(title: string): string {
    return title
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
    title: string,
    excludeId?: string
  ): Promise<string> {
    let slug = this.generateSlug(title);
    let counter = 1;

    while (await this.existsBySlug(slug, excludeId)) {
      slug = `${this.generateSlug(title)}-${counter}`;
      counter++;
    }

    return slug;
  }

  /**
   * Get trending animes (example: by rating)
   */
  static async findTrending(limit: number = 10): Promise<AnimeWithDetails[]> {
    return await this.findMany({
      sortBy: "rating",
      sortOrder: "desc",
      pageSize: limit,
    });
  }

  /**
   * Get latest animes
   */
  static async findLatest(limit: number = 10): Promise<AnimeWithDetails[]> {
    return await this.findMany({
      sortBy: "createdAt",
      sortOrder: "desc",
      pageSize: limit,
    });
  }

  /**
   * Get popular animes (by episode count or rating)
   */
  static async findPopular(limit: number = 10): Promise<AnimeWithDetails[]> {
    return await this.findMany({
      sortBy: "totalEpisodes",
      sortOrder: "desc",
      pageSize: limit,
    });
  }
}
