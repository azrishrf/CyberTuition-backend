/*
  Warnings:

  - Added the required column `fileName` to the `ReceiptBank` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `receiptbank` ADD COLUMN `fileName` VARCHAR(191) NOT NULL;
