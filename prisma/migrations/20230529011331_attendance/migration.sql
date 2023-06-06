/*
  Warnings:

  - Added the required column `status` to the `Student_Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student_attendance` ADD COLUMN `status` VARCHAR(191) NOT NULL;
