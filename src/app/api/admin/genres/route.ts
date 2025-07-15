import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - List all genres
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const genres = await prisma.genre.findMany({
      include: {
        _count: {
          select: { animes: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(genres);
  } catch (error) {
    console.error("Error fetching genres:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new genre
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, slug } = await request.json();

    // Validation
    if (!name || !slug) {
      return NextResponse.json(
        { message: "Name and slug are required" },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { message: "Nama genre minimal 2 karakter" },
        { status: 400 }
      );
    }

    if (slug.trim().length < 2) {
      return NextResponse.json(
        { message: "Slug minimal 2 karakter" },
        { status: 400 }
      );
    }

    // Check if genre already exists
    const existingGenre = await prisma.genre.findFirst({
      where: {
        OR: [{ name: name }, { slug: slug }],
      },
    });

    if (existingGenre) {
      return NextResponse.json(
        { message: "Genre dengan nama atau slug tersebut sudah ada" },
        { status: 400 }
      );
    }

    const genre = await prisma.genre.create({
      data: {
        name,
        slug,
      },
      include: {
        _count: {
          select: { animes: true },
        },
      },
    });

    return NextResponse.json(genre, { status: 201 });
  } catch (error) {
    console.error("Error creating genre:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
