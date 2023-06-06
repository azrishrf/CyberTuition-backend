/*
  Warnings:

  - You are about to drop the column `isValid` on the `attendance` table. All the data in the column will be lost.
  - Added the required column `time` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendance` DROP COLUMN `isValid`,
    ADD COLUMN `time` VARCHAR(191) NOT NULL;
