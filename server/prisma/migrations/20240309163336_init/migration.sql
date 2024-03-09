/*
  Warnings:

  - A unique constraint covering the columns `[displayUrl]` on the table `workspaces` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `workspaces` ADD COLUMN `displayUrl` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `workspaces_displayUrl_key` ON `workspaces`(`displayUrl`);
