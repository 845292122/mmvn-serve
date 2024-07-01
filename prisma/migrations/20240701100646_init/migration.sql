-- CreateTable
CREATE TABLE `Account` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `status` TINYINT NULL DEFAULT 1,
    `remark` VARCHAR(191) NULL,
    `contact` VARCHAR(191) NULL,
    `merchantName` VARCHAR(191) NULL,
    `isAdmin` TINYINT NULL DEFAULT 0,
    `vip` TINYINT NULL DEFAULT 0,
    `deleted` TINYINT NOT NULL DEFAULT 0,
    `createdAt` DATETIME NOT NULL DEFAULT NOW(),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT NOW() ON UPDATE NOW(),

    INDEX `Account_phone_merchantName_idx`(`phone`, `merchantName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
