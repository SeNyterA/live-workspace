/*
  Warnings:

  - You are about to drop the column `shortcodes` on the `reactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `reactions` DROP COLUMN `shortcodes`,
    ADD COLUMN `native` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `shortcode` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `unified` VARCHAR(191) NOT NULL DEFAULT '';
