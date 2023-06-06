/*
  Warnings:

  - Made the column `dateOfBirth` on table `student` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `student` MODIFY `dateOfBirth` VARCHAR(191) NOT NULL;
