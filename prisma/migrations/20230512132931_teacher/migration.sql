-- DropForeignKey
ALTER TABLE `subject` DROP FOREIGN KEY `Subject_idTeacher_fkey`;

-- AlterTable
ALTER TABLE `subject` MODIFY `idTeacher` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Subject` ADD CONSTRAINT `Subject_idTeacher_fkey` FOREIGN KEY (`idTeacher`) REFERENCES `Teacher`(`idTeacher`) ON DELETE SET NULL ON UPDATE CASCADE;
