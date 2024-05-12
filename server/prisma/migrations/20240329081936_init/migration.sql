/*
  Warnings:

  - The values [People,MultiPeople] on the enum `properties_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `properties` MODIFY `type` ENUM('Text', 'Person', 'MultiPerson', 'Select', 'MultiSelect', 'Date', 'RangeDate') NOT NULL;
