/*
  Warnings:

  - Added the required column `createdAt` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student` ADD COLUMN `createdAt` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `teacher` ADD COLUMN `createdAt` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `tuitionfee` MODIFY `createdAt` VARCHAR(191) NOT NULL;
