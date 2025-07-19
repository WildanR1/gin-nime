import { PrismaClient } from "../src/generated/prisma-client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clear existing data (in order due to foreign key constraints)
    await prisma.animeGenre.deleteMany();
    await prisma.episodeServer.deleteMany();
    await prisma.episode.deleteMany();
    await prisma.anime.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.animeType.deleteMany();
    await prisma.studio.deleteMany();
    await prisma.user.deleteMany();

    console.log("🗑️  Cleared existing data");

    // Hash password untuk admin
    const hashedPassword = await bcrypt.hash("admin123", 12);

    // Create admin user
    const admin = await prisma.user.upsert({
      where: { email: "admin@ginanime.com" },
      update: {},
      create: {
        email: "admin@ginanime.com",
        name: "Administrator",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("👤 Created admin user");

    // Create anime types
    const animeTypeNames = ["TV", "Movie", "ONA", "OVA", "Special"];
    const animeTypes = [];
    
    for (const typeName of animeTypeNames) {
      const animeType = await prisma.animeType.upsert({
        where: { name: typeName },
        update: {},
        create: { name: typeName },
      });
      animeTypes.push(animeType);
    }

    console.log("📺 Created anime types");

    // Create studios
    const studioNames = [
      "MAPPA", "Studio Pierrot", "Toei Animation", "Madhouse", "Bones",
      "A-1 Pictures", "WIT Studio", "Studio Deen", "Sunrise", "Ufotable"
    ];
    const studios = [];

    for (const studioName of studioNames) {
      const studio = await prisma.studio.upsert({
        where: { name: studioName },
        update: {},
        create: { name: studioName },
      });
      studios.push(studio);
    }

    console.log("🏢 Created studios");

    // Create genres
    const genreData = [
      "Action", "Adventure", "Comedy", "Drama", "Fantasy",
      "Romance", "Sci-Fi", "Thriller", "Horror", "Mystery",
      "Supernatural", "School", "Shounen", "Shoujo", "Seinen",
      "Josei", "Slice of Life", "Sports", "Historical", "Military"
    ];
    const genres = [];

    for (const genreName of genreData) {
      const slug = generateSlug(genreName);
      const genre = await prisma.genre.upsert({
        where: { name: genreName },
        update: {},
        create: {
          name: genreName,
          slug: slug,
        },
      });
      genres.push(genre);
    }

    console.log("🎭 Created genres");

    // Create sample animes
    const jujutsuKaisen = await prisma.anime.upsert({
      where: { slug: "jujutsu-kaisen" },
      update: {},
      create: {
        title: "Jujutsu Kaisen",
        slug: "jujutsu-kaisen",
        synopsis: "Yuji Itadori adalah siswa SMA yang memiliki kemampuan fisik luar biasa, tapi ia lebih suka bergabung dengan Klub Penelitian Fenomena Paranormal. Suatu hari, klub tersebut berhasil menemukan salah satu jari milik Ryomen Sukuna, seorang Kutukan tingkat khusus.",
        coverImage: "/api/placeholder/400/600",
        releaseYear: 2020,
        status: "ONGOING",
        rating: 8.9,
        totalEpisodes: 24,
        duration: 24,
        animeTypeId: animeTypes[0].id, // TV
        studioId: studios[0].id, // MAPPA
      },
    });

    const attackOnTitan = await prisma.anime.upsert({
      where: { slug: "attack-on-titan" },
      update: {},
      create: {
        title: "Attack on Titan",
        slug: "attack-on-titan",
        synopsis: "Ratusan tahun yang lalu, umat manusia hampir punah karena serangan Titan. Titan adalah makhluk humanoid raksasa yang memangsa manusia tanpa alasan yang jelas.",
        coverImage: "/api/placeholder/400/600",
        releaseYear: 2013,
        status: "COMPLETED",
        rating: 9.2,
        totalEpisodes: 87,
        duration: 24,
        animeTypeId: animeTypes[0].id, // TV
        studioId: studios[6].id, // WIT Studio
      },
    });

    console.log("📺 Created sample animes");

    // Add genres to animes (clear first, then add)
    await prisma.animeGenre.deleteMany({
      where: { animeId: { in: [jujutsuKaisen.id, attackOnTitan.id] } }
    });

    // Jujutsu Kaisen genres: Action, Supernatural, School, Shounen
    const actionGenre = genres.find(g => g.name === "Action");
    const supernaturalGenre = genres.find(g => g.name === "Supernatural");
    const schoolGenre = genres.find(g => g.name === "School");
    const shounenGenre = genres.find(g => g.name === "Shounen");

    if (actionGenre && supernaturalGenre && schoolGenre && shounenGenre) {
      await Promise.all([
        prisma.animeGenre.create({
          data: { animeId: jujutsuKaisen.id, genreId: actionGenre.id },
        }),
        prisma.animeGenre.create({
          data: { animeId: jujutsuKaisen.id, genreId: supernaturalGenre.id },
        }),
        prisma.animeGenre.create({
          data: { animeId: jujutsuKaisen.id, genreId: schoolGenre.id },
        }),
        prisma.animeGenre.create({
          data: { animeId: jujutsuKaisen.id, genreId: shounenGenre.id },
        }),
      ]);
    }

    // Attack on Titan genres: Action, Drama, Fantasy
    const dramaGenre = genres.find(g => g.name === "Drama");
    const fantasyGenre = genres.find(g => g.name === "Fantasy");

    if (actionGenre && dramaGenre && fantasyGenre) {
      await Promise.all([
        prisma.animeGenre.create({
          data: { animeId: attackOnTitan.id, genreId: actionGenre.id },
        }),
        prisma.animeGenre.create({
          data: { animeId: attackOnTitan.id, genreId: dramaGenre.id },
        }),
        prisma.animeGenre.create({
          data: { animeId: attackOnTitan.id, genreId: fantasyGenre.id },
        }),
      ]);
    }

    console.log("🏷️  Added genres to animes");

    // Create sample episodes for Jujutsu Kaisen
    const episode1 = await prisma.episode.upsert({
      where: { 
        animeId_episodeNumber: { 
          animeId: jujutsuKaisen.id, 
          episodeNumber: 1 
        } 
      },
      update: {},
      create: {
        animeId: jujutsuKaisen.id,
        episodeNumber: 1,
        title: "Ryomen Sukuna",
        description: "Yuji Itadori adalah siswa SMA yang bergabung dengan Klub Penelitian Fenomena Paranormal untuk menghindari kegiatan atletik. Suatu hari, klub tersebut berhasil menemukan salah satu jari milik Ryomen Sukuna.",
        thumbnail: "/api/placeholder/300/200",
        duration: 1440, // 24 minutes in seconds
        releaseDate: new Date("2020-10-03"),
      },
    });

    const episode2 = await prisma.episode.upsert({
      where: { 
        animeId_episodeNumber: { 
          animeId: jujutsuKaisen.id, 
          episodeNumber: 2 
        } 
      },
      update: {},
      create: {
        animeId: jujutsuKaisen.id,
        episodeNumber: 2,
        title: "Untuk Diriku",
        description: "Yuji dibawa ke Tokyo Jujutsu High oleh Gojo untuk bertemu dengan rekannya yang lain.",
        thumbnail: "/api/placeholder/300/200",
        duration: 1440,
        releaseDate: new Date("2020-10-10"),
      },
    });

    // Clear existing episode servers and add new ones
    await prisma.episodeServer.deleteMany({
      where: { episodeId: { in: [episode1.id, episode2.id] } }
    });

    await Promise.all([
      // Episode 1 servers
      prisma.episodeServer.create({
        data: {
          episodeId: episode1.id,
          name: "HD-1",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          quality: "1080p",
        },
      }),
      prisma.episodeServer.create({
        data: {
          episodeId: episode1.id,
          name: "HD-2",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          quality: "720p",
        },
      }),

      // Episode 2 servers
      prisma.episodeServer.create({
        data: {
          episodeId: episode2.id,
          name: "HD-1",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          quality: "1080p",
        },
      }),
      prisma.episodeServer.create({
        data: {
          episodeId: episode2.id,
          name: "HD-2",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          quality: "720p",
        },
      }),
    ]);

    console.log("🎬 Created sample episodes with servers");

    console.log("✅ Database seeding completed successfully!");
    
    console.log("\n📋 Summary:");
    console.log(`👤 Users: 1 (admin)`);
    console.log(`📺 Anime Types: ${animeTypes.length}`);
    console.log(`🏢 Studios: ${studios.length}`);
    console.log(`🎭 Genres: ${genres.length}`);
    console.log(`📺 Animes: 2`);
    console.log(`🎬 Episodes: 2`);
    console.log(`🖥️  Servers: 4`);
    
    console.log("\n🔐 Admin Login:");
    console.log("Email: admin@ginanime.com");
    console.log("Password: admin123");

  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
