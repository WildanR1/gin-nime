import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET: Get genre by id (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID genre diperlukan" },
        { status: 400 }
      );
    }
    const genre = await prisma.genre.findUnique({
      where: { id },
      include: { _count: { select: { animes: true } } },
    });
    if (!genre) {
      return NextResponse.json(
        { success: false, message: "Genre tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: genre });
  } catch (error) {
    console.error("Get Genre API error:", error);
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

// PUT: Update genre (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const { id } = await params;
    const body = await request.json();
    const { name, description } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID genre diperlukan" },
        { status: 400 }
      );
    }
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Nama genre diperlukan" },
        { status: 400 }
      );
    }
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    // Cek slug unik (kecuali genre ini sendiri)
    const existing = await prisma.genre.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Slug sudah digunakan" },
        { status: 400 }
      );
    }
    const updated = await prisma.genre.update({
      where: { id },
      data: { name, slug },
    });
    return NextResponse.json({
      success: true,
      data: updated,
      message: "Genre berhasil diperbarui",
    });
  } catch (error) {
    console.error("Update Genre API error:", error);
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

// DELETE: Delete genre (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID genre diperlukan" },
        { status: 400 }
      );
    }
    await prisma.genre.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: "Genre berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete Genre API error:", error);
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
