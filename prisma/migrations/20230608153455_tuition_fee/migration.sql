/*
  Warnings:

  - You are about to drop the column `isPaid` on the `tuitionfee` table. All the data in the column will be lost.
  - You are about to drop the column `transactionDate` on the `tuitionfee` table. All the data in the column will be lost.
  - Added the required column `statusPayment` to the `TuitionFee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tuitionfee` DROP COLUMN `isPaid`,
    DROP COLUMN `transactionDate`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `paymentMethod` VARCHAR(191) NULL,
    ADD COLUMN `statusPayment` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `PaymentGateway` (
    `paymentGatewayId` VARCHAR(191) NOT NULL,
    `transactionBill` VARCHAR(191) NOT NULL,
    `billCode` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idTuitionFee` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PaymentGateway_idTuitionFee_key`(`idTuitionFee`),
    PRIMARY KEY (`paymentGatewayId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReceiptBank` (
    `receiptBankId` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idTuitionFee` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ReceiptBank_idTuitionFee_key`(`idTuitionFee`),
    PRIMARY KEY (`receiptBankId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PaymentGateway` ADD CONSTRAINT `PaymentGateway_idTuitionFee_fkey` FOREIGN KEY (`idTuitionFee`) REFERENCES `TuitionFee`(`idTuitionFee`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReceiptBank` ADD CONSTRAINT `ReceiptBank_idTuitionFee_fkey` FOREIGN KEY (`idTuitionFee`) REFERENCES `TuitionFee`(`idTuitionFee`) ON DELETE RESTRICT ON UPDATE CASCADE;
