import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Film,
  Calendar,
  Star,
  Settings,
  LogOut,
  Filter,
} from "lucide-react";

export default function AnimeManagementPage() {
  // Mock data - nanti akan diganti dengan data dari database
  const animeList = [
    {
      id: "1",
      title: "Jujutsu Kaisen",
      slug: "jujutsu-kaisen",
      coverImage: "/api/placeholder/100/150",
      status: "ONGOING",
      totalEpisodes: 24,
      rating: 8.9,
      releaseYear: 2020,
      createdAt: "2024-01-01",
      genres: ["Action", "Supernatural"],
    },
    {
      id: "2",
      title: "Attack on Titan",
      slug: "attack-on-titan",
      coverImage: "/api/placeholder/100/150",
      status: "COMPLETED",
      totalEpisodes: 87,
      rating: 9.2,
      releaseYear: 2013,
      createdAt: "2024-01-02",
      genres: ["Action", "Drama"],
    },
    {
      id: "3",
      title: "Demon Slayer",
      slug: "demon-slayer",
      coverImage: "/api/placeholder/100/150",
      status: "ONGOING",
      totalEpisodes: 32,
      rating: 8.7,
      releaseYear: 2019,
      createdAt: "2024-01-03",
      genres: ["Action", "Historical"],
    },
    {
      id: "4",
      title: "One Piece",
      slug: "one-piece",
      coverImage: "/api/placeholder/100/150",
      status: "ONGOING",
      totalEpisodes: 1095,
      rating: 9.0,
      releaseYear: 1999,
      createdAt: "2024-01-04",
      genres: ["Action", "Adventure"],
    },
    {
      id: "5",
      title: "My Hero Academia",
      slug: "my-hero-academia",
      coverImage: "/api/placeholder/100/150",
      status: "ONGOING",
      totalEpisodes: 158,
      rating: 8.5,
      releaseYear: 2016,
      createdAt: "2024-01-05",
      genres: ["Action", "School"],
    },
  ];

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
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Manajemen Anime
            </h1>
            <p className="text-gray-400">Kelola koleksi anime dan episode</p>
          </div>
          <Link href="/admin/anime/tambah">
            <Button className="bg-sky-600 hover:bg-sky-700">
              <Plus className="mr-2 w-4 h-4" />
              Tambah Anime
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari anime berdasarkan judul..."
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter Status
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Filter Tahun
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Anime Table */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              Daftar Anime ({animeList.length})
            </CardTitle>
            <CardDescription className="text-gray-400">
              Kelola anime yang tersedia di platform
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="text-left p-4 text-white font-medium">
                      Anime
                    </th>
                    <th className="text-left p-4 text-white font-medium">
                      Status
                    </th>
                    <th className="text-left p-4 text-white font-medium">
                      Episode
                    </th>
                    <th className="text-left p-4 text-white font-medium">
                      Rating
                    </th>
                    <th className="text-left p-4 text-white font-medium">
                      Tahun
                    </th>
                    <th className="text-left p-4 text-white font-medium">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {animeList.map((anime, index) => (
                    <tr
                      key={anime.id}
                      className={`border-b border-slate-700 hover:bg-slate-700/50 ${
                        index % 2 === 0 ? "bg-slate-800" : "bg-slate-750"
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={anime.coverImage}
                            alt={anime.title}
                            className="w-12 h-18 object-cover rounded"
                          />
                          <div>
                            <h3 className="text-white font-medium">
                              {anime.title}
                            </h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {anime.genres.map((genre) => (
                                <Badge
                                  key={genre}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {genre}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            anime.status === "ONGOING" ? "default" : "secondary"
                          }
                        >
                          {anime.status === "ONGOING" ? "Ongoing" : "Completed"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-white">
                          {anime.totalEpisodes}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-white">{anime.rating}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-300">
                          {anime.releaseYear}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Link href={`/anime/${anime.slug}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/anime/edit/${anime.id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/anime/${anime.id}/episode`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                            >
                              <Film className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-900 border-red-700 text-red-300 hover:bg-red-800"
                            onClick={() => {
                              if (
                                confirm(
                                  `Apakah Anda yakin ingin menghapus ${anime.title}?`
                                )
                              ) {
                                // Handle delete
                                console.log("Delete anime:", anime.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              disabled
              className="bg-slate-800 border-slate-600 text-white"
            >
              Previous
            </Button>
            <Button className="bg-sky-600 hover:bg-sky-700">1</Button>
            <Button
              variant="outline"
              className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
            >
              2
            </Button>
            <Button
              variant="outline"
              className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
            >
              3
            </Button>
            <Button
              variant="outline"
              className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
            >
              Next
            </Button>
          </div>
        </div>
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
