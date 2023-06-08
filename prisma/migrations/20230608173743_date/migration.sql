/*
  Warnings:

  - You are about to drop the column `createdAt` on the `paymentgateway` table. All the data in the column will be lost.
  - Added the required column `transactionDate` to the `PaymentGateway` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `paymentgateway` DROP COLUMN `createdAt`,
    ADD COLUMN `transactionDate` VARCHAR(191) NOT NULL;
