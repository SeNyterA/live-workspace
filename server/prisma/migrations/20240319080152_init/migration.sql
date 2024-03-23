-- AlterTable
ALTER TABLE `cardAttachments` ADD COLUMN `isAvailable` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `messageAttachments` ADD COLUMN `isAvailable` BOOLEAN NOT NULL DEFAULT true;
