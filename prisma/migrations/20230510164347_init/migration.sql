/*
  Warnings:

  - The primary key for the `student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `noKP` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `noPhone` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `parentsName` on the `student` table. All the data in the column will be lost.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[noICStudent]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idUser]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - The required column `idStudent` was added to the `Student` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `idUser` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameParent` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameStudent` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noICParent` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noICStudent` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noPhoneParent` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noPhoneStudent` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Student` table without a default value. This is not possible if the table is not empty.
  - The required column `idUser` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX `Student_noKP_key` ON `student`;

-- AlterTable
ALTER TABLE `student` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `noKP`,
    DROP COLUMN `noPhone`,
    DROP COLUMN `parentsName`,
    ADD COLUMN `idStudent` VARCHAR(191) NOT NULL,
    ADD COLUMN `idUser` VARCHAR(191) NOT NULL,
    ADD COLUMN `nameParent` VARCHAR(191) NOT NULL,
    ADD COLUMN `nameStudent` VARCHAR(191) NOT NULL,
    ADD COLUMN `noICParent` VARCHAR(191) NOT NULL,
    ADD COLUMN `noICStudent` VARCHAR(191) NOT NULL,
    ADD COLUMN `noPhoneParent` VARCHAR(191) NOT NULL,
    ADD COLUMN `noPhoneStudent` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`idStudent`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `name`,
    ADD COLUMN `idUser` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`idUser`);

-- CreateTable
CREATE TABLE `Subject` (
    `idSubject` VARCHAR(191) NOT NULL,
    `idTeacher` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `day` VARCHAR(191) NOT NULL,
    `fee` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idSubject`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student_Subject` (
    `idStudentSubject` VARCHAR(191) NOT NULL,
    `idSubject` VARCHAR(191) NOT NULL,
    `idStudent` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idStudentSubject`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Student_noICStudent_key` ON `Student`(`noICStudent`);

-- CreateIndex
CREATE UNIQUE INDEX `Student_idUser_key` ON `Student`(`idUser`);

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`idUser`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student_Subject` ADD CONSTRAINT `Student_Subject_idSubject_fkey` FOREIGN KEY (`idSubject`) REFERENCES `Subject`(`idSubject`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student_Subject` ADD CONSTRAINT `Student_Subject_idStudent_fkey` FOREIGN KEY (`idStudent`) REFERENCES `Student`(`idStudent`) ON DELETE RESTRICT ON UPDATE CASCADE;
