-- AlterTable
ALTER TABLE `messages` ADD COLUMN `cardId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `cards`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
