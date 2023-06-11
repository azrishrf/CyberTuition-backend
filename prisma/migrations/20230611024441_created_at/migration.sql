/*
  Warnings:

  - Added the required column `createdAt` to the `Student_Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `Student_Subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student_attendance` ADD COLUMN `createdAt` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `student_subject` ADD COLUMN `createdAt` VARCHAR(191) NOT NULL;
