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
  try {
    // Hash password untuk admin
    const hashedPassword = await bcrypt.hash("admin123", 12);

    // Buat user admin
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

    console.log("Admin user created:", admin);

    // Buat beberapa genre default
    const genres = [
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
      "Shounen",
      "Slice of Life",
      "Sports",
      "Supernatural",
      "Thriller",
    ];

    for (const genreName of genres) {
      const slug = generateSlug(genreName);
      await prisma.genre.upsert({
        where: { name: genreName },
        update: {},
        create: {
          name: genreName,
          slug: slug,
        },
      });
    }

    console.log("Default genres created");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
