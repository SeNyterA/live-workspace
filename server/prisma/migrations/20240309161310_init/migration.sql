/*
  Warnings:

  - The primary key for the `CardAttachment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `content` on the `CardAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `CardAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `CardAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `CardAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `CardAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CardAttachment` table. All the data in the column will be lost.
  - The primary key for the `Member` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `Member` table. All the data in the column will be lost.
  - The values [Owner] on the enum `Member_role` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Mention` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `content` on the `Mention` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Mention` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Mention` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `Mention` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Mention` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Mention` table. All the data in the column will be lost.
  - The primary key for the `MessageAttachment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `content` on the `MessageAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `MessageAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `MessageAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `MessageAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `MessageAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `MessageAttachment` table. All the data in the column will be lost.
  - The primary key for the `Reaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdById` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `modifiedById` on the `Reaction` table. All the data in the column will be lost.
  - Added the required column `title` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Reaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Reaction` DROP FOREIGN KEY `Reaction_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `Reaction` DROP FOREIGN KEY `Reaction_modifiedById_fkey`;

-- AlterTable
ALTER TABLE `CardAttachment` DROP PRIMARY KEY,
    DROP COLUMN `content`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `id`,
    DROP COLUMN `isAvailable`,
    DROP COLUMN `type`,
    DROP COLUMN `updatedAt`,
    ADD PRIMARY KEY (`cardId`, `fileId`);

-- AlterTable
ALTER TABLE `Member` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `isAvailable`,
    MODIFY `role` ENUM('Admin', 'Member') NOT NULL,
    ADD PRIMARY KEY (`userId`, `workspaceId`);

-- AlterTable
ALTER TABLE `Mention` DROP PRIMARY KEY,
    DROP COLUMN `content`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `id`,
    DROP COLUMN `isAvailable`,
    DROP COLUMN `type`,
    DROP COLUMN `updatedAt`,
    ADD PRIMARY KEY (`userId`, `messageId`);

-- AlterTable
ALTER TABLE `Message` ADD COLUMN `isPinned` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `MessageAttachment` DROP PRIMARY KEY,
    DROP COLUMN `content`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `id`,
    DROP COLUMN `isAvailable`,
    DROP COLUMN `type`,
    DROP COLUMN `updatedAt`,
    ADD PRIMARY KEY (`messageId`, `fileId`);

-- AlterTable
ALTER TABLE `Property` ADD COLUMN `order` DOUBLE NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Reaction` DROP PRIMARY KEY,
    DROP COLUMN `createdById`,
    DROP COLUMN `id`,
    DROP COLUMN `modifiedById`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`userId`, `messageId`);

-- AlterTable
ALTER TABLE `Workspace` ADD COLUMN `workspaceParentId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Workspace` ADD CONSTRAINT `Workspace_workspaceParentId_fkey` FOREIGN KEY (`workspaceParentId`) REFERENCES `Workspace`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reaction` ADD CONSTRAINT `Reaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
