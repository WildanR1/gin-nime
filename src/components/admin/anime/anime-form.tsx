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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickAddModal } from "@/components/ui/quick-add-modal";
import { FormCombobox } from "@/components/ui/form-combobox";
import { FormMultiCombobox } from "@/components/ui/form-multi-combobox";
import {
  Loader2,
  FileText,
  Info,
  Settings,
  Calendar,
  Star,
  Play,
  Clock,
  Plus,
  Building2,
  Tags,
} from "lucide-react";
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

  const handleQuickAddSuccess = () => {
    // Refresh the page to get updated data
    router.refresh();
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
          <Card className="bg-slate-800 border border-slate-600 shadow-lg p-0">
            <CardHeader className="border-b border-slate-600 bg-slate-700/30 p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
                  Informasi Dasar
                  <div className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-slate-200 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-sky-400" />
                    Judul Anime *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Masukkan judul anime"
                    className={`bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-400 focus:border-sky-500 transition-colors ${
                      errors.title ? "border-red-500" : ""
                    }`}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-400">{errors.title}</p>
                  )}
                </div>

                {/* Synopsis */}
                <div className="space-y-2">
                  <Label
                    htmlFor="synopsis"
                    className="text-slate-200 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-sky-400" />
                    Sinopsis
                  </Label>
                  <Textarea
                    id="synopsis"
                    value={formData.synopsis}
                    onChange={(e) =>
                      handleInputChange("synopsis", e.target.value)
                    }
                    placeholder="Masukkan sinopsis anime"
                    rows={4}
                    className={`bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-400 focus:border-sky-500 transition-colors ${
                      errors.synopsis ? "border-red-500" : ""
                    }`}
                  />
                  {errors.synopsis && (
                    <p className="text-sm text-red-400">{errors.synopsis}</p>
                  )}
                </div>

                {/* Cover Image */}
                <div className="space-y-2">
                  <Label
                    htmlFor="coverImage"
                    className="text-slate-200 flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 text-sky-400" />
                    URL Cover Image
                  </Label>
                  <Input
                    id="coverImage"
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) =>
                      handleInputChange("coverImage", e.target.value)
                    }
                    placeholder="https://example.com/cover.jpg"
                    className={`bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-400 focus:border-sky-500 transition-colors ${
                      errors.coverImage ? "border-red-500" : ""
                    }`}
                  />
                  {errors.coverImage && (
                    <p className="text-sm text-red-400">{errors.coverImage}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Classification */}
          <Card className="bg-slate-800 border border-slate-600 shadow-lg p-0">
            <CardHeader className="border-b border-slate-600 bg-slate-700/30 p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
                  Klasifikasi
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Status */}
                <div className="space-y-2">
                  <Label className="text-slate-200 flex items-center gap-2">
                    <Play className="w-4 h-4 text-emerald-400" />
                    Status *
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger
                      className={`bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600 transition-colors ${
                        errors.status ? "border-red-500" : ""
                      }`}
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
                    <p className="text-sm text-red-400">{errors.status}</p>
                  )}
                </div>

                {/* Anime Type */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-slate-200 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-emerald-400" />
                      Tipe Anime
                    </Label>
                    <QuickAddModal
                      type="animeType"
                      onSuccess={handleQuickAddSuccess}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600 hover:text-white h-7 px-2 text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Tambah
                      </Button>
                    </QuickAddModal>
                  </div>
                  <FormCombobox
                    items={animeTypes}
                    value={formData.animeTypeId}
                    onValueChange={(value) =>
                      handleInputChange("animeTypeId", value)
                    }
                    placeholder="Pilih tipe anime"
                    searchPlaceholder="Cari tipe anime..."
                    emptyMessage="Tidak ada tipe anime ditemukan."
                    error={!!errors.animeTypeId}
                  />
                  {errors.animeTypeId && (
                    <p className="text-sm text-red-400">{errors.animeTypeId}</p>
                  )}
                </div>

                {/* Studio */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-slate-200 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      Studio
                    </Label>
                    <QuickAddModal
                      type="studio"
                      onSuccess={handleQuickAddSuccess}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600 hover:text-white h-7 px-2 text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Tambah
                      </Button>
                    </QuickAddModal>
                  </div>
                  <FormCombobox
                    items={studios}
                    value={formData.studioId}
                    onValueChange={(value) =>
                      handleInputChange("studioId", value)
                    }
                    placeholder="Pilih studio"
                    searchPlaceholder="Cari studio..."
                    emptyMessage="Tidak ada studio ditemukan."
                    error={!!errors.studioId}
                  />
                  {errors.studioId && (
                    <p className="text-sm text-red-400">{errors.studioId}</p>
                  )}
                </div>

                {/* Genres */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-slate-200 flex items-center gap-2">
                      <Tags className="w-4 h-4 text-emerald-400" />
                      Genre *
                    </Label>
                    <QuickAddModal
                      type="genre"
                      onSuccess={handleQuickAddSuccess}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600 hover:text-white h-7 px-2 text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Tambah
                      </Button>
                    </QuickAddModal>
                  </div>
                  <FormMultiCombobox
                    items={genres}
                    selectedIds={formData.genreIds}
                    onToggle={(genreId) => {
                      const updatedGenres = formData.genreIds.includes(genreId)
                        ? formData.genreIds.filter((id) => id !== genreId)
                        : [...formData.genreIds, genreId];
                      handleInputChange("genreIds", updatedGenres);
                    }}
                    placeholder="Pilih genre"
                    searchPlaceholder="Cari genre..."
                    emptyMessage="Tidak ada genre ditemukan."
                    error={!!errors.genreIds}
                  />
                  {errors.genreIds && (
                    <p className="text-sm text-red-400">{errors.genreIds}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="space-y-6">
          <Card className="bg-slate-800 border border-slate-600 shadow-lg p-0">
            <CardHeader className="border-b border-slate-600 bg-slate-700/30 p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Info className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
                  Informasi Tambahan
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Release Year */}
                <div className="space-y-2">
                  <Label
                    htmlFor="releaseYear"
                    className="text-slate-200 flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-purple-400" />
                    Tahun Rilis
                  </Label>
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
                    className={`bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-400 focus:border-purple-500 transition-colors ${
                      errors.releaseYear ? "border-red-500" : ""
                    }`}
                  />
                  {errors.releaseYear && (
                    <p className="text-sm text-red-400">{errors.releaseYear}</p>
                  )}
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <Label
                    htmlFor="rating"
                    className="text-slate-200 flex items-center gap-2"
                  >
                    <Star className="w-4 h-4 text-purple-400" />
                    Rating (0-10)
                  </Label>
                  <Input
                    id="rating"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) =>
                      handleInputChange("rating", e.target.value)
                    }
                    placeholder="8.5"
                    className={`bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-400 focus:border-purple-500 transition-colors ${
                      errors.rating ? "border-red-500" : ""
                    }`}
                  />
                  {errors.rating && (
                    <p className="text-sm text-red-400">{errors.rating}</p>
                  )}
                </div>

                {/* Total Episodes */}
                <div className="space-y-2">
                  <Label
                    htmlFor="totalEpisodes"
                    className="text-slate-200 flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 text-purple-400" />
                    Total Episode
                  </Label>
                  <Input
                    id="totalEpisodes"
                    type="number"
                    min="1"
                    value={formData.totalEpisodes}
                    onChange={(e) =>
                      handleInputChange("totalEpisodes", e.target.value)
                    }
                    placeholder="12"
                    className={`bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-400 focus:border-purple-500 transition-colors ${
                      errors.totalEpisodes ? "border-red-500" : ""
                    }`}
                  />
                  {errors.totalEpisodes && (
                    <p className="text-sm text-red-400">
                      {errors.totalEpisodes}
                    </p>
                  )}
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label
                    htmlFor="duration"
                    className="text-slate-200 flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4 text-purple-400" />
                    Durasi per Episode (menit)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) =>
                      handleInputChange("duration", e.target.value)
                    }
                    placeholder="24"
                    className={`bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-400 focus:border-purple-500 transition-colors ${
                      errors.duration ? "border-red-500" : ""
                    }`}
                  />
                  {errors.duration && (
                    <p className="text-sm text-red-400">{errors.duration}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-slate-600">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
          className="border-slate-500 text-slate-300 hover:bg-slate-600/50 hover:border-slate-400 transition-all duration-200"
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-sky-500 hover:bg-sky-600 text-white shadow-lg hover:shadow-sky-500/25 transition-all duration-200 font-medium"
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {!isLoading && <Play className="w-4 h-4 mr-2" />}
          {mode === "create" ? "Tambah Anime" : "Perbarui Anime"}
        </Button>
      </div>
    </form>
  );
}
