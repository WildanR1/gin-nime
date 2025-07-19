"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createGenreRHF } from "@/actions/genre";
import { createGenreSchema } from "@/lib/validations/genre";
import type { CreateGenreInput } from "@/lib/validations/genre";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Tags } from "lucide-react";

export default function AddGenrePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CreateGenreInput>({
    resolver: zodResolver(createGenreSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateGenreInput) => {
    setIsLoading(true);

    try {
      const result = await createGenreRHF(data);

      if (!result.success) {
        if (result.errors) {
          // Set field-specific errors
          Object.entries(result.errors).forEach(([field, message]) => {
            setError(field as keyof CreateGenreInput, {
              type: "server",
              message,
            });
          });
        }
        toast.error("Gagal menambahkan genre", {
          description: result.message,
        });
      } else {
        toast.success("Genre berhasil ditambahkan", {
          description: `Genre "${data.name}" telah ditambahkan ke sistem.`,
        });
        // Redirect on success
        router.push("/admin/genre");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan yang tidak terduga", {
        description: "Silakan coba lagi atau hubungi administrator.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Tambah Genre Baru
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Menambahkan kategori genre baru untuk anime
        </p>
      </div>

      {/* Form Card */}
      <Card className="max-w-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
              <Tags className="h-4 w-4 text-white" />
            </div>
            Informasi Genre
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Isi informasi genre yang akan ditambahkan ke platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nama Genre */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-slate-900 dark:text-white font-medium"
              >
                Nama Genre *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Contoh: Action, Romance, Comedy"
                className={`border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 ${
                  errors.name ? "border-red-500" : ""
                }`}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {errors.name.message}
                </p>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Nama genre akan otomatis dikonversi menjadi slug URL
              </p>
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-slate-900 dark:text-white font-medium"
              >
                Deskripsi (Opsional)
              </Label>
              <Textarea
                id="description"
                placeholder="Jelaskan karakteristik dari genre ini..."
                rows={4}
                className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 resize-none"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {errors.description.message}
                </p>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Berikan deskripsi singkat tentang genre ini untuk membantu
                pengguna memahami karakteristiknya
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-sky-500 hover:bg-sky-600 text-white"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Genre
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-slate-200 dark:border-slate-700"
                onClick={() => router.push("/admin/genre")}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="max-w-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
            💡 Tips Menambahkan Genre
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2 flex-shrink-0" />
              <span>Gunakan nama yang singkat dan mudah dipahami</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2 flex-shrink-0" />
              <span>
                Pastikan genre belum ada sebelumnya untuk menghindari duplikat
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2 flex-shrink-0" />
              <span>
                Deskripsi membantu pengguna memahami karakteristik genre
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2 flex-shrink-0" />
              <span>Slug akan dibuat otomatis berdasarkan nama genre</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
