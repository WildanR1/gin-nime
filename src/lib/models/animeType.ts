import { prisma } from "@/lib/prisma";

export interface AnimeTypeWithCount {
  id: string;
  name: string;
  _count: {
    animes: number;
  };
}

export interface StudioWithCount {
  id: string;
  name: string;
  _count: {
    animes: number;
  };
}

export class AnimeTypeModel {
  /**
   * Get all anime types
   */
  static async findMany(): Promise<AnimeTypeWithCount[]> {
    return await prisma.animeType.findMany({
      include: {
        _count: {
          select: {
            animes: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  /**
   * Find anime type by ID
   */
  static async findById(id: string): Promise<AnimeTypeWithCount | null> {
    return await prisma.animeType.findUnique({
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
   * Create anime type
   */
  static async create(data: { name: string }): Promise<AnimeTypeWithCount> {
    return await prisma.animeType.create({
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
   * Update anime type
   */
  static async update(
    id: string,
    data: { name: string }
  ): Promise<AnimeTypeWithCount> {
    return await prisma.animeType.update({
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
   * Delete anime type
   */
  static async delete(id: string): Promise<AnimeTypeWithCount> {
    return await prisma.animeType.delete({
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
   * Check if name exists
   */
  static async existsByName(
    name: string,
    excludeId?: string
  ): Promise<boolean> {
    const animeType = await prisma.animeType.findFirst({
      where: {
        name,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    return !!animeType;
  }
}

export class StudioModel {
  /**
   * Get all studios
   */
  static async findMany(): Promise<StudioWithCount[]> {
    return await prisma.studio.findMany({
      include: {
        _count: {
          select: {
            animes: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  /**
   * Find studio by ID
   */
  static async findById(id: string): Promise<StudioWithCount | null> {
    return await prisma.studio.findUnique({
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
   * Create studio
   */
  static async create(data: { name: string }): Promise<StudioWithCount> {
    return await prisma.studio.create({
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
   * Update studio
   */
  static async update(
    id: string,
    data: { name: string }
  ): Promise<StudioWithCount> {
    return await prisma.studio.update({
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
   * Delete studio
   */
  static async delete(id: string): Promise<StudioWithCount> {
    return await prisma.studio.delete({
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
   * Check if name exists
   */
  static async existsByName(
    name: string,
    excludeId?: string
  ): Promise<boolean> {
    const studio = await prisma.studio.findFirst({
      where: {
        name,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    return !!studio;
  }
}
