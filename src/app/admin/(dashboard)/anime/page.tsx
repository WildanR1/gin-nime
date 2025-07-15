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
    <div className="space-y-8">
      {/* Enhanced Header with Gradient */}
      <div className="relative border-b pb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-purple-500/10 rounded-lg -mx-4 -mt-4"></div>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-600/20 flex items-center justify-center ring-1 ring-sky-500/30">
                <Film className="h-5 w-5 text-sky-500" />
              </div>
              Kelola Anime
            </h1>
            <p className="text-muted-foreground">
              Mengelola koleksi anime di platform GinAnime
            </p>
          </div>
          <Link href="/admin/anime/tambah">
            <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 border-0 shadow-lg shadow-sky-500/25">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Anime
            </Button>
          </Link>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <Card className="border-sky-500/20 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent rounded-lg"></div>
        <CardContent className="p-6 relative">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-500 w-4 h-4" />
              <Input
                placeholder="Cari anime berdasarkan judul..."
                className="pl-10 border-sky-500/30 focus:border-sky-500 focus:ring-sky-500/20"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-sky-500/30 hover:bg-sky-500/10"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter Status
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-500/30 hover:bg-purple-500/10"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Filter Tahun
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Anime Table */}
      <Card className="border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-lg"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
              <Film className="h-4 w-4 text-blue-500" />
            </div>
            Daftar Anime ({animeList.length})
          </CardTitle>
          <CardDescription>
            Kelola anime yang tersedia di platform
          </CardDescription>
        </CardHeader>
        <CardContent
          className={animeList.length === 0 ? "p-6 relative" : "p-0 relative"}
        >
          {animeList.length === 0 ? (
            // Enhanced Empty State
            <div className="text-center py-12">
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mx-auto mb-4 ring-1 ring-blue-500/30">
                <Film className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Belum ada anime</h3>
              <p className="text-muted-foreground mb-6">
                Anda belum menambahkan anime ke platform. Mulai dengan
                menambahkan anime pertama Anda.
              </p>
              <Link href="/admin/anime/tambah">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-lg shadow-blue-500/25">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Anime Pertama
                </Button>
              </Link>
            </div>
          ) : (
            // Data Table
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-medium">Anime</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Episode</th>
                    <th className="text-left p-4 font-medium">Rating</th>
                    <th className="text-left p-4 font-medium">Tahun</th>
                    <th className="text-left p-4 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {animeList.map((anime, index) => (
                    <tr
                      key={anime.id}
                      className={`border-b hover:bg-muted/50 ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/20"
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={anime.coverImage || "/api/placeholder/100/150"}
                            alt={anime.title}
                            className="w-12 h-18 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-medium">{anime.title}</h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {anime.genres.map((animeGenre) => (
                                <Badge
                                  key={animeGenre.genre.id}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {animeGenre.genre.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            anime.status === "ONGOING" ? "default" : "secondary"
                          }
                        >
                          {anime.status === "ONGOING" ? "Ongoing" : "Completed"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span>{anime._count.episodes || 0}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span>{anime.rating?.toFixed(1) || "N/A"}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-muted-foreground">
                          {anime.releaseYear || "N/A"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Link href={`/anime/${anime.slug}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/anime/edit/${anime.id}`}>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-500"
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

      {/* Pagination */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-primary text-primary-foreground"
          >
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
