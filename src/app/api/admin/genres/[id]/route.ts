import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Get single genre by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const genre = await prisma.genre.findUnique({
      where: { id },
      include: {
        _count: {
          select: { animes: true },
        },
      },
    });

    if (!genre) {
      return NextResponse.json(
        { message: "Genre tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(genre);
  } catch (error) {
    console.error("Error fetching genre:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update genre
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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

    // Check if genre exists
    const existingGenre = await prisma.genre.findUnique({
      where: { id },
    });

    if (!existingGenre) {
      return NextResponse.json(
        { message: "Genre tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if another genre with same name/slug exists
    const conflictGenre = await prisma.genre.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [{ name: name }, { slug: slug }],
          },
        ],
      },
    });

    if (conflictGenre) {
      return NextResponse.json(
        { message: "Genre dengan nama atau slug tersebut sudah ada" },
        { status: 400 }
      );
    }

    const updatedGenre = await prisma.genre.update({
      where: { id },
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

    return NextResponse.json(updatedGenre);
  } catch (error) {
    console.error("Error updating genre:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete genre
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if genre exists
    const existingGenre = await prisma.genre.findUnique({
      where: { id },
      include: {
        _count: {
          select: { animes: true },
        },
      },
    });

    if (!existingGenre) {
      return NextResponse.json(
        { message: "Genre tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if genre is being used
    if (existingGenre._count.animes > 0) {
      return NextResponse.json(
        {
          message: `Tidak dapat menghapus genre yang sedang digunakan oleh ${existingGenre._count.animes} anime`,
        },
        { status: 400 }
      );
    }

    await prisma.genre.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Genre berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting genre:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
