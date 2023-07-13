-- CreateTable
CREATE TABLE `user` (
    `idUser` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`idUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student` (
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

    UNIQUE INDEX `student_noICStudent_key`(`noICStudent`),
    UNIQUE INDEX `student_idUser_key`(`idUser`),
    PRIMARY KEY (`idStudent`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subject` (
    `idSubject` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `day` VARCHAR(191) NOT NULL,
    `fee` INTEGER NOT NULL,
    `idTeacher` VARCHAR(191) NULL,

    PRIMARY KEY (`idSubject`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_subject` (
    `idStudentSubject` VARCHAR(191) NOT NULL,
    `idSubject` VARCHAR(191) NOT NULL,
    `idStudent` VARCHAR(191) NOT NULL,
    `createdAt` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idStudentSubject`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teacher` (
    `idTeacher` VARCHAR(191) NOT NULL,
    `idUser` VARCHAR(191) NOT NULL,
    `nameTeacher` VARCHAR(191) NOT NULL,
    `noICTeacher` VARCHAR(191) NOT NULL,
    `ageTeacher` INTEGER NOT NULL,
    `noPhoneTeacher` VARCHAR(191) NOT NULL,
    `addressTeacher` VARCHAR(191) NOT NULL,
    `createdAt` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `teacher_idUser_key`(`idUser`),
    PRIMARY KEY (`idTeacher`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clerk` (
    `idClerk` VARCHAR(191) NOT NULL,
    `idUser` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `clerk_idUser_key`(`idUser`),
    PRIMARY KEY (`idClerk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tuitionfee` (
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
CREATE TABLE `paymentgateway` (
    `paymentGatewayId` VARCHAR(191) NOT NULL,
    `transactionBill` VARCHAR(191) NULL,
    `billCode` VARCHAR(191) NOT NULL,
    `transactionDate` VARCHAR(191) NULL,
    `idTuitionFee` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `paymentgateway_idTuitionFee_key`(`idTuitionFee`),
    PRIMARY KEY (`paymentGatewayId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `receiptbank` (
    `receiptBankId` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `createdAt` VARCHAR(191) NOT NULL,
    `idTuitionFee` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `receiptbank_idTuitionFee_key`(`idTuitionFee`),
    PRIMARY KEY (`receiptBankId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendance` (
    `idAttendance` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `idSubject` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idAttendance`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_attendance` (
    `idStudentAttendance` VARCHAR(191) NOT NULL,
    `idAttendance` VARCHAR(191) NOT NULL,
    `idStudent` VARCHAR(191) NOT NULL,
    `isAttend` BOOLEAN NOT NULL,
    `createdAt` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idStudentAttendance`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `student_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `user`(`idUser`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subject` ADD CONSTRAINT `subject_idTeacher_fkey` FOREIGN KEY (`idTeacher`) REFERENCES `teacher`(`idTeacher`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_subject` ADD CONSTRAINT `student_subject_idSubject_fkey` FOREIGN KEY (`idSubject`) REFERENCES `subject`(`idSubject`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_subject` ADD CONSTRAINT `student_subject_idStudent_fkey` FOREIGN KEY (`idStudent`) REFERENCES `student`(`idStudent`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher` ADD CONSTRAINT `teacher_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `user`(`idUser`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clerk` ADD CONSTRAINT `clerk_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `user`(`idUser`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tuitionfee` ADD CONSTRAINT `tuitionfee_idStudent_fkey` FOREIGN KEY (`idStudent`) REFERENCES `student`(`idStudent`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paymentgateway` ADD CONSTRAINT `paymentgateway_idTuitionFee_fkey` FOREIGN KEY (`idTuitionFee`) REFERENCES `tuitionfee`(`idTuitionFee`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receiptbank` ADD CONSTRAINT `receiptbank_idTuitionFee_fkey` FOREIGN KEY (`idTuitionFee`) REFERENCES `tuitionfee`(`idTuitionFee`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_idSubject_fkey` FOREIGN KEY (`idSubject`) REFERENCES `subject`(`idSubject`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_attendance` ADD CONSTRAINT `student_attendance_idAttendance_fkey` FOREIGN KEY (`idAttendance`) REFERENCES `attendance`(`idAttendance`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_attendance` ADD CONSTRAINT `student_attendance_idStudent_fkey` FOREIGN KEY (`idStudent`) REFERENCES `student`(`idStudent`) ON DELETE RESTRICT ON UPDATE CASCADE;
