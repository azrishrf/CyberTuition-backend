-- CreateTable
CREATE TABLE `Attendance` (
    `idAttendance` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `isValid` BOOLEAN NOT NULL,
    `idSubject` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idAttendance`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student_Attendance` (
    `idStudentAttendance` VARCHAR(191) NOT NULL,
    `idAttendance` VARCHAR(191) NOT NULL,
    `idStudent` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idStudentAttendance`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_idSubject_fkey` FOREIGN KEY (`idSubject`) REFERENCES `Subject`(`idSubject`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student_Attendance` ADD CONSTRAINT `Student_Attendance_idAttendance_fkey` FOREIGN KEY (`idAttendance`) REFERENCES `Attendance`(`idAttendance`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student_Attendance` ADD CONSTRAINT `Student_Attendance_idStudent_fkey` FOREIGN KEY (`idStudent`) REFERENCES `Student`(`idStudent`) ON DELETE RESTRICT ON UPDATE CASCADE;
