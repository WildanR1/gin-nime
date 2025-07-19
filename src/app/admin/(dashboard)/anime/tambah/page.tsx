import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAnimeTypes, getStudios, getAllGenres } from "@/actions/anime";
import { AnimeForm } from "@/components/admin/anime/anime-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Play } from "lucide-react";

export default async function TambahAnimePage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  // Get form data
  const [animeTypesResult, studiosResult, genresResult] = await Promise.all([
    getAnimeTypes(),
    getStudios(),
    getAllGenres(),
  ]);

  if (
    !animeTypesResult.success ||
    !studiosResult.success ||
    !genresResult.success
  ) {
    throw new Error("Failed to load form data");
  }

  const animeTypes = animeTypesResult.data || [];
  const studios = studiosResult.data || [];
  const genres = genresResult.data || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
          <Play className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Tambah Anime Baru
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Tambahkan anime baru ke dalam platform
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
            Informasi Anime
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Isi form di bawah untuk menambahkan anime baru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimeForm
            animeTypes={animeTypes}
            studios={studios}
            genres={genres}
            mode="create"
          />
        </CardContent>
      </Card>
    </div>
  );
}
