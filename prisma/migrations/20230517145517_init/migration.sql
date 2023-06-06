-- CreateTable
CREATE TABLE `TuitionFee` (
    `idTuitionFee` VARCHAR(191) NOT NULL,
    `idStudent` VARCHAR(191) NOT NULL,
    `idSubject` VARCHAR(191) NOT NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `date` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idTuitionFee`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MonthlyReport` (
    `idMonthlyReport` VARCHAR(191) NOT NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `totalStudents` INTEGER NOT NULL,
    `totalTeachers` INTEGER NOT NULL,
    `totalTuitionFees` INTEGER NOT NULL,

    PRIMARY KEY (`idMonthlyReport`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TuitionFee` ADD CONSTRAINT `TuitionFee_idStudent_fkey` FOREIGN KEY (`idStudent`) REFERENCES `Student`(`idStudent`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TuitionFee` ADD CONSTRAINT `TuitionFee_idSubject_fkey` FOREIGN KEY (`idSubject`) REFERENCES `Subject`(`idSubject`) ON DELETE RESTRICT ON UPDATE CASCADE;
