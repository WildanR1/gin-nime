"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, X, Plus, Settings, Save } from "lucide-react";

export default function AddAnimePage() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const availableGenres = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Historical",
    "Horror",
    "Martial Arts",
    "Mecha",
    "Music",
    "Mystery",
    "Psychological",
    "Romance",
    "School",
    "Sci-Fi",
    "Seinen",
    "Shoujo",
    "Shounen",
    "Slice of Life",
    "Sports",
    "Supernatural",
    "Super Power",
    "Thriller",
  ];

  const [formData, setFormData] = useState({
    title: "",
    synopsis: "",
    coverImage: "",
    releaseYear: "",
    status: "",
    totalEpisodes: "",
    rating: "",
    studio: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock submit - nanti akan diganti dengan API call
    setTimeout(() => {
      console.log("Form submitted:", { ...formData, genres: selectedGenres });
      alert("Anime berhasil ditambahkan!");
      setIsLoading(false);
      // Redirect to anime management
      window.location.href = "/admin/anime";
    }, 1000);
  };

  const addGenre = (genre: string) => {
    if (!selectedGenres.includes(genre)) {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const removeGenre = (genre: string) => {
    setSelectedGenres(selectedGenres.filter((g) => g !== genre));
  };

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
                <Link href="/admin/anime" className="text-sky-400 font-medium">
                  Kelola Anime
                </Link>
                <Link
                  href="/admin/genre"
                  className="text-gray-300 hover:text-sky-400 transition-colors"
                >
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-400 mb-8">
          <Link
            href="/admin/anime"
            className="hover:text-white transition-colors flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali ke Manajemen Anime
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Tambah Anime Baru
          </h1>
          <p className="text-gray-400">
            Masukkan informasi lengkap anime yang akan ditambahkan
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Informasi Dasar</CardTitle>
                  <CardDescription className="text-gray-400">
                    Data utama anime
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white">
                      Judul Anime *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Masukkan judul anime"
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="synopsis" className="text-white">
                      Sinopsis *
                    </Label>
                    <Textarea
                      id="synopsis"
                      value={formData.synopsis}
                      onChange={(e) =>
                        setFormData({ ...formData, synopsis: e.target.value })
                      }
                      placeholder="Masukkan sinopsis anime"
                      className="bg-slate-700 border-slate-600 text-white min-h-32"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="releaseYear" className="text-white">
                        Tahun Rilis *
                      </Label>
                      <Input
                        id="releaseYear"
                        type="number"
                        value={formData.releaseYear}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            releaseYear: e.target.value,
                          })
                        }
                        placeholder="2024"
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="studio" className="text-white">
                        Studio
                      </Label>
                      <Input
                        id="studio"
                        value={formData.studio}
                        onChange={(e) =>
                          setFormData({ ...formData, studio: e.target.value })
                        }
                        placeholder="Nama studio"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="status" className="text-white">
                        Status *
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ONGOING">Ongoing</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="UPCOMING">Upcoming</SelectItem>
                          <SelectItem value="HIATUS">Hiatus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="totalEpisodes" className="text-white">
                        Total Episode
                      </Label>
                      <Input
                        id="totalEpisodes"
                        type="number"
                        value={formData.totalEpisodes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            totalEpisodes: e.target.value,
                          })
                        }
                        placeholder="24"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="rating" className="text-white">
                        Rating
                      </Label>
                      <Input
                        id="rating"
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={formData.rating}
                        onChange={(e) =>
                          setFormData({ ...formData, rating: e.target.value })
                        }
                        placeholder="8.5"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Genres */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Genre</CardTitle>
                  <CardDescription className="text-gray-400">
                    Pilih genre yang sesuai dengan anime
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Pilih Genre</Label>
                    <Select onValueChange={addGenre}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Tambah genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableGenres
                          .filter((genre) => !selectedGenres.includes(genre))
                          .map((genre) => (
                            <SelectItem key={genre} value={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedGenres.map((genre) => (
                      <Badge
                        key={genre}
                        variant="secondary"
                        className="bg-sky-900 text-sky-300 cursor-pointer hover:bg-sky-800"
                        onClick={() => removeGenre(genre)}
                      >
                        {genre}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cover Image */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-800 border-slate-700 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-white">Cover Image</CardTitle>
                  <CardDescription className="text-gray-400">
                    Upload gambar cover anime
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">
                      Drag & drop atau click untuk upload
                    </p>
                    <p className="text-gray-500 text-sm">
                      JPG, PNG, WebP (Max 5MB)
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    >
                      Pilih File
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="coverImage" className="text-white">
                      URL Gambar (Alternatif)
                    </Label>
                    <Input
                      id="coverImage"
                      value={formData.coverImage}
                      onChange={(e) =>
                        setFormData({ ...formData, coverImage: e.target.value })
                      }
                      placeholder="https://example.com/cover.jpg"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  {formData.coverImage && (
                    <div className="mt-4">
                      <img
                        src={formData.coverImage}
                        alt="Preview"
                        className="w-full h-auto rounded-lg"
                        onError={() =>
                          setFormData({ ...formData, coverImage: "" })
                        }
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end space-x-4 mt-8">
            <Link href="/admin/anime">
              <Button
                variant="outline"
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                Batal
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700"
              disabled={isLoading}
            >
              <Save className="mr-2 w-4 h-4" />
              {isLoading ? "Menyimpan..." : "Simpan Anime"}
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
