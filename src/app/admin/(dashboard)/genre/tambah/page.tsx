"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { ArrowLeft, Save, Tags } from "lucide-react";

export default function AddGenrePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Nama genre tidak boleh kosong");
      return;
    }

    if (formData.name.trim().length < 2) {
      alert("Nama genre minimal 2 karakter");
      return;
    }

    setIsLoading(true);

    try {
      const slug = generateSlug(formData.name);

      const response = await fetch("/api/admin/genres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          slug: slug,
          description: formData.description.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menambahkan genre");
      }

      router.push("/admin/genre");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/genre">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Tambah Genre Baru
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Menambahkan kategori genre baru untuk anime
          </p>
        </div>
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Genre */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-900 dark:text-white font-medium">
                Nama Genre *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Contoh: Action, Romance, Comedy"
                required
                className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Nama genre akan otomatis dikonversi menjadi slug URL
                {formData.name && (
                  <span className="block mt-1 font-mono text-sky-600 dark:text-sky-400">
                    Slug: {generateSlug(formData.name)}
                  </span>
                )}
              </p>
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-900 dark:text-white font-medium">
                Deskripsi (Opsional)
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Jelaskan karakteristik dari genre ini..."
                rows={4}
                className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 resize-none"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Berikan deskripsi singkat tentang genre ini untuk membantu pengguna memahami karakteristiknya
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                type="submit"
                disabled={isLoading || !formData.name.trim()}
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
              <Link href="/admin/genre">
                <Button 
                  type="button" 
                  variant="outline"
                  className="border-slate-200 dark:border-slate-700"
                >
                  Batal
                </Button>
              </Link>
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
              <span>Pastikan genre belum ada sebelumnya untuk menghindari duplikat</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2 flex-shrink-0" />
              <span>Deskripsi membantu pengguna memahami karakteristik genre</span>
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
