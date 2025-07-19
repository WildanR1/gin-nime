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
      {/* Page Header tanpa card wrapper */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 bg-sky-500/10 border border-sky-500/20 rounded-lg flex items-center justify-center">
          <Play className="w-5 h-5 text-sky-400" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white">
            Tambah Anime Baru
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Kelola data anime dengan mudah dan terstruktur
          </p>
        </div>
      </div>

      {/* Form langsung tanpa card wrapper */}
      <AnimeForm
        animeTypes={animeTypes}
        studios={studios}
        genres={genres}
        mode="create"
      />
    </div>
  );
}
