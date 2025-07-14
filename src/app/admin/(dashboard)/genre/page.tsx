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
import { Search, Plus, Edit, Trash2, Tags, Film } from "lucide-react";

const prisma = new PrismaClient();

async function getGenreList() {
  return await prisma.genre.findMany({
    include: {
      _count: {
        select: { animes: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export default async function GenreManagementPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const genreList = await getGenreList();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Kelola Genre
            </h1>
            <p className="text-muted-foreground">
              Mengelola kategori genre untuk anime
            </p>
          </div>
          <Link href="/admin/genre/tambah">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Genre
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari genre berdasarkan nama..."
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Genre List or Empty State */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Genre ({genreList.length})</CardTitle>
          <CardDescription>
            Kelola genre yang tersedia di platform
          </CardDescription>
        </CardHeader>
        <CardContent className={genreList.length === 0 ? "p-6" : "p-0"}>
          {genreList.length === 0 ? (
            // Empty State
            <div className="text-center py-12">
              <Tags className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Belum ada genre</h3>
              <p className="text-muted-foreground mb-6">
                Anda belum menambahkan genre apapun. Mulai dengan menambahkan
                genre pertama Anda.
              </p>
              <Link href="/admin/genre/tambah">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Genre Pertama
                </Button>
              </Link>
            </div>
          ) : (
            // Genre Grid
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {genreList.map((genre) => (
                  <Card key={genre.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Tags className="w-5 h-5 text-sky-500" />
                          <CardTitle className="text-lg">
                            {genre.name}
                          </CardTitle>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {genre._count.animes} anime
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Slug: {genre.slug}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Link href={`/admin/genre/edit/${genre.id}`}>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-500"
                            disabled={genre._count.animes > 0}
                            title={
                              genre._count.animes > 0
                                ? "Tidak dapat menghapus genre yang sedang digunakan"
                                : "Hapus genre"
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Genre</CardTitle>
            <Tags className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{genreList.length}</div>
            <p className="text-xs text-muted-foreground">kategori tersedia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Genre Terpopuler
            </CardTitle>
            <Film className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {genreList.length > 0
                ? genreList.reduce((max, genre) =>
                    genre._count.animes > max._count.animes ? genre : max
                  ).name
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {genreList.length > 0
                ? `${
                    genreList.reduce((max, genre) =>
                      genre._count.animes > max._count.animes ? genre : max
                    )._count.animes
                  } anime`
                : "belum ada data"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Genre Kosong</CardTitle>
            <Tags className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {genreList.filter((genre) => genre._count.animes === 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              tidak memiliki anime
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
