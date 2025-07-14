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
import { Search, Play, Star, Calendar } from "lucide-react";

export default function HomePage() {
  // Mock data - nanti akan diganti dengan data dari database
  const featuredAnime = [
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
    },
  ];

  const recentlyUpdated = [
    {
      id: "1",
      title: "Jujutsu Kaisen",
      slug: "jujutsu-kaisen",
      episodeNumber: 24,
      episodeTitle: "The Final Battle",
      coverImage: "/api/placeholder/200/120",
    },
    {
      id: "2",
      title: "One Piece",
      slug: "one-piece",
      episodeNumber: 1095,
      episodeTitle: "Luffy's New Power",
      coverImage: "/api/placeholder/200/120",
    },
    {
      id: "3",
      title: "Naruto Shippuden",
      slug: "naruto-shippuden",
      episodeNumber: 500,
      episodeTitle: "The Last Mission",
      coverImage: "/api/placeholder/200/120",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
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
                <Link
                  href="/anime"
                  className="text-gray-300 hover:text-sky-400 transition-colors"
                >
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
                  className="bg-slate-800/80 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-600/50 focus:border-sky-500 focus:outline-none w-64 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-sky-600 to-blue-700 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">
              Selamat Datang di <span className="text-sky-300">GinAnime</span>
            </h1>
            <p className="text-xl mb-8 text-sky-100">
              Nikmati koleksi anime terbaru dan terlengkap dengan kualitas HD
            </p>
            <Link href="/anime">
              <Button
                size="lg"
                className="bg-white text-sky-600 hover:bg-sky-50 shadow-lg"
              >
                <Play className="mr-2 w-5 h-5" />
                Mulai Menonton
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Anime */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8">Anime Unggulan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAnime.map((anime) => (
              <Card
                key={anime.id}
                className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="relative">
                  <img
                    src={anime.coverImage}
                    alt={anime.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                    {anime.rating}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-white">{anime.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {anime.synopsis.substring(0, 100)}...
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-400">
                      {anime.totalEpisodes} Episode
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        anime.status === "ONGOING"
                          ? "bg-green-900 text-green-300"
                          : "bg-blue-900 text-blue-300"
                      }`}
                    >
                      {anime.status === "ONGOING" ? "Ongoing" : "Completed"}
                    </span>
                  </div>
                  <Link href={`/anime/${anime.slug}`}>
                    <Button className="w-full bg-sky-600 hover:bg-sky-700">
                      <Play className="mr-2 w-4 h-4" />
                      Tonton Sekarang
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recently Updated */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">
            Episode Terbaru
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyUpdated.map((episode) => (
              <Card
                key={`${episode.id}-${episode.episodeNumber}`}
                className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex">
                  <img
                    src={episode.coverImage}
                    alt={episode.title}
                    className="w-24 h-24 object-cover rounded-l-lg"
                  />
                  <div className="flex-1 p-4">
                    <h3 className="text-white font-semibold mb-1">
                      {episode.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      Episode {episode.episodeNumber}: {episode.episodeTitle}
                    </p>
                    <Link
                      href={`/anime/${episode.slug}/${episode.episodeNumber}`}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-sky-600 text-sky-400 hover:bg-sky-600 hover:text-white"
                      >
                        <Play className="mr-1 w-3 h-3" />
                        Tonton
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
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
