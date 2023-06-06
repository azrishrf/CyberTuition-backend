/*
  Warnings:

  - You are about to drop the column `userId` on the `student` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_userId_fkey`;

-- AlterTable
ALTER TABLE `student` DROP COLUMN `userId`;
