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
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Play,
  Star,
  Calendar,
  Clock,
  Users,
  ArrowLeft,
} from "lucide-react";

interface AnimeDetailPageProps {
  params: {
    slug: string;
  };
}

export default function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  // Mock data - nanti akan diganti dengan query database berdasarkan slug
  const anime = {
    id: "1",
    title: "Jujutsu Kaisen",
    slug: "jujutsu-kaisen",
    synopsis:
      "Yuji Itadori adalah siswa SMA yang memiliki kemampuan fisik luar biasa, tapi ia lebih suka bergabung dengan Klub Penelitian Fenomena Paranormal. Suatu hari, klub tersebut berhasil menemukan salah satu jari milik Ryomen Sukuna, seorang Kutukan tingkat khusus. Untuk melindungi teman-temannya dari kutukan yang ditarik oleh jari tersebut, Yuji menelan jari Sukuna dan menjadi inangnya. Sejak saat itu, Yuji berbagi tubuhnya dengan Ryomen Sukuna. Dipandu oleh penyihir terkuat, Satoru Gojo, Yuji dimasukkan ke Tokyo Jujutsu High, sebuah organisasi yang mengusir kutukan... dan dengan begitu dimulailah kisah heroik dari seorang anak yang menjadi kutukan untuk mengusir kutukan, sebuah kehidupan yang ia tidak akan pernah bisa kembali lagi.",
    coverImage: "/api/placeholder/400/600",
    rating: 8.9,
    status: "ONGOING",
    totalEpisodes: 24,
    releaseYear: 2020,
    duration: 24, // minutes per episode
    studio: "MAPPA",
    genres: ["Action", "Supernatural", "School", "Shounen"],
  };

  const episodes = [
    {
      id: "1",
      episodeNumber: 1,
      title: "Ryomen Sukuna",
      description:
        "Yuji Itadori adalah siswa SMA yang bergabung dengan Klub Penelitian Fenomena Paranormal untuk menghindari kegiatan atletik.",
      duration: 1440, // seconds
      releaseDate: "2020-10-03",
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: "2",
      episodeNumber: 2,
      title: "Untuk Diriku",
      description:
        "Yuji dibawa ke Tokyo Jujutsu High oleh Gojo untuk bertemu dengan rekannya yang lain.",
      duration: 1440,
      releaseDate: "2020-10-10",
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: "3",
      episodeNumber: 3,
      title: "Gadis Baja",
      description:
        "Yuji mulai berlatih mengendalikan energi kutukan bersama dengan Nobara Kugisaki.",
      duration: 1440,
      releaseDate: "2020-10-17",
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: "4",
      episodeNumber: 4,
      title: "Kelahiran Kutukan",
      description:
        "Tim Yuji menghadapi misi pertama mereka di kompleks sekolah yang dikuasai kutukan.",
      duration: 1440,
      releaseDate: "2020-10-24",
      thumbnail: "/api/placeholder/300/200",
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
        <div className="flex items-center space-x-2 text-gray-400 mb-8">
          <Link
            href="/anime"
            className="hover:text-white transition-colors flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali ke Daftar Anime
          </Link>
        </div>

        {/* Anime Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Cover Image */}
          <div className="lg:col-span-1">
            <div className="relative">
              <img
                src={anime.coverImage}
                alt={anime.title}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded flex items-center">
                <Star className="w-5 h-5 mr-1 text-yellow-400" />
                <span className="font-bold">{anime.rating}</span>
              </div>
            </div>
          </div>

          {/* Anime Details */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-white mb-4">
              {anime.title}
            </h1>

            {/* Status and Info */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Badge
                variant={anime.status === "ONGOING" ? "default" : "secondary"}
                className="text-sm"
              >
                {anime.status === "ONGOING" ? "Ongoing" : "Completed"}
              </Badge>
              <div className="flex items-center text-gray-400">
                <Calendar className="w-4 h-4 mr-1" />
                {anime.releaseYear}
              </div>
              <div className="flex items-center text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                {anime.duration} min/ep
              </div>
              <div className="flex items-center text-gray-400">
                <Users className="w-4 h-4 mr-1" />
                {anime.studio}
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {anime.genres.map((genre) => (
                <Link key={genre} href={`/genre/${genre.toLowerCase()}`}>
                  <Badge
                    variant="outline"
                    className="hover:bg-slate-700 cursor-pointer"
                  >
                    {genre}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Synopsis */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Sinopsis
              </h3>
              <p className="text-gray-300 leading-relaxed">{anime.synopsis}</p>
            </div>

            {/* Quick Action */}
            <div className="flex space-x-4">
              <Link href={`/anime/${anime.slug}/1`}>
                <Button size="lg" className="bg-sky-600 hover:bg-sky-700">
                  <Play className="mr-2 w-5 h-5" />
                  Mulai Menonton
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                <Star className="mr-2 w-5 h-5" />
                Tambah ke Favorit
              </Button>
            </div>
          </div>
        </div>

        {/* Episodes List */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Daftar Episode</h2>
            <span className="text-gray-400">{anime.totalEpisodes} Episode</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {episodes.map((episode) => (
              <Card
                key={episode.id}
                className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors"
              >
                <Link href={`/anime/${anime.slug}/${episode.episodeNumber}`}>
                  <div className="relative">
                    <img
                      src={episode.thumbnail}
                      alt={episode.title}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {Math.floor(episode.duration / 60)}:
                      {(episode.duration % 60).toString().padStart(2, "0")}
                    </div>
                  </div>
                </Link>

                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-base">
                    Episode {episode.episodeNumber}: {episode.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {episode.description}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                    <span>
                      {new Date(episode.releaseDate).toLocaleDateString(
                        "id-ID"
                      )}
                    </span>
                  </div>
                  <Link href={`/anime/${anime.slug}/${episode.episodeNumber}`}>
                    <Button className="w-full" size="sm">
                      <Play className="mr-2 w-4 h-4" />
                      Tonton
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
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
