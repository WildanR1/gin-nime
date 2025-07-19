"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAnime, updateAnime } from "@/actions/anime";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface AnimeFormData {
  title: string;
  synopsis: string;
  coverImage: string;
  releaseYear: number | "";
  status: "ONGOING" | "COMPLETED" | "UPCOMING" | "HIATUS";
  rating: number | "";
  totalEpisodes: number | "";
  duration: number | "";
  animeTypeId: string;
  studioId: string;
  genreIds: string[];
}

interface AnimeFormProps {
  animeTypes: Array<{ id: string; name: string; _count: { animes: number } }>;
  studios: Array<{ id: string; name: string; _count: { animes: number } }>;
  genres: Array<{
    id: string;
    name: string;
    slug: string;
    _count: { animes: number };
  }>;
  mode: "create" | "edit";
  initialData?: Partial<AnimeFormData> & { id?: string };
}

export function AnimeForm({
  animeTypes,
  studios,
  genres,
  mode,
  initialData,
}: AnimeFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AnimeFormData>({
    title: initialData?.title || "",
    synopsis: initialData?.synopsis || "",
    coverImage: initialData?.coverImage || "",
    releaseYear: initialData?.releaseYear || "",
    status: initialData?.status || "ONGOING",
    rating: initialData?.rating || "",
    totalEpisodes: initialData?.totalEpisodes || "",
    duration: initialData?.duration || "",
    animeTypeId: initialData?.animeTypeId || "",
    studioId: initialData?.studioId || "",
    genreIds: initialData?.genreIds || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof AnimeFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleGenreToggle = (genreId: string) => {
    setFormData((prev) => ({
      ...prev,
      genreIds: prev.genreIds.includes(genreId)
        ? prev.genreIds.filter((id) => id !== genreId)
        : [...prev.genreIds, genreId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Convert string numbers to actual numbers
      const submitData = {
        ...formData,
        releaseYear: formData.releaseYear
          ? Number(formData.releaseYear)
          : undefined,
        rating: formData.rating ? Number(formData.rating) : undefined,
        totalEpisodes: formData.totalEpisodes
          ? Number(formData.totalEpisodes)
          : undefined,
        duration: formData.duration ? Number(formData.duration) : undefined,
        animeTypeId: formData.animeTypeId || undefined,
        studioId: formData.studioId || undefined,
      };

      let result;
      if (mode === "create") {
        result = await createAnime(submitData as any);
      } else {
        result = await updateAnime(initialData?.id!, submitData as any);
      }

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/anime");
        router.refresh();
      } else {
        if (result.errors) {
          setErrors(result.errors);
        }
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan yang tidak terduga");
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Judul Anime *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Masukkan judul anime"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Synopsis */}
              <div className="space-y-2">
                <Label htmlFor="synopsis">Sinopsis</Label>
                <Textarea
                  id="synopsis"
                  value={formData.synopsis}
                  onChange={(e) =>
                    handleInputChange("synopsis", e.target.value)
                  }
                  placeholder="Masukkan sinopsis anime"
                  rows={4}
                  className={errors.synopsis ? "border-red-500" : ""}
                />
                {errors.synopsis && (
                  <p className="text-sm text-red-500">{errors.synopsis}</p>
                )}
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <Label htmlFor="coverImage">URL Cover Image</Label>
                <Input
                  id="coverImage"
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) =>
                    handleInputChange("coverImage", e.target.value)
                  }
                  placeholder="https://example.com/cover.jpg"
                  className={errors.coverImage ? "border-red-500" : ""}
                />
                {errors.coverImage && (
                  <p className="text-sm text-red-500">{errors.coverImage}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Classification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Klasifikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div className="space-y-2">
                <Label>Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger
                    className={errors.status ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ONGOING">Sedang Tayang</SelectItem>
                    <SelectItem value="COMPLETED">Selesai</SelectItem>
                    <SelectItem value="UPCOMING">Akan Datang</SelectItem>
                    <SelectItem value="HIATUS">Hiatus</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-500">{errors.status}</p>
                )}
              </div>

              {/* Anime Type */}
              <div className="space-y-2">
                <Label>Tipe Anime</Label>
                <Select
                  value={formData.animeTypeId}
                  onValueChange={(value) =>
                    handleInputChange("animeTypeId", value)
                  }
                >
                  <SelectTrigger
                    className={errors.animeTypeId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Pilih tipe anime" />
                  </SelectTrigger>
                  <SelectContent>
                    {animeTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.animeTypeId && (
                  <p className="text-sm text-red-500">{errors.animeTypeId}</p>
                )}
              </div>

              {/* Studio */}
              <div className="space-y-2">
                <Label>Studio</Label>
                <Select
                  value={formData.studioId}
                  onValueChange={(value) =>
                    handleInputChange("studioId", value)
                  }
                >
                  <SelectTrigger
                    className={errors.studioId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Pilih studio" />
                  </SelectTrigger>
                  <SelectContent>
                    {studios.map((studio) => (
                      <SelectItem key={studio.id} value={studio.id}>
                        {studio.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.studioId && (
                  <p className="text-sm text-red-500">{errors.studioId}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Tambahan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Release Year */}
              <div className="space-y-2">
                <Label htmlFor="releaseYear">Tahun Rilis</Label>
                <Input
                  id="releaseYear"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  value={formData.releaseYear}
                  onChange={(e) =>
                    handleInputChange("releaseYear", e.target.value)
                  }
                  placeholder="2024"
                  className={errors.releaseYear ? "border-red-500" : ""}
                />
                {errors.releaseYear && (
                  <p className="text-sm text-red-500">{errors.releaseYear}</p>
                )}
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (0-10)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => handleInputChange("rating", e.target.value)}
                  placeholder="8.5"
                  className={errors.rating ? "border-red-500" : ""}
                />
                {errors.rating && (
                  <p className="text-sm text-red-500">{errors.rating}</p>
                )}
              </div>

              {/* Total Episodes */}
              <div className="space-y-2">
                <Label htmlFor="totalEpisodes">Total Episode</Label>
                <Input
                  id="totalEpisodes"
                  type="number"
                  min="1"
                  value={formData.totalEpisodes}
                  onChange={(e) =>
                    handleInputChange("totalEpisodes", e.target.value)
                  }
                  placeholder="12"
                  className={errors.totalEpisodes ? "border-red-500" : ""}
                />
                {errors.totalEpisodes && (
                  <p className="text-sm text-red-500">{errors.totalEpisodes}</p>
                )}
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Durasi per Episode (menit)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                  placeholder="24"
                  className={errors.duration ? "border-red-500" : ""}
                />
                {errors.duration && (
                  <p className="text-sm text-red-500">{errors.duration}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Genres */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Genre *
                <span className="ml-2 text-sm font-normal text-slate-500">
                  ({formData.genreIds.length} dipilih)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {errors.genreIds && (
                <p className="text-sm text-red-500 mb-4">{errors.genreIds}</p>
              )}
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {genres.map((genre) => (
                  <div
                    key={genre.id}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Checkbox
                      id={`genre-${genre.id}`}
                      checked={formData.genreIds.includes(genre.id)}
                      onCheckedChange={() => handleGenreToggle(genre.id)}
                    />
                    <Label
                      htmlFor={`genre-${genre.id}`}
                      className="flex-1 cursor-pointer text-sm"
                    >
                      {genre.name}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Selected Genres */}
              {formData.genreIds.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Genre yang dipilih:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.genreIds.map((genreId) => {
                      const genre = genres.find((g) => g.id === genreId);
                      return genre ? (
                        <Badge
                          key={genreId}
                          variant="secondary"
                          className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20"
                        >
                          {genre.name}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 ml-2 hover:bg-transparent"
                            onClick={() => handleGenreToggle(genreId)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {mode === "create" ? "Tambah Anime" : "Perbarui Anime"}
        </Button>
      </div>
    </form>
  );
}
