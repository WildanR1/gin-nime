import Link from "next/link";
import { PrismaClient } from "@/generated/prisma-client";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  Play,
  TrendingUp,
  Plus,
  Film,
  Tags,
  Eye,
} from "lucide-react";

const prisma = new PrismaClient();

async function getStats() {
  const [animeCount, episodeCount, genreCount, userCount] = await Promise.all([
    prisma.anime.count(),
    prisma.episode.count(),
    prisma.genre.count(),
    prisma.user.count(),
  ]);

  return {
    totalAnime: animeCount,
    totalEpisodes: episodeCount,
    totalGenres: genreCount,
    monthlyViews: 0, // Placeholder untuk views
    totalUsers: userCount,
  };
}

async function getRecentAnime() {
  return await prisma.anime.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { episodes: true },
      },
    },
  });
}

async function getRecentEpisodes() {
  return await prisma.episode.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      anime: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  });
}

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const stats = await getStats();
  const recentAnime = await getRecentAnime();
  const recentEpisodes = await getRecentEpisodes();

  return (
    <div className="space-y-8">
      {/* Hero Header with Gradient */}
      <div className="relative border-b pb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-purple-500/10 rounded-lg -mx-4 -mt-4"></div>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Selamat datang kembali! Berikut ringkasan platform GinAnime Anda.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/anime/tambah">
              <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 border-0 shadow-lg shadow-sky-500/25">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Anime
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 border-sky-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Total Anime</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500/20 to-sky-600/20 flex items-center justify-center ring-1 ring-sky-500/30">
              <Film className="h-4 w-4 text-sky-500" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-sky-400">
              {stats.totalAnime}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
              <span>anime tersedia</span>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-sky-600"></div>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 border-green-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Total Episode</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center ring-1 ring-green-500/30">
              <Play className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-green-400">
              {stats.totalEpisodes}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>episode tersedia</span>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 border-purple-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Genre</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center ring-1 ring-purple-500/30">
              <Tags className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-purple-400">
              {stats.totalGenres}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>kategori tersedia</span>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 border-orange-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center ring-1 ring-orange-500/30">
              <Users className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-orange-400">
              {stats.totalUsers}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span>user terdaftar</span>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
        </Card>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="group hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 border-sky-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent rounded-lg"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500/20 to-sky-600/20 flex items-center justify-center">
                <Plus className="h-4 w-4 text-sky-500" />
              </div>
              Aksi Cepat
            </CardTitle>
            <CardDescription>Kelola konten dengan mudah</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 relative">
            <Link href="/admin/anime/tambah">
              <Button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 border-0 shadow-lg shadow-sky-500/25">
                <Plus className="mr-2 w-4 h-4" />
                Tambah Anime Baru
              </Button>
            </Link>
            <Link href="/admin/anime">
              <Button
                variant="outline"
                className="w-full border-sky-500/30 hover:bg-sky-500/10"
              >
                <Film className="mr-2 w-4 h-4" />
                Kelola Anime
              </Button>
            </Link>
            <Link href="/admin/genre">
              <Button
                variant="outline"
                className="w-full border-purple-500/30 hover:bg-purple-500/10"
              >
                <Tags className="mr-2 w-4 h-4" />
                Kelola Genre
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Enhanced Recent Anime */}
        <Card className="group hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 border-blue-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-lg"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                <Film className="h-4 w-4 text-blue-500" />
              </div>
              Anime Terbaru
            </CardTitle>
            <CardDescription>Anime yang baru ditambahkan</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              {recentAnime.length > 0 ? (
                recentAnime.map((anime) => (
                  <div
                    key={anime.id}
                    className="flex justify-between items-center p-3 rounded-lg border bg-gradient-to-r from-slate-50/5 to-blue-50/5 hover:from-blue-50/10 hover:to-slate-50/10 transition-all"
                  >
                    <div>
                      <p className="text-sm font-medium">{anime.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {anime._count.episodes} episode • {anime.status}
                      </p>
                    </div>
                    <Link href={`/admin/anime/edit/${anime.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-500/30 hover:bg-blue-500/10"
                      >
                        Edit
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mx-auto mb-4">
                    <Film className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Belum ada anime
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Tambahkan anime pertama Anda
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Recent Episodes */}
        <Card className="group hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 border-green-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-lg"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
                <Play className="h-4 w-4 text-green-500" />
              </div>
              Episode Terbaru
            </CardTitle>
            <CardDescription>Episode yang baru diupload</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              {recentEpisodes.length > 0 ? (
                recentEpisodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="flex justify-between items-center p-3 rounded-lg border bg-gradient-to-r from-slate-50/5 to-green-50/5 hover:from-green-50/10 hover:to-slate-50/10 transition-all"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {episode.anime.title} - Ep {episode.episodeNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {episode.title}
                      </p>
                    </div>
                    <Link href={`/anime/${episode.anime.slug}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500/30 hover:bg-green-500/10"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center mx-auto mb-4">
                    <Play className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Belum ada episode
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Upload episode untuk anime Anda
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Analytics Chart */}
      <Card className="group hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 border-sky-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent rounded-lg"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500/20 to-sky-600/20 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-sky-500" />
            </div>
            Statistik Views
          </CardTitle>
          <CardDescription>Data views dalam 30 hari terakhir</CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="h-64 bg-gradient-to-br from-slate-900/5 via-sky-500/5 to-blue-500/5 rounded-lg flex items-center justify-center border border-sky-500/20">
            <div className="text-center">
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-600/20 flex items-center justify-center mx-auto mb-4 ring-1 ring-sky-500/30">
                <TrendingUp className="w-8 h-8 text-sky-500" />
              </div>
              <p className="text-muted-foreground font-medium">
                Chart akan ditampilkan di sini
              </p>
              <p className="text-muted-foreground text-sm">
                Integrasi dengan library charting
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
