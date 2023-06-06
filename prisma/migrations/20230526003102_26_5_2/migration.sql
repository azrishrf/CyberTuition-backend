/*
  Warnings:

  - A unique constraint covering the columns `[idSubject]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Attendance_idSubject_key` ON `Attendance`(`idSubject`);
