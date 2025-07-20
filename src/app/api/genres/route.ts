import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET: List all genres (public)
export async function GET(req: NextRequest) {
  try {
    // Optional: support query params for filtering/pagination
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;
    const orderBy = searchParams.get("orderBy") || "name";
    const sort = searchParams.get("sort") || "asc";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const skip = (page - 1) * pageSize;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [genres, total] = await Promise.all([
      prisma.genre.findMany({
        where,
        include: {
          _count: { select: { animes: true } },
        },
        orderBy: { [orderBy]: sort },
        skip,
        take: pageSize,
      }),
      prisma.genre.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: genres,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("Genres API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST: Create genre (admin only)
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description } = body;
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Nama genre diperlukan" },
        { status: 400 }
      );
    }

    // Slugify
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Cek slug unik
    const existing = await prisma.genre.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Slug sudah digunakan" },
        { status: 400 }
      );
    }

    const genre = await prisma.genre.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json({
      success: true,
      data: genre,
      message: "Genre berhasil ditambahkan",
    });
  } catch (error) {
    console.error("Create Genre API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
