/*
  Warnings:

  - You are about to drop the column `content` on the `reactions` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `reactions` table. All the data in the column will be lost.
  - Added the required column `shortcodes` to the `reactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reactions` DROP COLUMN `content`,
    DROP COLUMN `type`,
    ADD COLUMN `shortcodes` VARCHAR(191) NOT NULL;
