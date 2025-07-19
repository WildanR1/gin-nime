import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  Film,
  Tags,
  Eye,
  TrendingUp,
  Clock,
  Star,
  Download,
  Plus,
  Settings,
  BarChart3,
} from "lucide-react";

export default function Page() {
  // Mock data - nanti bisa diganti dengan data dari database
  const stats = {
    totalAnime: 156,
    totalUsers: 2340,
    totalGenres: 24,
    totalViews: 45670,
    newUsersThisMonth: 234,
    popularAnime: [
      { title: "Attack on Titan", views: 12450, rating: 9.2 },
      { title: "Demon Slayer", views: 11230, rating: 9.0 },
      { title: "Jujutsu Kaisen", views: 10890, rating: 8.8 },
      { title: "One Piece", views: 9876, rating: 9.1 },
    ],
    recentActivities: [
      {
        action: "Anime baru ditambahkan",
        title: "Chainsaw Man",
        time: "2 jam lalu",
      },
      {
        action: "User baru mendaftar",
        title: "user123@email.com",
        time: "3 jam lalu",
      },
      {
        action: "Genre baru dibuat",
        title: "Supernatural",
        time: "5 jam lalu",
      },
      {
        action: "Anime diupdate",
        title: "Naruto Shippuden",
        time: "1 hari lalu",
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Dashboard Admin
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Selamat datang di panel admin GinAnime
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/anime/tambah">
            <Button className="bg-sky-500 hover:bg-sky-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Anime
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-slate-200 dark:border-slate-700"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Laporan
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Anime</CardTitle>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Film className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAnime}</div>
            <p className="text-xs text-blue-100">+12 dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-green-100">
              +{stats.newUsersThisMonth} bulan ini
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Genre</CardTitle>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Tags className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGenres}</div>
            <p className="text-xs text-purple-100">+3 dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Eye className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-orange-100">+15% dari minggu lalu</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Popular Anime */}
        <Card className="col-span-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              Anime Paling Populer
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Anime dengan views tertinggi minggu ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.popularAnime.map((anime, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-full font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {anime.title}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {anime.views.toLocaleString()} views
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {anime.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="col-span-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-white" />
              </div>
              Aktivitas Terbaru
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Update terbaru dari sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 border-l-2 border-sky-200 dark:border-sky-600 bg-sky-50/50 dark:bg-sky-900/20 rounded-r-lg"
                >
                  <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-sm text-sky-600 dark:text-sky-400 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">
            Quick Actions
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Aksi cepat untuk manajemen konten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/anime/tambah">
              <button className="w-full flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors group">
                <div className="p-2 bg-blue-500 text-white rounded-lg group-hover:bg-blue-600 transition-colors">
                  <Film className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-900 dark:text-white">
                    Tambah Anime
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Upload anime baru
                  </p>
                </div>
              </button>
            </Link>

            <Link href="/admin/genre">
              <button className="w-full flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors group">
                <div className="p-2 bg-green-500 text-white rounded-lg group-hover:bg-green-600 transition-colors">
                  <Tags className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-900 dark:text-white">
                    Kelola Genre
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Tambah/edit genre
                  </p>
                </div>
              </button>
            </Link>

            <Link href="/admin/user">
              <button className="w-full flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg transition-colors group">
                <div className="p-2 bg-purple-500 text-white rounded-lg group-hover:bg-purple-600 transition-colors">
                  <Users className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-900 dark:text-white">
                    Kelola Users
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Manajemen pengguna
                  </p>
                </div>
              </button>
            </Link>

            <button className="w-full flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded-lg transition-colors group">
              <div className="p-2 bg-orange-500 text-white rounded-lg group-hover:bg-orange-600 transition-colors">
                <Download className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-900 dark:text-white">
                  Export Data
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Download laporan
                </p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              Statistik Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Anime Ditambah
              </span>
              <span className="font-medium text-slate-900 dark:text-white">
                12
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                User Baru
              </span>
              <span className="font-medium text-slate-900 dark:text-white">
                {stats.newUsersThisMonth}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Total Episode
              </span>
              <span className="font-medium text-slate-900 dark:text-white">
                1,254
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              Top Genre
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Action", "Romance", "Comedy"].map((genre, index) => (
              <div key={genre} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-sky-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <span className="text-sm text-slate-900 dark:text-white">
                    {genre}
                  </span>
                </div>
                <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300">
                  {45 - index * 10} anime
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Settings className="h-4 w-4 text-white" />
              </div>
              Quick Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/settings">
              <Button
                variant="outline"
                className="w-full justify-start border-slate-200 dark:border-slate-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Pengaturan Sistem
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full justify-start border-slate-200 dark:border-slate-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Backup Database
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-slate-200 dark:border-slate-700"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
