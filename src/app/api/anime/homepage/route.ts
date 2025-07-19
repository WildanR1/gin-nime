import { NextResponse } from "next/server";
import { AnimeModel } from "@/lib/models/anime";

export async function GET() {
  try {
    // Get different sections for homepage
    const [trending, popular, latestEpisodes, topAiring] = await Promise.all([
      // Trending: Latest anime with high ratings
      AnimeModel.findManyPaginated({
        sortBy: "createdAt",
        sortOrder: "desc",
        pageSize: 8,
        rating: 7.0, // Only high-rated anime
      }),

      // Popular: Highest rated anime
      AnimeModel.findManyPaginated({
        sortBy: "rating",
        sortOrder: "desc",
        pageSize: 8,
      }),

      // Latest episodes: Recently added anime
      AnimeModel.findManyPaginated({
        sortBy: "createdAt",
        sortOrder: "desc",
        pageSize: 12,
      }),

      // Top airing: Ongoing anime with episodes
      AnimeModel.findManyPaginated({
        status: "ONGOING",
        sortBy: "rating",
        sortOrder: "desc",
        pageSize: 6,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        trending: trending.data,
        popular: popular.data,
        latestEpisodes: latestEpisodes.data,
        topAiring: topAiring.data,
      },
    });
  } catch (error) {
    console.error("Homepage API error:", error);
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
