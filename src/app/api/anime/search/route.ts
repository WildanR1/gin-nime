import { NextRequest, NextResponse } from "next/server";
import { AnimeModel, type AnimeFilters } from "@/lib/models/anime";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse search parameters
    const filters: AnimeFilters = {
      searchQuery:
        searchParams.get("keyword") || searchParams.get("q") || undefined,
      genreIds:
        searchParams.get("genre")?.split(",").filter(Boolean) || undefined,
      status:
        (searchParams.get("status") as AnimeFilters["status"]) || undefined,
      animeTypeId: searchParams.get("type") || undefined,
      releaseYear: searchParams.get("year")
        ? parseInt(searchParams.get("year")!)
        : undefined,
      rating: searchParams.get("rating")
        ? parseFloat(searchParams.get("rating")!)
        : undefined,
      sortBy: (searchParams.get("sort") as AnimeFilters["sortBy"]) || "title",
      sortOrder:
        (searchParams.get("order") as AnimeFilters["sortOrder"]) || "asc",
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
      pageSize: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : 12,
    };

    // Get animes with filters
    const result = await AnimeModel.findManyPaginated(filters);

    return NextResponse.json({
      success: true,
      data: {
        animes: result.data,
        pagination: result.pagination,
        filters: {
          keyword: filters.searchQuery,
          genre: filters.genreIds,
          status: filters.status,
          type: filters.animeTypeId,
          year: filters.releaseYear,
          rating: filters.rating,
          sort: filters.sortBy,
          order: filters.sortOrder,
        },
      },
    });
  } catch (error) {
    console.error("Search API error:", error);
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

// Support CORS for frontend
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
