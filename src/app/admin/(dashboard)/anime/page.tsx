import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAnimes } from "@/actions/anime";
import { AnimeWithDetails } from "@/lib/models/anime";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Play,
  Star,
  Calendar,
  Clock,
  Building,
  Tag,
} from "lucide-react";

export default async function AnimeManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  // Await searchParams before accessing its properties
  const resolvedSearchParams = await searchParams;

  // Extract search params
  const searchQuery =
    typeof resolvedSearchParams.search === "string"
      ? resolvedSearchParams.search
      : "";
  const status =
    typeof resolvedSearchParams.status === "string" &&
    resolvedSearchParams.status !== "all"
      ? resolvedSearchParams.status
      : "";
  const sortBy =
    typeof resolvedSearchParams.sortBy === "string"
      ? resolvedSearchParams.sortBy
      : "title";
  const sortOrder =
    typeof resolvedSearchParams.sortOrder === "string"
      ? resolvedSearchParams.sortOrder
      : "asc";
  const currentPage =
    typeof resolvedSearchParams.page === "string"
      ? parseInt(resolvedSearchParams.page)
      : 1;

  // Get data using action
  const result = await getAnimes({
    searchQuery,
    status: status as
      | "ONGOING"
      | "COMPLETED"
      | "UPCOMING"
      | "HIATUS"
      | undefined,
    sortBy: sortBy as
      | "title"
      | "rating"
      | "releaseYear"
      | "createdAt"
      | "totalEpisodes",
    sortOrder: sortOrder as "asc" | "desc",
    page: currentPage,
    pageSize: 12,
  });

  if (!result.success) {
    throw new Error(result.message);
  }

  const { animes, pagination, stats } = result.data!;

  // Status color mapping
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ONGOING":
        return (
          <Badge className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20">
            Sedang Tayang
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20">
            Selesai
          </Badge>
        );
      case "UPCOMING":
        return (
          <Badge className="bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20">
            Akan Datang
          </Badge>
        );
      case "HIATUS":
        return (
          <Badge className="bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20">
            Hiatus
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Kelola Anime
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Mengelola anime dan episode di platform
          </p>
        </div>
        <Link href="/admin/anime/tambah">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Anime
          </Button>
        </Link>
      </div>

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
                  {stats.totalAnimes}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
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
                  {stats.totalEpisodes}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Genre Terpopuler
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {stats.mostPopularGenre || "N/A"}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Anime Terbaru
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {stats.latestAnime || "N/A"}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardContent className="p-4">
          <form method="GET" className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                name="search"
                defaultValue={searchQuery}
                placeholder="Cari anime..."
                className="pl-10 h-9 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <Select name="status" defaultValue={status || "all"}>
              <SelectTrigger className="w-40 h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="ONGOING">Sedang Tayang</SelectItem>
                <SelectItem value="COMPLETED">Selesai</SelectItem>
                <SelectItem value="UPCOMING">Akan Datang</SelectItem>
                <SelectItem value="HIATUS">Hiatus</SelectItem>
              </SelectContent>
            </Select>
            <Select name="sortBy" defaultValue={sortBy}>
              <SelectTrigger className="w-40 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Judul</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="releaseYear">Tahun Rilis</SelectItem>
                <SelectItem value="createdAt">Tanggal Dibuat</SelectItem>
                <SelectItem value="totalEpisodes">Total Episode</SelectItem>
              </SelectContent>
            </Select>
            <Select name="sortOrder" defaultValue={sortOrder}>
              <SelectTrigger className="w-32 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">A-Z</SelectItem>
                <SelectItem value="desc">Z-A</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" size="sm" className="h-9">
              Filter
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Anime Table */}
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Play className="h-4 w-4 text-white" />
            </div>
            Daftar Anime ({stats.totalAnimes})
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Kelola anime yang tersedia di platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.totalAnimes === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                {searchQuery ? "Tidak ada anime ditemukan" : "Belum ada anime"}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                {searchQuery
                  ? `Tidak ada anime yang cocok dengan pencarian "${searchQuery}"`
                  : "Anda belum menambahkan anime apapun. Mulai dengan menambahkan anime pertama."}
              </p>
              {!searchQuery && (
                <Link href="/admin/anime/tambah">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Anime Pertama
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 dark:border-slate-700">
                    <TableHead className="text-slate-900 dark:text-white font-semibold">
                      Anime
                    </TableHead>
                    <TableHead className="text-slate-900 dark:text-white font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="text-slate-900 dark:text-white font-semibold">
                      Rating
                    </TableHead>
                    <TableHead className="text-slate-900 dark:text-white font-semibold">
                      Episode
                    </TableHead>
                    <TableHead className="text-slate-900 dark:text-white font-semibold">
                      Studio
                    </TableHead>
                    <TableHead className="text-slate-900 dark:text-white font-semibold">
                      Tahun
                    </TableHead>
                    <TableHead className="text-slate-900 dark:text-white font-semibold text-right">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {animes.map((anime: AnimeWithDetails) => (
                    <TableRow
                      key={anime.id}
                      className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
                            {anime.coverImage ? (
                              <img
                                src={anime.coverImage}
                                alt={anime.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Play className="w-4 h-4 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {anime.title}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {anime.animeType?.name || "N/A"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(anime.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-slate-900 dark:text-white">
                            {anime.rating ? anime.rating.toFixed(1) : "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {anime._count.episodes} / {anime.totalEpisodes || "?"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600 dark:text-slate-400">
                            {anime.studio?.name || "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {anime.releaseYear || "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Link href={`/admin/anime/edit/${anime.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                              title="Edit Anime"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-red-200 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                            title="Hapus Anime"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
