"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAnimeType, updateAnimeType } from "@/actions/animeType";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save, X } from "lucide-react";

interface AnimeTypeFormProps {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    name: string;
  };
}

export function AnimeTypeForm({ mode, initialData }: AnimeTypeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(initialData?.name || "");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nama tipe anime harus diisi");
      return;
    }

    setIsSubmitting(true);

    try {
      let result;

      if (mode === "create") {
        result = await createAnimeType({ name: name.trim() });
      } else if (initialData) {
        result = await updateAnimeType(initialData.id, { name: name.trim() });
      }

      if (result?.success) {
        toast.success(result.message);
        router.push("/admin/anime-type");
        router.refresh();
      } else {
        toast.error(result?.message || "Terjadi kesalahan");
        if (result?.message.includes("sudah ada")) {
          setError("Nama tipe anime sudah digunakan");
        }
      }
    } catch (error) {
      toast.error("Terjadi kesalahan yang tidak diharapkan");
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <Label
          htmlFor="name"
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Nama Tipe Anime *
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          placeholder="Contoh: TV, Movie, ONA, OVA, Special"
          className={error ? "border-red-500" : ""}
          disabled={isSubmitting}
          maxLength={50}
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Nama tipe anime seperti TV, Movie, ONA, OVA, atau Special
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="px-6"
        >
          <X className="w-4 h-4 mr-2" />
          Batal
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !name.trim()}
          className="px-6 bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {mode === "create" ? "Tambah Tipe Anime" : "Update Tipe Anime"}
        </Button>
      </div>
    </form>
  );
}
