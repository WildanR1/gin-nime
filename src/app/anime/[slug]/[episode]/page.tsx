import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Play,
  ArrowLeft,
  SkipBack,
  SkipForward,
  List,
  MessageSquare,
  Share2,
  Download,
  Settings,
} from "lucide-react";

interface WatchPageProps {
  params: {
    slug: string;
    episode: string;
  };
}

export default function WatchPage({ params }: WatchPageProps) {
  const episodeNumber = parseInt(params.episode);

  // Mock data - nanti akan diganti dengan query database
  const anime = {
    id: "1",
    title: "Jujutsu Kaisen",
    slug: "jujutsu-kaisen",
    totalEpisodes: 24,
  };

  const episode = {
    id: "1",
    episodeNumber: episodeNumber,
    title: "Ryomen Sukuna",
    description:
      "Yuji Itadori adalah siswa SMA yang bergabung dengan Klub Penelitian Fenomena Paranormal untuk menghindari kegiatan atletik. Suatu hari, klub tersebut berhasil menemukan salah satu jari milik Ryomen Sukuna.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
    duration: 1440, // seconds
    releaseDate: "2020-10-03",
  };

  const relatedEpisodes = [
    {
      episodeNumber: 1,
      title: "Ryomen Sukuna",
      thumbnail: "/api/placeholder/200/120",
      duration: 1440,
    },
    {
      episodeNumber: 2,
      title: "Untuk Diriku",
      thumbnail: "/api/placeholder/200/120",
      duration: 1440,
    },
    {
      episodeNumber: 3,
      title: "Gadis Baja",
      thumbnail: "/api/placeholder/200/120",
      duration: 1440,
    },
    {
      episodeNumber: 4,
      title: "Kelahiran Kutukan",
      thumbnail: "/api/placeholder/200/120",
      duration: 1440,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/image/logo.png"
                  alt="GinAnime Logo"
                  width={32}
                  height={32}
                  className="rounded"
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
                  className="bg-slate-800 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-400 mb-6">
          <Link href="/anime" className="hover:text-white transition-colors">
            Daftar Anime
          </Link>
          <span>/</span>
          <Link
            href={`/anime/${anime.slug}`}
            className="hover:text-white transition-colors"
          >
            {anime.title}
          </Link>
          <span>/</span>
          <span className="text-white">Episode {episodeNumber}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-3">
            {/* Video Player Container */}
            <div className="bg-black rounded-lg overflow-hidden mb-6">
              <div className="relative aspect-video">
                {/* Placeholder for video player */}
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-white mb-4 mx-auto" />
                    <p className="text-white text-lg">Video Player</p>
                    <p className="text-gray-400 text-sm">
                      Video akan dimuat di sini
                    </p>
                  </div>
                </div>

                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-black/50 border-gray-600 text-white"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-black/50 border-gray-600 text-white"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-black/50 border-gray-600 text-white"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Episode Navigation */}
            <div className="flex justify-between items-center mb-6">
              {episodeNumber > 1 ? (
                <Link href={`/anime/${anime.slug}/${episodeNumber - 1}`}>
                  <Button
                    variant="outline"
                    className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                  >
                    <SkipBack className="mr-2 w-4 h-4" />
                    Episode Sebelumnya
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  disabled
                  className="bg-slate-800 border-slate-600"
                >
                  <SkipBack className="mr-2 w-4 h-4" />
                  Episode Sebelumnya
                </Button>
              )}

              {episodeNumber < anime.totalEpisodes ? (
                <Link href={`/anime/${anime.slug}/${episodeNumber + 1}`}>
                  <Button className="bg-sky-600 hover:bg-sky-700">
                    Episode Selanjutnya
                    <SkipForward className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Button disabled className="bg-gray-600">
                  Episode Selanjutnya
                  <SkipForward className="ml-2 w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Episode Info */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white text-xl">
                      {anime.title} - Episode {episode.episodeNumber}
                    </CardTitle>
                    <h2 className="text-lg text-gray-300 mt-1">
                      {episode.title}
                    </h2>
                  </div>
                  <Badge className="bg-sky-600">
                    Episode {episode.episodeNumber}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{episode.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>
                    Dirilis:{" "}
                    {new Date(episode.releaseDate).toLocaleDateString("id-ID")}
                  </span>
                  <span>Durasi: {Math.floor(episode.duration / 60)} menit</span>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="bg-slate-800 border-slate-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="mr-2 w-5 h-5" />
                  Komentar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">A</span>
                      </div>
                      <span className="text-white font-medium">Anonymous</span>
                      <span className="text-gray-400 text-sm">
                        2 jam yang lalu
                      </span>
                    </div>
                    <p className="text-gray-300">
                      Episode keren banget! Animasinya bagus sekali.
                    </p>
                  </div>

                  <div className="bg-slate-700 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">U</span>
                      </div>
                      <span className="text-white font-medium">User123</span>
                      <span className="text-gray-400 text-sm">
                        5 jam yang lalu
                      </span>
                    </div>
                    <p className="text-gray-300">
                      Gak sabar nunggu episode selanjutnya!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Episode List */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <List className="mr-2 w-5 h-5" />
                  Daftar Episode
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {relatedEpisodes.map((ep) => (
                    <Link
                      key={ep.episodeNumber}
                      href={`/anime/${anime.slug}/${ep.episodeNumber}`}
                    >
                      <div
                        className={`p-4 border-b border-slate-700 hover:bg-slate-700 transition-colors ${
                          ep.episodeNumber === episodeNumber
                            ? "bg-blue-900/50"
                            : ""
                        }`}
                      >
                        <div className="flex space-x-3">
                          <img
                            src={ep.thumbnail}
                            alt={ep.title}
                            className="w-16 h-10 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                              Ep {ep.episodeNumber}: {ep.title}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {Math.floor(ep.duration / 60)} min
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Back to Anime Detail */}
            <div className="mt-6">
              <Link href={`/anime/${anime.slug}`}>
                <Button
                  variant="outline"
                  className="w-full bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Kembali ke Detail Anime
                </Button>
              </Link>
            </div>
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
