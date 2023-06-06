/*
  Warnings:

  - You are about to drop the `studentsubject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `studentsubject` DROP FOREIGN KEY `StudentSubject_idStudent_fkey`;

-- DropForeignKey
ALTER TABLE `studentsubject` DROP FOREIGN KEY `StudentSubject_idSubject_fkey`;

-- DropTable
DROP TABLE `studentsubject`;

-- CreateTable
CREATE TABLE `Student_Subject` (
    `idStudentSubject` VARCHAR(191) NOT NULL,
    `idSubject` VARCHAR(191) NOT NULL,
    `idStudent` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idStudentSubject`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Student_Subject` ADD CONSTRAINT `Student_Subject_idSubject_fkey` FOREIGN KEY (`idSubject`) REFERENCES `Subject`(`idSubject`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student_Subject` ADD CONSTRAINT `Student_Subject_idStudent_fkey` FOREIGN KEY (`idStudent`) REFERENCES `Student`(`idStudent`) ON DELETE RESTRICT ON UPDATE CASCADE;
