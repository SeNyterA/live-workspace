/*
  Warnings:

  - The values [Number,String,Link,Email,Assignees,DueDate] on the enum `properties_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `properties` MODIFY `type` ENUM('Text', 'People', 'MultiPeople', 'Select', 'MultiSelect', 'Date', 'RangeDate') NOT NULL;
