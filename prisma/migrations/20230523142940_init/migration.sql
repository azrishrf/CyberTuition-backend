/*
  Warnings:

  - You are about to drop the column `status` on the `student` table. All the data in the column will be lost.
  - Added the required column `isRegistered` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusPayment` to the `TuitionFee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student` DROP COLUMN `status`,
    ADD COLUMN `isRegistered` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `tuitionfee` ADD COLUMN `statusPayment` BOOLEAN NOT NULL;
