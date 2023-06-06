/*
  Warnings:

  - Added the required column `subjectsList` to the `TuitionFee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tuitionfee` ADD COLUMN `subjectsList` VARCHAR(191) NOT NULL;
