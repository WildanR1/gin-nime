"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getGenreById, updateGenreRHF } from "@/actions/genre";
import { updateGenreSchema } from "@/lib/validations/genre";
import type { UpdateGenreInput } from "@/lib/validations/genre";
import { GenreWithCount } from "@/lib/models/genre";
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
import { Save, Tags, Loader2 } from "lucide-react";

export default function EditGenrePage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [genre, setGenre] = useState<GenreWithCount | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<UpdateGenreInput>({
    resolver: zodResolver(updateGenreSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        if (typeof params.id === "string") {
          const result = await getGenreById(params.id);

          if (result.success && result.data) {
            setGenre(result.data);
            // Reset form with the fetched data
            reset({
              name: result.data.name,
              description: result.data.description || "",
            });
          } else {
            toast.error("Genre tidak ditemukan", {
              description: result.message,
            });
            router.push("/admin/genre");
          }
        }
      } catch (error) {
        console.error("Error fetching genre:", error);
        toast.error("Gagal memuat data genre", {
          description: "Terjadi kesalahan saat memuat data genre.",
        });
        router.push("/admin/genre");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchGenre();
  }, [params.id, router, reset]);

  const onSubmit = async (data: UpdateGenreInput) => {
    if (!genre) return;

    setIsLoading(true);

    try {
      const result = await updateGenreRHF(genre.id, data);

      if (!result.success) {
        if (result.errors) {
          // Set field-specific errors
          Object.entries(result.errors).forEach(([field, message]) => {
            setError(field as keyof UpdateGenreInput, {
              type: "server",
              message,
            });
          });
        }
        toast.error("Gagal memperbarui genre", {
          description: result.message,
        });
      } else {
        // Show success message and redirect
        toast.success("Genre berhasil diperbarui!", {
          description: "Data genre telah berhasil diperbarui.",
        });
        router.push("/admin/genre");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan", {
        description: "Terjadi kesalahan yang tidak terduga.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            Memuat data genre...
          </p>
        </div>
      </div>
    );
  }

  if (!genre) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Genre tidak ditemukan
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Edit Genre: {genre.name}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Update informasi genre yang dipilih
        </p>
        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
          <span>Digunakan di {genre._count.animes} anime</span>
          <span>Slug: {genre.slug}</span>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
              <Tags className="h-4 w-4 text-white" />
            </div>
            Informasi Genre
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Update data genre
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label
                htmlFor="name"
                className="text-slate-900 dark:text-white font-medium"
              >
                Nama Genre *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Masukkan nama genre"
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
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Slug akan diupdate otomatis jika nama diubah
              </p>
            </div>

            <div>
              <Label
                htmlFor="description"
                className="text-slate-900 dark:text-white font-medium"
              >
                Deskripsi (Opsional)
              </Label>
              <Textarea
                id="description"
                placeholder="Masukkan deskripsi genre (opsional)"
                className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 resize-none min-h-24"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            {genre && genre._count.animes > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  ⚠️ Perhatian: Genre ini digunakan di {genre._count.animes}{" "}
                  anime. Mengubah nama akan mempengaruhi tampilan di semua anime
                  tersebut.
                </p>
              </div>
            )}

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
                    Update Genre
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
    </div>
  );
}
