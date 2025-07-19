import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getStudios } from "@/actions/studio";
import { StudioWithCount } from "@/lib/models/animeType";
import { DeleteStudioButton } from "@/components/admin/studio/delete-studio-button";
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
import { Plus, Edit, Building, Hash } from "lucide-react";

export default async function StudioManagementPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const result = await getStudios();

  if (!result.success) {
    throw new Error(result.message);
  }

  const studios: StudioWithCount[] = result.data || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Manajemen Studio
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Kelola studio anime (MAPPA, Pierrot, Toei, dll)
            </p>
          </div>
        </div>
        <Link href="/admin/studio/tambah">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Studio
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
                  Total Studio
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {studios.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
                  {studios.reduce(
                    (total, studio) => total + studio._count.animes,
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
                  Studio Terpopuler
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {studios.length > 0
                    ? studios.reduce((prev, current) =>
                        prev._count.animes > current._count.animes
                          ? prev
                          : current
                      ).name
                    : "-"}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Badge className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Studios Table */}
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
            Daftar Studio
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Kelola semua studio anime yang tersedia
          </CardDescription>
        </CardHeader>
        <CardContent>
          {studios.length === 0 ? (
            <div className="text-center py-12">
              <Building className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Belum ada studio
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Mulai dengan menambahkan studio pertama Anda.
              </p>
              <Link href="/admin/studio/tambah">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Studio
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 dark:border-slate-700">
                    <TableHead className="text-slate-600 dark:text-slate-400">
                      Nama Studio
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
                  {studios.map((studio) => (
                    <TableRow
                      key={studio.id}
                      className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                            <Building className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {studio.name}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              ID: {studio.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            studio._count.animes > 0 ? "default" : "secondary"
                          }
                          className="font-medium"
                        >
                          {studio._count.animes} anime
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/studio/edit/${studio.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-200 dark:border-slate-600"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <DeleteStudioButton
                            studioId={studio.id}
                            studioName={studio.name}
                            animeCount={studio._count.animes}
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
