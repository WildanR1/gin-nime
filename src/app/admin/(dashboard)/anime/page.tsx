import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PrismaClient } from "@/generated/prisma-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Star,
  Filter,
  Film,
} from "lucide-react";

const prisma = new PrismaClient();

async function getAnimeList() {
  return await prisma.anime.findMany({
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
      _count: {
        select: { episodes: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AnimeManagementPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const animeList = await getAnimeList();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Kelola Anime
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Mengelola koleksi anime di platform GinAnime
          </p>
        </div>
        <Link href="/admin/anime/tambah">
          <Button className="bg-sky-500 hover:bg-sky-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Anime
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Cari anime berdasarkan judul..."
                className="pl-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 dark:border-slate-700"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter Status
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 dark:border-slate-700"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Filter Tahun
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Anime Table/Grid */}
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                  <Film className="h-4 w-4 text-white" />
                </div>
                Daftar Anime ({animeList.length})
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Kelola anime yang tersedia di platform
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {animeList.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Film className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                Belum ada anime
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Anda belum menambahkan anime ke platform. Mulai dengan menambahkan anime pertama.
              </p>
              <Link href="/admin/anime/tambah">
                <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Anime Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left p-4 font-medium text-slate-600 dark:text-slate-300">Anime</th>
                    <th className="text-left p-4 font-medium text-slate-600 dark:text-slate-300">Status</th>
                    <th className="text-left p-4 font-medium text-slate-600 dark:text-slate-300">Episode</th>
                    <th className="text-left p-4 font-medium text-slate-600 dark:text-slate-300">Rating</th>
                    <th className="text-left p-4 font-medium text-slate-600 dark:text-slate-300">Tahun</th>
                    <th className="text-left p-4 font-medium text-slate-600 dark:text-slate-300">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {animeList.map((anime, index) => (
                    <tr
                      key={anime.id}
                      className={`border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                        index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50/50 dark:bg-slate-700/20"
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={anime.coverImage || "/api/placeholder/100/150"}
                            alt={anime.title}
                            className="w-12 h-16 object-cover rounded-lg border border-slate-200 dark:border-slate-600"
                          />
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-slate-900 dark:text-white truncate">
                              {anime.title}
                            </h3>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {anime.genres.slice(0, 3).map((animeGenre) => (
                                <Badge
                                  key={animeGenre.genre.id}
                                  variant="secondary"
                                  className="text-xs bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800"
                                >
                                  {animeGenre.genre.name}
                                </Badge>
                              ))}
                              {anime.genres.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{anime.genres.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          className={
                            anime.status === "ONGOING" 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                          }
                        >
                          {anime.status === "ONGOING" ? "Ongoing" : "Completed"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-900 dark:text-white font-medium">
                          {anime._count.episodes || 0}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 text-sm ml-1">
                          episode
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-slate-900 dark:text-white font-medium">
                            {anime.rating?.toFixed(1) || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-600 dark:text-slate-300">
                          {anime.releaseYear || "N/A"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Link href={`/anime/${anime.slug}`}>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-8 w-8 p-0 border-slate-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              title="Lihat Anime"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/anime/edit/${anime.id}`}>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-8 w-8 p-0 border-slate-200 dark:border-slate-600 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                              title="Edit Anime"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 border-red-200 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Hapus Anime"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Anime
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {animeList.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-sky-500 rounded-lg flex items-center justify-center">
                <Film className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Anime Ongoing
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {animeList.filter(anime => anime.status === "ONGOING").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Film className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Anime Completed
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {animeList.filter(anime => anime.status === "COMPLETED").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Film className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Episode
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {animeList.reduce((total, anime) => total + anime._count.episodes, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Film className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
