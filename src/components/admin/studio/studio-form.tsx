"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createStudio, updateStudio } from "@/actions/studio";
import { Studio } from "@/lib/models/studio";
import { studioValidation } from "@/lib/validations/studio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { z } from "zod";

type StudioFormData = z.infer<typeof studioValidation>;

interface StudioFormProps {
  studio?: Studio;
  isEditing?: boolean;
}

export function StudioForm({ studio, isEditing = false }: StudioFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StudioFormData>({
    resolver: zodResolver(studioValidation),
    defaultValues: {
      name: studio?.name || "",
      description: studio?.description || "",
    },
  });

  const onSubmit = async (data: StudioFormData) => {
    setIsSubmitting(true);

    try {
      let result;

      if (isEditing && studio) {
        result = await updateStudio(studio.id, data);
      } else {
        result = await createStudio(data);
      }

      if (result.success) {
        toast.success(result.message);
        reset();
        router.push("/admin/studio");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan yang tidak diharapkan");
      console.error("Studio form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <Link
          href="/admin/studio"
          className="hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          Studio
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white">
          {isEditing ? "Edit Studio" : "Tambah Studio Baru"}
        </span>
      </div>

      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          asChild
          className="border-slate-200 dark:border-slate-700"
        >
          <Link href="/admin/studio">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isEditing ? `Edit Studio: ${studio?.name}` : "Tambah Studio Baru"}
        </h1>
      </div>

      {/* Form */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">
            Informasi Studio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Studio Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-slate-900 dark:text-white font-medium"
              >
                Nama Studio <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Masukkan nama studio"
                className={`bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white ${
                  errors.name ? "border-red-500" : ""
                }`}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Studio Description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-slate-900 dark:text-white font-medium"
              >
                Deskripsi
              </Label>
              <Textarea
                id="description"
                placeholder="Masukkan deskripsi studio (opsional)"
                rows={4}
                className={`bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white resize-none ${
                  errors.description ? "border-red-500" : ""
                }`}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Berikan informasi singkat tentang studio anime ini.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditing ? "Mengupdate..." : "Menyimpan..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? "Update Studio" : "Simpan Studio"}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
                disabled={isSubmitting}
                className="border-slate-200 dark:border-slate-700"
              >
                <Link href="/admin/studio">Batal</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
