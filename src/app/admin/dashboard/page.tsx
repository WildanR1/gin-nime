import Link from "next/link";
import Image from "next/image";
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
  Settings,
  LogOut,
  Film,
  Tags,
  Calendar,
  Eye,
} from "lucide-react";

export default function AdminDashboard() {
  // Mock data - nanti akan diganti dengan data real
  const stats = {
    totalAnime: 156,
    totalEpisodes: 3542,
    totalGenres: 18,
    monthlyViews: 125430,
  };

  const recentAnime = [
    {
      id: "1",
      title: "Jujutsu Kaisen",
      episodes: 24,
      status: "ONGOING",
      lastUpdated: "2024-01-15",
    },
    {
      id: "2",
      title: "Attack on Titan",
      episodes: 87,
      status: "COMPLETED",
      lastUpdated: "2024-01-14",
    },
    {
      id: "3",
      title: "Demon Slayer",
      episodes: 32,
      status: "ONGOING",
      lastUpdated: "2024-01-13",
    },
  ];

  const recentEpisodes = [
    {
      animeTitle: "Jujutsu Kaisen",
      episodeNumber: 24,
      views: 1245,
      uploadedAt: "2024-01-15",
    },
    {
      animeTitle: "One Piece",
      episodeNumber: 1095,
      views: 2341,
      uploadedAt: "2024-01-15",
    },
    {
      animeTitle: "Naruto Shippuden",
      episodeNumber: 500,
      views: 856,
      uploadedAt: "2024-01-14",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Admin Navigation */}
      <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link
                href="/admin/dashboard"
                className="flex items-center space-x-2"
              >
                <Image
                  src="/image/logo.png"
                  alt="GinAnime Logo"
                  width={32}
                  height={32}
                  className="rounded"
                />
                <span className="text-2xl font-bold text-white">
                  Gin<span className="text-sky-500">Anime</span> Admin
                </span>
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link
                  href="/admin/anime"
                  className="text-gray-300 hover:text-sky-400 transition-colors"
                >
                  Kelola Anime
                </Link>
                <Link
                  href="/admin/genre"
                  className="text-gray-300 hover:text-sky-400 transition-colors"
                >
                  Kelola Genre
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Dashboard Admin
          </h1>
          <p className="text-gray-400">
            Selamat datang di panel administrasi GinAnime
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Total Anime
              </CardTitle>
              <Film className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.totalAnime}
              </div>
              <p className="text-xs text-gray-400">+12% dari bulan lalu</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Total Episode
              </CardTitle>
              <Play className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.totalEpisodes}
              </div>
              <p className="text-xs text-gray-400">+45 episode baru</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Genre
              </CardTitle>
              <Tags className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.totalGenres}
              </div>
              <p className="text-xs text-gray-400">Kategori tersedia</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Views Bulan Ini
              </CardTitle>
              <Eye className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.monthlyViews.toLocaleString()}
              </div>
              <p className="text-xs text-gray-400">+8% dari bulan lalu</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Aksi Cepat</CardTitle>
              <CardDescription className="text-gray-400">
                Kelola konten dengan mudah
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/anime/tambah">
                <Button className="w-full bg-sky-600 hover:bg-sky-700">
                  <Plus className="mr-2 w-4 h-4" />
                  Tambah Anime Baru
                </Button>
              </Link>
              <Link href="/admin/anime">
                <Button
                  variant="outline"
                  className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  <Film className="mr-2 w-4 h-4" />
                  Kelola Anime
                </Button>
              </Link>
              <Link href="/admin/genre">
                <Button
                  variant="outline"
                  className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  <Tags className="mr-2 w-4 h-4" />
                  Kelola Genre
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Anime */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Anime Terbaru</CardTitle>
              <CardDescription className="text-gray-400">
                Anime yang baru ditambahkan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAnime.map((anime) => (
                  <div
                    key={anime.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">
                        {anime.title}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {anime.episodes} episode • {anime.status}
                      </p>
                    </div>
                    <Link href={`/admin/anime/edit/${anime.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                      >
                        Edit
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Episodes */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Episode Terbaru</CardTitle>
              <CardDescription className="text-gray-400">
                Episode yang baru diupload
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEpisodes.map((episode, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <p className="text-white text-sm font-medium">
                        {episode.animeTitle}
                      </p>
                      <span className="text-gray-400 text-xs">
                        {episode.views} views
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">
                      Episode {episode.episodeNumber} • {episode.uploadedAt}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Chart Placeholder */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="mr-2 w-5 h-5" />
              Statistik Views
            </CardTitle>
            <CardDescription className="text-gray-400">
              Data views dalam 30 hari terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Chart akan ditampilkan di sini</p>
                <p className="text-gray-500 text-sm">
                  Integrasi dengan library charting
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 GinAnime Admin Panel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
