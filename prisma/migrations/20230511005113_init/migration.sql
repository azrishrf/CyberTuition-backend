-- CreateTable
CREATE TABLE `Teacher` (
    `idTeacher` VARCHAR(191) NOT NULL,
    `idUser` VARCHAR(191) NOT NULL,
    `nameTeacher` VARCHAR(191) NOT NULL,
    `noICTeacher` VARCHAR(191) NOT NULL,
    `ageTeacher` INTEGER NOT NULL,
    `noPhoneTeacher` VARCHAR(191) NOT NULL,
    `addressTeacher` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Teacher_idUser_key`(`idUser`),
    PRIMARY KEY (`idTeacher`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Subject` ADD CONSTRAINT `Subject_idTeacher_fkey` FOREIGN KEY (`idTeacher`) REFERENCES `Teacher`(`idTeacher`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `Teacher_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`idUser`) ON DELETE RESTRICT ON UPDATE CASCADE;
