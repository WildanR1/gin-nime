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
      {/* Header */}
      <div className="border-b pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Selamat datang kembali! Berikut ringkasan platform GinAnime Anda.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/anime/tambah">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Anime
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Anime</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
              <Film className="h-4 w-4 text-sky-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAnime}</div>
            <p className="text-xs text-muted-foreground">anime tersedia</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-sky-600"></div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Episode</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Play className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEpisodes}</div>
            <p className="text-xs text-muted-foreground">episode tersedia</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Genre</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Tags className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGenres}</div>
            <p className="text-xs text-muted-foreground">kategori tersedia</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">user terdaftar</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>Kelola konten dengan mudah</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/anime/tambah">
              <Button className="w-full">
                <Plus className="mr-2 w-4 h-4" />
                Tambah Anime Baru
              </Button>
            </Link>
            <Link href="/admin/anime">
              <Button variant="outline" className="w-full">
                <Film className="mr-2 w-4 h-4" />
                Kelola Anime
              </Button>
            </Link>
            <Link href="/admin/genre">
              <Button variant="outline" className="w-full">
                <Tags className="mr-2 w-4 h-4" />
                Kelola Genre
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Anime */}
        <Card>
          <CardHeader>
            <CardTitle>Anime Terbaru</CardTitle>
            <CardDescription>Anime yang baru ditambahkan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnime.length > 0 ? (
                recentAnime.map((anime) => (
                  <div
                    key={anime.id}
                    className="flex justify-between items-center p-3 rounded-lg border bg-muted/20"
                  >
                    <div>
                      <p className="text-sm font-medium">{anime.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {anime._count.episodes} episode • {anime.status}
                      </p>
                    </div>
                    <Link href={`/admin/anime/edit/${anime.id}`}>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Film className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
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

        {/* Recent Episodes */}
        <Card>
          <CardHeader>
            <CardTitle>Episode Terbaru</CardTitle>
            <CardDescription>Episode yang baru diupload</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEpisodes.length > 0 ? (
                recentEpisodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="flex justify-between items-center p-3 rounded-lg border bg-muted/20"
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
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
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

      {/* Analytics Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 w-5 h-5" />
            Statistik Views
          </CardTitle>
          <CardDescription>Data views dalam 30 hari terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
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
