/*
  Warnings:

  - Made the column `order` on table `properties` required. This step will fail if there are existing NULL values in that column.
  - Made the column `order` on table `propertyOptions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `properties` ADD COLUMN `description` VARCHAR(191) NULL,
    MODIFY `order` DOUBLE NOT NULL DEFAULT 1.0,
    MODIFY `type` ENUM('Text', 'Person', 'MultiPerson', 'Select', 'MultiSelect', 'Date', 'RangeDate') NOT NULL DEFAULT 'Text';

-- AlterTable
ALTER TABLE `propertyOptions` MODIFY `order` DOUBLE NOT NULL DEFAULT 1.0;
