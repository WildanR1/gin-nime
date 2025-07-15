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
    <div className="min-h-screen bg-slate-800">
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
            </div>

            <div className="flex items-center space-x-6">
              {/* Main Navigation Links */}
              <div className="hidden md:flex space-x-8">
                <Link
                  href="/"
                  className="text-white font-medium hover:text-sky-400 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/anime"
                  className="text-gray-300 hover:text-sky-400 transition-colors"
                >
                  Anime
                </Link>
                <Link
                  href="/ongoing"
                  className="text-gray-300 hover:text-sky-400 transition-colors"
                >
                  Ongoing
                </Link>
                <Link
                  href="/jadwal-rilis"
                  className="text-gray-300 hover:text-sky-400 transition-colors"
                >
                  Jadwal Rilis
                </Link>
                <Link
                  href="/genre"
                  className="text-gray-300 hover:text-sky-400 transition-colors"
                >
                  Genre
                </Link>
              </div>

              {/* Search Icon */}
              <button className="p-2 text-gray-300 hover:text-sky-400 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background with hero image - only on large screens and positioned on right */}
        <div className="absolute inset-0 hidden lg:block">
          {/* Image positioned on right 50% */}
          <div className="absolute top-0 right-0 w-1/2 h-full">
            <Image
              src="/image/hero-image.webp"
              alt="Anime Hero Background"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          {/* Gradient overlays for blend effect with very smooth transitions */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 from-25% via-slate-900/80 via-60% to-slate-900/15 to-85%"></div>
          {/* Super smooth separator gradient with extended transition */}
          <div className="absolute top-0 left-0 w-4/5 h-full bg-gradient-to-r from-slate-900 from-0% via-slate-900 via-65% to-transparent to-100%"></div>
          {/* Very gentle overlay on image area */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-transparent from-0% via-slate-900/5 via-40% to-slate-900/20 to-90%"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/8 from-0% via-transparent via-50% to-slate-900/20 to-100%"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-[85vh] flex items-center py-12">
            {/* Content Container - takes full width on mobile, left half on desktop */}
            <div className="w-full lg:w-1/2 space-y-8">
              {/* Brand Title */}
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
                  Gin<span className="text-sky-400">Anime</span>
                </h1>

                {/* Search Bar */}
                <div className="flex max-w-xl mb-8">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Cari anime favorit Anda..."
                      className="w-full h-14 pl-6 pr-4 text-lg bg-black/30 backdrop-blur-md border border-white/20 rounded-l-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent shadow-xl"
                    />
                  </div>
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-sky-500 hover:bg-sky-600 border-0 rounded-l-none rounded-r-xl shadow-xl"
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Brand Description */}
              <div className="space-y-4">
                <p className="text-white text-lg leading-relaxed drop-shadow-lg">
                  Selamat datang di{" "}
                  <span className="text-sky-400 font-semibold">GinAnime</span>,
                  platform streaming anime terdepan yang menghadirkan koleksi
                  anime terlengkap dengan kualitas HD terbaik.
                </p>
                <p className="text-white/90 text-base leading-relaxed drop-shadow-lg">
                  Nikmati ribuan episode anime dari berbagai genre, mulai dari
                  action, romance, comedy, hingga thriller. Tonton anime favorit
                  Anda kapan saja, di mana saja, tanpa iklan yang mengganggu.
                </p>
              </div>

              {/* CTA Button */}
              <div>
                <Link href="/anime">
                  <Button
                    size="lg"
                    className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-xl border-0 transition-all duration-300 hover:scale-105"
                  >
                    <Play className="mr-2 w-5 h-5" />
                    Mulai Menonton
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-800 to-transparent"></div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
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
