/*
  Warnings:

  - You are about to drop the `Card` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CardAttachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Mention` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MessageAttachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Property` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PropertyOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Workspace` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Card` DROP FOREIGN KEY `Card_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `Card` DROP FOREIGN KEY `Card_modifiedById_fkey`;

-- DropForeignKey
ALTER TABLE `Card` DROP FOREIGN KEY `Card_thumbnailId_fkey`;

-- DropForeignKey
ALTER TABLE `Card` DROP FOREIGN KEY `Card_workspaceId_fkey`;

-- DropForeignKey
ALTER TABLE `CardAttachment` DROP FOREIGN KEY `CardAttachment_cardId_fkey`;

-- DropForeignKey
ALTER TABLE `CardAttachment` DROP FOREIGN KEY `CardAttachment_fileId_fkey`;

-- DropForeignKey
ALTER TABLE `File` DROP FOREIGN KEY `File_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `File` DROP FOREIGN KEY `File_modifiedById_fkey`;

-- DropForeignKey
ALTER TABLE `Member` DROP FOREIGN KEY `Member_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `Member` DROP FOREIGN KEY `Member_modifiedById_fkey`;

-- DropForeignKey
ALTER TABLE `Member` DROP FOREIGN KEY `Member_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Member` DROP FOREIGN KEY `Member_workspaceId_fkey`;

-- DropForeignKey
ALTER TABLE `Mention` DROP FOREIGN KEY `Mention_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `Mention` DROP FOREIGN KEY `Mention_messageId_fkey`;

-- DropForeignKey
ALTER TABLE `Mention` DROP FOREIGN KEY `Mention_modifiedById_fkey`;

-- DropForeignKey
ALTER TABLE `Mention` DROP FOREIGN KEY `Mention_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_modifiedById_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_replyToId_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_threadToId_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_workspaceId_fkey`;

-- DropForeignKey
ALTER TABLE `MessageAttachment` DROP FOREIGN KEY `MessageAttachment_fileId_fkey`;

-- DropForeignKey
ALTER TABLE `MessageAttachment` DROP FOREIGN KEY `MessageAttachment_messageId_fkey`;

-- DropForeignKey
ALTER TABLE `Property` DROP FOREIGN KEY `Property_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `Property` DROP FOREIGN KEY `Property_modifiedById_fkey`;

-- DropForeignKey
ALTER TABLE `Property` DROP FOREIGN KEY `Property_workspaceId_fkey`;

-- DropForeignKey
ALTER TABLE `PropertyOption` DROP FOREIGN KEY `PropertyOption_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `PropertyOption` DROP FOREIGN KEY `PropertyOption_modifiedById_fkey`;

-- DropForeignKey
ALTER TABLE `PropertyOption` DROP FOREIGN KEY `PropertyOption_propertyId_fkey`;

-- DropForeignKey
ALTER TABLE `Reaction` DROP FOREIGN KEY `Reaction_messageId_fkey`;

-- DropForeignKey
ALTER TABLE `Reaction` DROP FOREIGN KEY `Reaction_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Workspace` DROP FOREIGN KEY `Workspace_avatarId_fkey`;

-- DropForeignKey
ALTER TABLE `Workspace` DROP FOREIGN KEY `Workspace_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `Workspace` DROP FOREIGN KEY `Workspace_modifiedById_fkey`;

-- DropForeignKey
ALTER TABLE `Workspace` DROP FOREIGN KEY `Workspace_thumbnailId_fkey`;

-- DropForeignKey
ALTER TABLE `Workspace` DROP FOREIGN KEY `Workspace_workspaceParentId_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_avatarId_fkey`;

-- DropTable
DROP TABLE `Card`;

-- DropTable
DROP TABLE `CardAttachment`;

-- DropTable
DROP TABLE `File`;

-- DropTable
DROP TABLE `Member`;

-- DropTable
DROP TABLE `Mention`;

-- DropTable
DROP TABLE `Message`;

-- DropTable
DROP TABLE `MessageAttachment`;

-- DropTable
DROP TABLE `Property`;

-- DropTable
DROP TABLE `PropertyOption`;

-- DropTable
DROP TABLE `Reaction`;

-- DropTable
DROP TABLE `Workspace`;

-- CreateTable
CREATE TABLE `files` (
    `id` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `size` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isAvailable` BOOLEAN NOT NULL DEFAULT true,
    `sourceType` ENUM('AWS', 'Link') NOT NULL,
    `createdById` VARCHAR(191) NULL,
    `modifiedById` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workspaces` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isAvailable` BOOLEAN NOT NULL DEFAULT true,
    `type` ENUM('Channel', 'Board', 'Group', 'Direct', 'Team') NOT NULL,
    `status` ENUM('Private', 'Public') NOT NULL,
    `createdById` VARCHAR(191) NULL,
    `modifiedById` VARCHAR(191) NULL,
    `avatarId` VARCHAR(191) NULL,
    `thumbnailId` VARCHAR(191) NULL,
    `workspaceParentId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `members` (
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `role` ENUM('Admin', 'Member') NOT NULL,
    `status` ENUM('Invited', 'Declined', 'Active', 'Leaved', 'Kicked') NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `workspaceId` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NULL,
    `modifiedById` VARCHAR(191) NULL,

    PRIMARY KEY (`userId`, `workspaceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isAvailable` BOOLEAN NOT NULL DEFAULT true,
    `type` ENUM('Normal', 'System') NOT NULL,
    `content` JSON NULL,
    `isPinned` BOOLEAN NULL,
    `createdById` VARCHAR(191) NULL,
    `modifiedById` VARCHAR(191) NULL,
    `workspaceId` VARCHAR(191) NOT NULL,
    `replyToId` VARCHAR(191) NULL,
    `threadToId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cards` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isAvailable` BOOLEAN NOT NULL DEFAULT true,
    `detail` JSON NULL,
    `properties` JSON NULL,
    `thumbnailId` VARCHAR(191) NULL,
    `createdById` VARCHAR(191) NULL,
    `modifiedById` VARCHAR(191) NULL,
    `workspaceId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `properties` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isAvailable` BOOLEAN NOT NULL DEFAULT true,
    `detail` JSON NULL,
    `order` DOUBLE NULL,
    `type` ENUM('Date', 'Number', 'String', 'People', 'MultiPeople', 'Select', 'MultiSelect', 'Link', 'Email', 'Assignees', 'DueDate') NOT NULL,
    `workspaceId` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NULL,
    `modifiedById` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `propertyOptions` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isAvailable` BOOLEAN NOT NULL DEFAULT true,
    `value` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NULL,
    `order` DOUBLE NULL,
    `propertyId` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NULL,
    `modifiedById` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reactions` (
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isAvailable` BOOLEAN NOT NULL DEFAULT true,
    `type` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `messageId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`userId`, `messageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mentions` (
    `userId` VARCHAR(191) NOT NULL,
    `messageId` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NULL,
    `modifiedById` VARCHAR(191) NULL,

    PRIMARY KEY (`userId`, `messageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messageAttachments` (
    `messageId` VARCHAR(191) NOT NULL,
    `fileId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`messageId`, `fileId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cardAttachments` (
    `cardId` VARCHAR(191) NOT NULL,
    `fileId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`cardId`, `fileId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_avatarId_fkey` FOREIGN KEY (`avatarId`) REFERENCES `files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_modifiedById_fkey` FOREIGN KEY (`modifiedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspaces` ADD CONSTRAINT `workspaces_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspaces` ADD CONSTRAINT `workspaces_modifiedById_fkey` FOREIGN KEY (`modifiedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspaces` ADD CONSTRAINT `workspaces_avatarId_fkey` FOREIGN KEY (`avatarId`) REFERENCES `files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspaces` ADD CONSTRAINT `workspaces_thumbnailId_fkey` FOREIGN KEY (`thumbnailId`) REFERENCES `files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspaces` ADD CONSTRAINT `workspaces_workspaceParentId_fkey` FOREIGN KEY (`workspaceParentId`) REFERENCES `workspaces`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_modifiedById_fkey` FOREIGN KEY (`modifiedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_modifiedById_fkey` FOREIGN KEY (`modifiedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_replyToId_fkey` FOREIGN KEY (`replyToId`) REFERENCES `messages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_threadToId_fkey` FOREIGN KEY (`threadToId`) REFERENCES `messages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cards` ADD CONSTRAINT `cards_thumbnailId_fkey` FOREIGN KEY (`thumbnailId`) REFERENCES `files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cards` ADD CONSTRAINT `cards_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cards` ADD CONSTRAINT `cards_modifiedById_fkey` FOREIGN KEY (`modifiedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cards` ADD CONSTRAINT `cards_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `properties` ADD CONSTRAINT `properties_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `properties` ADD CONSTRAINT `properties_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `properties` ADD CONSTRAINT `properties_modifiedById_fkey` FOREIGN KEY (`modifiedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propertyOptions` ADD CONSTRAINT `propertyOptions_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propertyOptions` ADD CONSTRAINT `propertyOptions_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propertyOptions` ADD CONSTRAINT `propertyOptions_modifiedById_fkey` FOREIGN KEY (`modifiedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reactions` ADD CONSTRAINT `reactions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reactions` ADD CONSTRAINT `reactions_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `messages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mentions` ADD CONSTRAINT `mentions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mentions` ADD CONSTRAINT `mentions_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `messages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mentions` ADD CONSTRAINT `mentions_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mentions` ADD CONSTRAINT `mentions_modifiedById_fkey` FOREIGN KEY (`modifiedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messageAttachments` ADD CONSTRAINT `messageAttachments_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `messages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messageAttachments` ADD CONSTRAINT `messageAttachments_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `files`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cardAttachments` ADD CONSTRAINT `cardAttachments_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `cards`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cardAttachments` ADD CONSTRAINT `cardAttachments_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `files`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
