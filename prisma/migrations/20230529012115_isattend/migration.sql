/*
  Warnings:

  - You are about to drop the column `status` on the `student_attendance` table. All the data in the column will be lost.
  - Added the required column `isAttend` to the `Student_Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student_attendance` DROP COLUMN `status`,
    ADD COLUMN `isAttend` BOOLEAN NOT NULL;
