import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getGenres } from "@/actions/genre";
import { GenreWithCount } from "@/lib/models/genre";
import { DeleteGenreButton } from "@/components/admin/genre/delete-genre-button";
import { ModernPagination } from "@/components/admin/genre/modern-pagination";
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
import { Search, Plus, Edit, Tags, ArrowUp, ArrowDown } from "lucide-react";

export default async function GenreManagementPage({
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
  const sortBy =
    typeof resolvedSearchParams.sortBy === "string"
      ? resolvedSearchParams.sortBy
      : "name";
  const sortOrder =
    typeof resolvedSearchParams.sortOrder === "string"
      ? resolvedSearchParams.sortOrder
      : "asc";
  const currentPage =
    typeof resolvedSearchParams.page === "string"
      ? parseInt(resolvedSearchParams.page)
      : 1;
  const pageSize = 10;

  // Get data using action
  const result = await getGenres({
    searchQuery,
    sortBy: sortBy as "name" | "animes" | "createdAt",
    sortOrder: sortOrder as "asc" | "desc",
    page: currentPage,
    pageSize,
  });

  if (!result.success) {
    throw new Error(result.message);
  }

  const { genres, pagination, stats, allGenres } = result.data!;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Kelola Genre
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Mengelola kategori genre anime di platform
          </p>
        </div>
        <Link href="/admin/genre/tambah">
          <Button className="bg-sky-500 hover:bg-sky-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Genre
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Genre
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.totalGenres}
                </p>
              </div>
              <div className="w-12 h-12 bg-sky-500 rounded-lg flex items-center justify-center">
                <Tags className="w-6 h-6 text-white" />
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
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Tags className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

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
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Tags className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Sort - Minimalist design */}
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardContent className="p-4">
          <form method="GET" className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                name="search"
                defaultValue={searchQuery}
                placeholder="Cari genre..."
                className="pl-10 h-9 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <Select name="sortBy" defaultValue={sortBy}>
              <SelectTrigger className="w-40 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nama</SelectItem>
                <SelectItem value="animes">Jumlah Anime</SelectItem>
                <SelectItem value="createdAt">Tanggal</SelectItem>
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

      {/* Genre Table with Pagination */}
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                  <Tags className="h-4 w-4 text-white" />
                </div>
                Daftar Genre ({stats.totalGenres})
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Kelola genre yang tersedia di platform
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {stats.totalGenres === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Tags className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                {searchQuery ? "Tidak ada genre ditemukan" : "Belum ada genre"}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                {searchQuery
                  ? `Tidak ada genre yang cocok dengan pencarian "${searchQuery}"`
                  : "Anda belum menambahkan genre apapun. Mulai dengan menambahkan genre pertama."}
              </p>
              {!searchQuery && (
                <Link href="/admin/genre/tambah">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Genre Pertama
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200 dark:border-slate-700">
                      <TableHead className="text-slate-900 dark:text-white font-semibold">
                        <div className="flex items-center gap-2">
                          Genre
                          {sortBy === "name" &&
                            (sortOrder === "asc" ? (
                              <ArrowUp className="w-4 h-4" />
                            ) : (
                              <ArrowDown className="w-4 h-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead className="text-slate-900 dark:text-white font-semibold">
                        Slug
                      </TableHead>
                      <TableHead className="text-slate-900 dark:text-white font-semibold">
                        <div className="flex items-center gap-2">
                          Jumlah Anime
                          {sortBy === "animes" &&
                            (sortOrder === "asc" ? (
                              <ArrowUp className="w-4 h-4" />
                            ) : (
                              <ArrowDown className="w-4 h-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead className="text-slate-900 dark:text-white font-semibold">
                        <div className="flex items-center gap-2">
                          Tanggal Dibuat
                          {sortBy === "createdAt" &&
                            (sortOrder === "asc" ? (
                              <ArrowUp className="w-4 h-4" />
                            ) : (
                              <ArrowDown className="w-4 h-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead className="text-slate-900 dark:text-white font-semibold text-right">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {genres.map((genre: GenreWithCount) => (
                      <TableRow
                        key={genre.id}
                        className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <TableCell className="font-medium text-slate-900 dark:text-white">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-sky-500/10 rounded-lg flex items-center justify-center">
                              <Tags className="w-4 h-4 text-sky-500" />
                            </div>
                            {genre.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20"
                          >
                            {genre.slug}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400">
                          {genre._count.animes} anime
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400">
                          {genre.createdAt.toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Link href={`/admin/genre/edit/${genre.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                            </Link>
                            <DeleteGenreButton genre={genre} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Modern Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-6">
                  {/* Pagination Info */}
                  <div className="flex justify-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Menampilkan{" "}
                      <span className="font-medium text-slate-900 dark:text-white">
                        {pagination.startIndex}
                      </span>{" "}
                      -{" "}
                      <span className="font-medium text-slate-900 dark:text-white">
                        {pagination.endIndex}
                      </span>{" "}
                      dari{" "}
                      <span className="font-medium text-slate-900 dark:text-white">
                        {pagination.totalItems}
                      </span>{" "}
                      genre
                    </p>
                  </div>

                  {/* Pagination Controls - Centered */}
                  <div className="flex justify-center">
                    <ModernPagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      baseUrl="/admin/genre"
                      searchParams={{
                        search: searchQuery,
                        sortBy,
                        sortOrder,
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
