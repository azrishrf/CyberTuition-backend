/*
  Warnings:

  - Added the required column `isPaid` to the `TuitionFee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tuitionfee` ADD COLUMN `isPaid` BOOLEAN NOT NULL;
