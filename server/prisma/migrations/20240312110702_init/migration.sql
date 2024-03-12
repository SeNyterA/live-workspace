/*
  Warnings:

  - You are about to drop the column `label` on the `propertyOptions` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `propertyOptions` table. All the data in the column will be lost.
  - Added the required column `title` to the `propertyOptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `propertyOptions` DROP COLUMN `label`,
    DROP COLUMN `value`,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;
