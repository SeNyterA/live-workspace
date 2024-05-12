-- AlterTable
ALTER TABLE `workspaces` MODIFY `title` VARCHAR(191) NOT NULL DEFAULT 'Untitled',
    MODIFY `status` ENUM('Private', 'Public') NOT NULL DEFAULT 'Public';
