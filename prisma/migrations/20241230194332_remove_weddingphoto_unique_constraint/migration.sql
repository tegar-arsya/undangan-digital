/*
  Warnings:

  - Added the required column `name` to the `WeddingPhoto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `wedding` MODIFY `date` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `weddingphoto` ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Background` (
    `id` VARCHAR(191) NOT NULL,
    `weddingId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `gambar` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Background_weddingId_key`(`weddingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Background` ADD CONSTRAINT `Background_weddingId_fkey` FOREIGN KEY (`weddingId`) REFERENCES `Wedding`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
