-- CreateTable
CREATE TABLE `Clerk` (
    `idClerk` VARCHAR(191) NOT NULL,
    `idUser` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Clerk_idUser_key`(`idUser`),
    PRIMARY KEY (`idClerk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Clerk` ADD CONSTRAINT `Clerk_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`idUser`) ON DELETE RESTRICT ON UPDATE CASCADE;
