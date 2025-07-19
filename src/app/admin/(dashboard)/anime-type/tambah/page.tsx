import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AnimeTypeForm } from "@/components/admin/anime-type/anime-type-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tv } from "lucide-react";

export default async function TambahAnimeTypePage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
          <Tv className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Tambah Tipe Anime Baru
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Tambahkan tipe anime baru ke dalam sistem
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
            Informasi Tipe Anime
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Isi form di bawah untuk menambahkan tipe anime baru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimeTypeForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
