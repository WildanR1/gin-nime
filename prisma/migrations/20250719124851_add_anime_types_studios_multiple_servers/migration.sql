/*
  Warnings:

  - You are about to drop the column `videoUrl` on the `episodes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `animes` ADD COLUMN `animeTypeId` VARCHAR(191) NULL,
    ADD COLUMN `duration` INTEGER NULL,
    ADD COLUMN `studioId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `episodes` DROP COLUMN `videoUrl`,
    ADD COLUMN `thumbnail` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `anime_types` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `anime_types_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `studios` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `studios_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `episode_servers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `videoUrl` VARCHAR(191) NOT NULL,
    `quality` VARCHAR(191) NOT NULL,
    `episodeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `animes` ADD CONSTRAINT `animes_animeTypeId_fkey` FOREIGN KEY (`animeTypeId`) REFERENCES `anime_types`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `animes` ADD CONSTRAINT `animes_studioId_fkey` FOREIGN KEY (`studioId`) REFERENCES `studios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `episode_servers` ADD CONSTRAINT `episode_servers_episodeId_fkey` FOREIGN KEY (`episodeId`) REFERENCES `episodes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
