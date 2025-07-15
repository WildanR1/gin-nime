"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { LogoutButton } from "@/components/admin/logout-button";
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
import { ArrowLeft, Save, Tags, Settings, Loader2 } from "lucide-react";

interface Genre {
  id: string;
  name: string;
  slug: string;
  _count: {
    animes: number;
  };
}

export default function EditGenrePage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [genre, setGenre] = useState<Genre | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special chars except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const response = await fetch(`/api/admin/genres/${params.id}`);
        if (response.ok) {
          const genreData = await response.json();
          setGenre(genreData);
          setFormData({
            name: genreData.name,
            description: genreData.description || "",
          });
        } else {
          alert("Genre tidak ditemukan");
          router.push("/admin/genre");
        }
      } catch (error) {
        console.error("Error fetching genre:", error);
        alert("Terjadi kesalahan saat memuat data genre");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (params.id) {
      fetchGenre();
    }
  }, [params.id, router]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
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
      const slug = generateSlug(formData.name.trim());

      const response = await fetch(`/api/admin/genres/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          slug: slug,
        }),
      });

      if (response.ok) {
        alert("Genre berhasil diupdate!");
        router.push("/admin/genre");
      } else {
        const error = await response.json();
        alert(error.message || "Terjadi kesalahan saat mengupdate genre");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat mengupdate genre");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-white">Memuat data genre...</p>
        </div>
      </div>
    );
  }

  if (!genre) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white">Genre tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Admin Navigation */}
      <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link
                href="/admin/dashboard"
                className="flex items-center space-x-2"
              >
                <Image
                  src="/image/logo.png"
                  alt="GinAnime Logo"
                  width={32}
                  height={32}
                  className="rounded"
                />
                <span className="text-2xl font-bold text-white">
                  Gin<span className="text-sky-500">Anime</span> Admin
                </span>
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link
                  href="/admin/anime"
                  className="text-gray-300 hover:text-sky-400 transition-colors"
                >
                  Kelola Anime
                </Link>
                <Link href="/admin/genre" className="text-sky-400 font-medium">
                  Kelola Genre
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-400 mb-8">
          <Link
            href="/admin/genre"
            className="hover:text-white transition-colors flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali ke Manajemen Genre
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Edit Genre: {genre.name}
          </h1>
          <p className="text-gray-400">Update informasi genre yang dipilih</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-sm text-gray-500">
              Digunakan di {genre._count.animes} anime
            </span>
            <span className="text-sm text-gray-500">Slug: {genre.slug}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500/20 to-sky-600/20 flex items-center justify-center">
                  <Tags className="h-4 w-4 text-purple-500" />
                </div>
                Informasi Genre
              </CardTitle>
              <CardDescription className="text-gray-400">
                Update data genre
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-white">
                  Nama Genre *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Masukkan nama genre"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
                <p className="text-sm text-gray-400 mt-1">
                  Slug baru:{" "}
                  {generateSlug(formData.name) || "slug-akan-dibuat-otomatis"}
                </p>
              </div>

              <div>
                <Label htmlFor="description" className="text-slate-200">
                  Deskripsi (Opsional)
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Masukkan deskripsi genre (opsional)"
                  className="bg-slate-900/50 border-slate-600/50 text-slate-200 placeholder:text-slate-400 min-h-24 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              {genre._count.animes > 0 && (
                <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
                  <p className="text-yellow-300 text-sm">
                    ⚠️ Perhatian: Genre ini digunakan di {genre._count.animes}{" "}
                    anime. Mengubah nama akan mempengaruhi tampilan di semua
                    anime tersebut.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Actions */}
          <div className="flex justify-end space-x-4 mt-8">
            <Link href="/admin/genre">
              <Button
                variant="outline"
                className="bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-slate-200"
              >
                Batal
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25"
              disabled={isLoading}
            >
              <Save className="mr-2 w-4 h-4" />
              {isLoading ? "Menyimpan..." : "Update Genre"}
            </Button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 GinAnime Admin Panel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
