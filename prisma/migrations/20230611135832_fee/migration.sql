/*
  Warnings:

  - You are about to alter the column `fee` on the `subject` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `subject` MODIFY `fee` INTEGER NOT NULL;
