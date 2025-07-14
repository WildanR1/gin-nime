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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Play, Star, Filter } from "lucide-react";

export default function AnimeListPage() {
  // Mock data - nanti akan diganti dengan data dari database
  const animeList = [
    {
      id: "1",
      title: "Jujutsu Kaisen",
      slug: "jujutsu-kaisen",
      synopsis:
        "Yuji Itadori adalah siswa SMA yang memiliki kemampuan fisik luar biasa...",
      coverImage: "/api/placeholder/300/400",
      rating: 8.9,
      status: "ONGOING",
      totalEpisodes: 24,
      releaseYear: 2020,
      genres: ["Action", "Supernatural", "School"],
    },
    {
      id: "2",
      title: "Attack on Titan",
      slug: "attack-on-titan",
      synopsis:
        "Ratusan tahun yang lalu, umat manusia hampir punah karena serangan Titan...",
      coverImage: "/api/placeholder/300/400",
      rating: 9.2,
      status: "COMPLETED",
      totalEpisodes: 87,
      releaseYear: 2013,
      genres: ["Action", "Drama", "Fantasy"],
    },
    {
      id: "3",
      title: "Demon Slayer",
      slug: "demon-slayer",
      synopsis:
        "Tanjiro Kamado menjalani kehidupan yang damai dengan keluarganya...",
      coverImage: "/api/placeholder/300/400",
      rating: 8.7,
      status: "ONGOING",
      totalEpisodes: 32,
      releaseYear: 2019,
      genres: ["Action", "Historical", "Supernatural"],
    },
    {
      id: "4",
      title: "One Piece",
      slug: "one-piece",
      synopsis:
        "Monkey D. Luffy mengejar mimpinya untuk menjadi Raja Bajak Laut...",
      coverImage: "/api/placeholder/300/400",
      rating: 9.0,
      status: "ONGOING",
      totalEpisodes: 1095,
      releaseYear: 1999,
      genres: ["Action", "Adventure", "Comedy"],
    },
    {
      id: "5",
      title: "My Hero Academia",
      slug: "my-hero-academia",
      synopsis: "Dalam dunia di mana 80% populasi memiliki kekuatan super...",
      coverImage: "/api/placeholder/300/400",
      rating: 8.5,
      status: "ONGOING",
      totalEpisodes: 158,
      releaseYear: 2016,
      genres: ["Action", "School", "Super Power"],
    },
    {
      id: "6",
      title: "Naruto",
      slug: "naruto",
      synopsis:
        "Naruto Uzumaki adalah ninja muda yang bermimpi menjadi Hokage...",
      coverImage: "/api/placeholder/300/400",
      rating: 8.8,
      status: "COMPLETED",
      totalEpisodes: 720,
      releaseYear: 2002,
      genres: ["Action", "Martial Arts", "Comedy"],
    },
  ];

  const genres = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Historical",
    "Martial Arts",
    "School",
    "Supernatural",
    "Super Power",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-3">
                <Image
                  src="/image/logo.png"
                  alt="GinAnime Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <span className="text-2xl font-bold text-white">
                  Gin<span className="text-sky-500">Anime</span>
                </span>
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/anime" className="text-sky-400 font-medium">
                  Daftar Anime
                </Link>
                <Link
                  href="/genre/action"
                  className="text-gray-300 hover:text-sky-400 transition-colors"
                >
                  Genre
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari anime..."
                  className="bg-slate-800 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Daftar Anime</h1>
          <p className="text-gray-400">Jelajahi koleksi anime lengkap kami</p>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-white font-medium">Filter:</span>
            </div>

            <div className="flex flex-wrap gap-4">
              <Select>
                <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Pilih Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Genre</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre.toLowerCase()}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Tahun Rilis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tahun</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">A-Z</SelectItem>
                  <SelectItem value="rating">Rating Tertinggi</SelectItem>
                  <SelectItem value="year">Tahun Terbaru</SelectItem>
                  <SelectItem value="episodes">Jumlah Episode</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Anime Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {animeList.map((anime) => (
            <Card
              key={anime.id}
              className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105"
            >
              <Link href={`/anime/${anime.slug}`}>
                <div className="relative">
                  <img
                    src={anime.coverImage}
                    alt={anime.title}
                    className="w-full h-80 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                    {anime.rating}
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div
                      className={`text-xs px-2 py-1 rounded mb-2 ${
                        anime.status === "ONGOING"
                          ? "bg-green-900/80 text-green-300"
                          : "bg-blue-900/80 text-blue-300"
                      }`}
                    >
                      {anime.status === "ONGOING" ? "Ongoing" : "Completed"} •{" "}
                      {anime.totalEpisodes} Eps
                    </div>
                  </div>
                </div>
              </Link>

              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg leading-tight line-clamp-2">
                  {anime.title}
                </CardTitle>
                <div className="flex flex-wrap gap-1 mt-2">
                  {anime.genres.slice(0, 2).map((genre) => (
                    <span
                      key={genre}
                      className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded"
                    >
                      {genre}
                    </span>
                  ))}
                  {anime.genres.length > 2 && (
                    <span className="text-xs text-gray-400">
                      +{anime.genres.length - 2}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                  <span>{anime.releaseYear}</span>
                </div>
                <Link href={`/anime/${anime.slug}`}>
                  <Button
                    className="w-full bg-sky-600 hover:bg-sky-700"
                    size="sm"
                  >
                    <Play className="mr-2 w-4 h-4" />
                    Tonton
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              disabled
              className="bg-slate-800 border-slate-600"
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
            <p>&copy; 2025 GinAnime. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
