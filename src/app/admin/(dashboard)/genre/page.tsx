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
  Search,
  Plus,
  Edit,
  Trash2,
  Tags,
  Calendar,
  Filter,
} from "lucide-react";

const prisma = new PrismaClient();

async function getGenres() {
  return await prisma.genre.findMany({
    include: {
      _count: {
        select: {
          animes: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function GenreManagementPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const genres = await getGenres();

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

      {/* Search and Filters */}
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Cari genre berdasarkan nama..."
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
                Filter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 dark:border-slate-700"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Tanggal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Genre Table */}
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                  <Tags className="h-4 w-4 text-white" />
                </div>
                Daftar Genre ({genres.length})
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Kelola genre yang tersedia di platform
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {genres.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Tags className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                Belum ada genre
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Anda belum menambahkan genre apapun. Mulai dengan menambahkan
                genre pertama.
              </p>
              <Link href="/admin/genre/tambah">
                <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Genre Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 dark:border-slate-700">
                  <TableHead className="text-slate-900 dark:text-white font-semibold">
                    Genre
                  </TableHead>
                  <TableHead className="text-slate-900 dark:text-white font-semibold">
                    Slug
                  </TableHead>
                  <TableHead className="text-slate-900 dark:text-white font-semibold">
                    Jumlah Anime
                  </TableHead>
                  <TableHead className="text-slate-900 dark:text-white font-semibold">
                    Tanggal Dibuat
                  </TableHead>
                  <TableHead className="text-slate-900 dark:text-white font-semibold text-right">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {genres.map((genre) => (
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-red-200 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
                  {genres.length}
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
                  {genres.length > 0
                    ? genres.reduce((prev, current) =>
                        prev._count.animes > current._count.animes
                          ? prev
                          : current
                      ).name
                    : "N/A"}
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
                  {genres.reduce(
                    (total, genre) => total + genre._count.animes,
                    0
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Tags className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
