-- CreateTable
CREATE TABLE `Chat` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `unitName` VARCHAR(191) NOT NULL,
    `chapterNumber` INTEGER NOT NULL,
    `topics` VARCHAR(1000) NOT NULL,
    `response` VARCHAR(10000) NOT NULL,

    UNIQUE INDEX `Chat_Id_key`(`Id`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
