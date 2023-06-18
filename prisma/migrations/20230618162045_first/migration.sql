-- CreateTable
CREATE TABLE `User` (
    `idUser` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`idUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `idStudent` VARCHAR(191) NOT NULL,
    `nameStudent` VARCHAR(191) NOT NULL,
    `noICStudent` VARCHAR(191) NOT NULL,
    `dateOfBirth` VARCHAR(191) NOT NULL,
    `noPhoneStudent` VARCHAR(191) NOT NULL,
    `form` INTEGER NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `nameParent` VARCHAR(191) NOT NULL,
    `noICParent` VARCHAR(191) NOT NULL,
    `noPhoneParent` VARCHAR(191) NOT NULL,
    `isRegistered` BOOLEAN NOT NULL,
    `createdAt` VARCHAR(191) NOT NULL,
    `idUser` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Student_noICStudent_key`(`noICStudent`),
    UNIQUE INDEX `Student_idUser_key`(`idUser`),
    PRIMARY KEY (`idStudent`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subject` (
    `idSubject` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `day` VARCHAR(191) NOT NULL,
    `fee` INTEGER NOT NULL,
    `idTeacher` VARCHAR(191) NULL,

    PRIMARY KEY (`idSubject`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student_Subject` (
    `idStudentSubject` VARCHAR(191) NOT NULL,
    `idSubject` VARCHAR(191) NOT NULL,
    `idStudent` VARCHAR(191) NOT NULL,
    `createdAt` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idStudentSubject`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Teacher` (
    `idTeacher` VARCHAR(191) NOT NULL,
    `idUser` VARCHAR(191) NOT NULL,
    `nameTeacher` VARCHAR(191) NOT NULL,
    `noICTeacher` VARCHAR(191) NOT NULL,
    `ageTeacher` INTEGER NOT NULL,
    `noPhoneTeacher` VARCHAR(191) NOT NULL,
    `addressTeacher` VARCHAR(191) NOT NULL,
    `createdAt` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Teacher_idUser_key`(`idUser`),
    PRIMARY KEY (`idTeacher`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Clerk` (
    `idClerk` VARCHAR(191) NOT NULL,
    `idUser` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Clerk_idUser_key`(`idUser`),
    PRIMARY KEY (`idClerk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TuitionFee` (
    `idTuitionFee` VARCHAR(191) NOT NULL,
    `idStudent` VARCHAR(191) NOT NULL,
    `subjectsList` VARCHAR(191) NOT NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `statusPayment` VARCHAR(191) NOT NULL,
    `paymentMethod` VARCHAR(191) NULL,
    `createdAt` VARCHAR(191) NOT NULL,
    `cashTransactionDate` VARCHAR(191) NULL,

    PRIMARY KEY (`idTuitionFee`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentGateway` (
    `paymentGatewayId` VARCHAR(191) NOT NULL,
    `transactionBill` VARCHAR(191) NULL,
    `billCode` VARCHAR(191) NOT NULL,
    `transactionDate` VARCHAR(191) NULL,
    `idTuitionFee` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PaymentGateway_idTuitionFee_key`(`idTuitionFee`),
    PRIMARY KEY (`paymentGatewayId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReceiptBank` (
    `receiptBankId` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `createdAt` VARCHAR(191) NOT NULL,
    `idTuitionFee` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ReceiptBank_idTuitionFee_key`(`idTuitionFee`),
    PRIMARY KEY (`receiptBankId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attendance` (
    `idAttendance` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `idSubject` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idAttendance`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student_Attendance` (
    `idStudentAttendance` VARCHAR(191) NOT NULL,
    `idAttendance` VARCHAR(191) NOT NULL,
    `idStudent` VARCHAR(191) NOT NULL,
    `isAttend` BOOLEAN NOT NULL,
    `createdAt` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idStudentAttendance`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`idUser`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subject` ADD CONSTRAINT `Subject_idTeacher_fkey` FOREIGN KEY (`idTeacher`) REFERENCES `Teacher`(`idTeacher`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student_Subject` ADD CONSTRAINT `Student_Subject_idSubject_fkey` FOREIGN KEY (`idSubject`) REFERENCES `Subject`(`idSubject`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student_Subject` ADD CONSTRAINT `Student_Subject_idStudent_fkey` FOREIGN KEY (`idStudent`) REFERENCES `Student`(`idStudent`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `Teacher_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`idUser`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clerk` ADD CONSTRAINT `Clerk_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`idUser`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TuitionFee` ADD CONSTRAINT `TuitionFee_idStudent_fkey` FOREIGN KEY (`idStudent`) REFERENCES `Student`(`idStudent`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentGateway` ADD CONSTRAINT `PaymentGateway_idTuitionFee_fkey` FOREIGN KEY (`idTuitionFee`) REFERENCES `TuitionFee`(`idTuitionFee`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReceiptBank` ADD CONSTRAINT `ReceiptBank_idTuitionFee_fkey` FOREIGN KEY (`idTuitionFee`) REFERENCES `TuitionFee`(`idTuitionFee`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_idSubject_fkey` FOREIGN KEY (`idSubject`) REFERENCES `Subject`(`idSubject`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student_Attendance` ADD CONSTRAINT `Student_Attendance_idAttendance_fkey` FOREIGN KEY (`idAttendance`) REFERENCES `Attendance`(`idAttendance`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student_Attendance` ADD CONSTRAINT `Student_Attendance_idStudent_fkey` FOREIGN KEY (`idStudent`) REFERENCES `Student`(`idStudent`) ON DELETE RESTRICT ON UPDATE CASCADE;
