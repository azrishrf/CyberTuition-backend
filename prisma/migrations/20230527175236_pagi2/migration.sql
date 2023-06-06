/*
  Warnings:

  - You are about to drop the column `date` on the `tuitionfee` table. All the data in the column will be lost.
  - You are about to drop the column `idSubject` on the `tuitionfee` table. All the data in the column will be lost.
  - You are about to drop the column `statusPayment` on the `tuitionfee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `tuitionfee` DROP FOREIGN KEY `TuitionFee_idSubject_fkey`;

-- AlterTable
ALTER TABLE `tuitionfee` DROP COLUMN `date`,
    DROP COLUMN `idSubject`,
    DROP COLUMN `statusPayment`;
