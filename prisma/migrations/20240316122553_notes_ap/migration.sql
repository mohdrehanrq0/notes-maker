/*
  Warnings:

  - You are about to drop the `chat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `chat`;

-- CreateTable
CREATE TABLE `unitData` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `unitName` VARCHAR(191) NOT NULL,
    `course` VARCHAR(191) NOT NULL,
    `semester` VARCHAR(191) NOT NULL,
    `year` VARCHAR(191) NOT NULL,
    `branch` VARCHAR(191) NOT NULL,
    `chapterNumber` INTEGER NOT NULL,
    `topics` VARCHAR(1000) NOT NULL,

    UNIQUE INDEX `unitData_Id_key`(`Id`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `responseModel` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `explanation` VARCHAR(10000) NOT NULL,
    `example` VARCHAR(1000) NOT NULL,
    `topic` VARCHAR(1000) NOT NULL,
    `youtube_search_query` VARCHAR(1000) NOT NULL,
    `youtubeIds` VARCHAR(191) NOT NULL,
    `unitDataId` INTEGER NULL,

    UNIQUE INDEX `responseModel_Id_key`(`Id`),
    INDEX `responseModel_unitDataId_idx`(`unitDataId`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `extraPointsModel` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` LONGTEXT NOT NULL,
    `responseModelId` INTEGER NULL,

    UNIQUE INDEX `extraPointsModel_Id_key`(`Id`),
    INDEX `extraPointsModel_responseModelId_idx`(`responseModelId`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `explanationExtraModel` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `topic` LONGTEXT NOT NULL,
    `description` VARCHAR(10000) NOT NULL,
    `extraPointsId` INTEGER NULL,

    UNIQUE INDEX `explanationExtraModel_Id_key`(`Id`),
    INDEX `explanationExtraModel_extraPointsId_idx`(`extraPointsId`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
