import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAnimeTypes } from "@/actions/animeType";
import { AnimeTypeWithCount } from "@/lib/models/animeType";
import { DeleteAnimeTypeButton } from "@/components/admin/anime-type/delete-anime-type-button";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Tv, Hash } from "lucide-react";

export default async function AnimeTypeManagementPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const result = await getAnimeTypes();

  if (!result.success) {
    throw new Error(result.message);
  }

  const animeTypes: AnimeTypeWithCount[] = result.data || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <Tv className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Manajemen Tipe Anime
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Kelola tipe anime (TV, Movie, ONA, OVA, Special)
            </p>
          </div>
        </div>
        <Link href="/admin/anime-type/tambah">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Tipe Anime
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Tipe Anime
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {animeTypes.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Tv className="w-6 h-6 text-green-600 dark:text-green-400" />
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
                  {animeTypes.reduce(
                    (total, type) => total + type._count.animes,
                    0
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Hash className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Tipe Terpopuler
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {animeTypes.length > 0
                    ? animeTypes.reduce((prev, current) =>
                        prev._count.animes > current._count.animes
                          ? prev
                          : current
                      ).name
                    : "-"}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Badge className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AnimeTypes Table */}
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
            Daftar Tipe Anime
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Kelola semua tipe anime yang tersedia
          </CardDescription>
        </CardHeader>
        <CardContent>
          {animeTypes.length === 0 ? (
            <div className="text-center py-12">
              <Tv className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Belum ada tipe anime
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Mulai dengan menambahkan tipe anime pertama Anda.
              </p>
              <Link href="/admin/anime-type/tambah">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Tipe Anime
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 dark:border-slate-700">
                    <TableHead className="text-slate-600 dark:text-slate-400">
                      Nama Tipe
                    </TableHead>
                    <TableHead className="text-slate-600 dark:text-slate-400">
                      Jumlah Anime
                    </TableHead>
                    <TableHead className="text-slate-600 dark:text-slate-400">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {animeTypes.map((animeType) => (
                    <TableRow
                      key={animeType.id}
                      className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                            <Tv className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {animeType.name}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              ID: {animeType.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            animeType._count.animes > 0
                              ? "default"
                              : "secondary"
                          }
                          className="font-medium"
                        >
                          {animeType._count.animes} anime
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/anime-type/${animeType.id}/edit`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-200 dark:border-slate-600"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <DeleteAnimeTypeButton
                            animeTypeId={animeType.id}
                            animeTypeName={animeType.name}
                            animeCount={animeType._count.animes}
                          />
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
