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
  Calendar,
  Activity,
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
    monthlyViews: 0,
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

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const stats = await getStats();
  const recentAnime = await getRecentAnime();

  const statsCards = [
    {
      title: "Total Anime",
      value: stats.totalAnime,
      icon: Film,
      description: "Anime yang tersedia",
    },
    {
      title: "Total Episode",
      value: stats.totalEpisodes,
      icon: Play,
      description: "Episode yang diunggah",
    },
    {
      title: "Total Genre",
      value: stats.totalGenres,
      icon: Tags,
      description: "Kategori genre",
    },
    {
      title: "Pengguna Terdaftar",
      value: stats.totalUsers,
      icon: Users,
      description: "User aktif",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Selamat datang di panel admin GinAnime
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-200 dark:border-slate-700"
          >
            <Activity className="w-4 h-4 mr-2" />
            Laporan
          </Button>
          <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Konten
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className="w-12 h-12 bg-sky-500 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Anime */}
        <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                  Anime Terbaru
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Anime yang baru ditambahkan ke platform
                </CardDescription>
              </div>
              <Link href="/admin/anime">
                <Button variant="outline" size="sm">
                  Lihat Semua
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnime.length === 0 ? (
                <div className="text-center py-8">
                  <Film className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Belum ada anime yang ditambahkan
                  </p>
                  <Link href="/admin/anime/tambah">
                    <Button className="mt-3 bg-sky-500 hover:bg-sky-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Anime
                    </Button>
                  </Link>
                </div>
              ) : (
                recentAnime.map((anime) => (
                  <div
                    key={anime.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <img
                      src={anime.coverImage || "/api/placeholder/60/80"}
                      alt={anime.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 dark:text-white truncate">
                        {anime.title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {anime._count.episodes} episode
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {anime.status === "ONGOING" ? "Ongoing" : "Completed"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/anime/${anime.slug}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/anime/edit/${anime.id}`}>
                        <Button variant="outline" size="sm">
                          <Film className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
              Aksi Cepat
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Shortcut untuk tugas umum
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/admin/anime/tambah">
                <Button className="w-full justify-start bg-sky-500 hover:bg-sky-600 text-white">
                  <Film className="w-4 h-4 mr-2" />
                  Tambah Anime Baru
                </Button>
              </Link>
              <Link href="/admin/genre/tambah">
                <Button
                  variant="outline"
                  className="w-full justify-start border-slate-200 dark:border-slate-700"
                >
                  <Tags className="w-4 h-4 mr-2" />
                  Tambah Genre
                </Button>
              </Link>
              <Link href="/admin/user">
                <Button
                  variant="outline"
                  className="w-full justify-start border-slate-200 dark:border-slate-700"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Kelola Pengguna
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full justify-start border-slate-200 dark:border-slate-700"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Lihat Statistik
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
            Aktivitas Terbaru
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Log aktivitas sistem dan pengguna
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Sistem dimulai
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Admin panel berhasil diinisialisasi
                </p>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Baru saja
              </span>
            </div>

            <div className="text-center py-6">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Log aktivitas akan muncul di sini
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
