-- CreateTable
CREATE TABLE `Company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `logo` VARCHAR(191) NULL,
    `noOfUsers` INTEGER NULL,
    `subscriptionPlanId` INTEGER NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `Company_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cms_Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` VARCHAR(191) NULL,
    `username` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `passwordToken` VARCHAR(191) NULL,
    `isCompanyAdmin` BOOLEAN NOT NULL DEFAULT false,
    `passwordTokenExpire` INTEGER NULL,
    `encryptedPassword` VARCHAR(191) NULL,
    `keyHex` VARCHAR(191) NULL,
    `ivHex` VARCHAR(191) NULL,
    `companyId` INTEGER NOT NULL,
    `roleId` INTEGER NULL,
    `clinicId` INTEGER NULL,
    `providerId` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `cms_Users_passwordToken_key`(`passwordToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleName` VARCHAR(191) NOT NULL,
    `companyId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Module` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `tableName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `Module_name_key`(`name`),
    UNIQUE INDEX `Module_tableName_key`(`tableName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoleModulePermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleId` INTEGER NOT NULL,
    `moduleId` INTEGER NOT NULL,
    `list` BOOLEAN NOT NULL DEFAULT false,
    `write` BOOLEAN NOT NULL DEFAULT false,
    `delete` BOOLEAN NOT NULL DEFAULT false,
    `update` BOOLEAN NOT NULL DEFAULT false,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Manager` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `joiningDate` DATETIME(3) NULL,
    `companyId` INTEGER NOT NULL,
    `cnic` VARCHAR(191) NULL,
    `isActive` BOOLEAN NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `Manager_employeeId_key`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ManagerAssignment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clinicId` VARCHAR(191) NOT NULL,
    `managerId` VARCHAR(191) NOT NULL,
    `companyId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Clinic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clinicId` INTEGER NOT NULL,
    `companyId` INTEGER NOT NULL,
    `Address` VARCHAR(191) NULL,
    `City` VARCHAR(191) NULL,
    `State` VARCHAR(191) NULL,
    `ZipCode` INTEGER NULL,
    `Country` VARCHAR(191) NULL,
    `Phone` VARCHAR(191) NULL,
    `Cell` VARCHAR(191) NULL,
    `faxNo` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `url` VARCHAR(191) NULL,
    `contactname` VARCHAR(191) NULL,
    `contactcell` VARCHAR(191) NULL,
    `contactaddr` VARCHAR(191) NULL,
    `contactemail` VARCHAR(191) NULL,
    `contactpager` VARCHAR(191) NULL,
    `cms_UsersId` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `Clinic_clinicId_key`(`clinicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Provider` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prefix` VARCHAR(191) NULL,
    `firstname` VARCHAR(191) NULL,
    `middlename` VARCHAR(191) NULL,
    `lastname` VARCHAR(191) NULL,
    `speciality` VARCHAR(191) NULL,
    `secretary` VARCHAR(191) NULL,
    `isFax` BOOLEAN NULL,
    `AddSign` BOOLEAN NULL,
    `cpl` INTEGER NULL,
    `rpl` INTEGER NULL,
    `contactname` VARCHAR(191) NULL,
    `contactphone` VARCHAR(191) NULL,
    `contactcell` VARCHAR(191) NULL,
    `contactaddress` VARCHAR(191) NULL,
    `contactemail` VARCHAR(191) NULL,
    `contactpager` VARCHAR(191) NULL,
    `cms_UsersId` INTEGER NULL,
    `companyId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fileName` VARCHAR(191) NULL,
    `fileUrl` VARCHAR(191) NULL,
    `fileDuration` DATETIME(3) NOT NULL,
    `cms_UsersId` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FileAssignment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clinicId` VARCHAR(191) NOT NULL,
    `companyId` INTEGER NOT NULL,
    `cms_UsersId` INTEGER NULL,
    `fileId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FieldPermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fieldName` VARCHAR(191) NOT NULL,
    `roleId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `salary` INTEGER NOT NULL,
    `companyId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ManagerToManagerAssignment` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ManagerToManagerAssignment_AB_unique`(`A`, `B`),
    INDEX `_ManagerToManagerAssignment_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ClinicToManagerAssignment` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ClinicToManagerAssignment_AB_unique`(`A`, `B`),
    INDEX `_ClinicToManagerAssignment_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ClinicToFileAssignment` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ClinicToFileAssignment_AB_unique`(`A`, `B`),
    INDEX `_ClinicToFileAssignment_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cms_Users` ADD CONSTRAINT `cms_Users_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `cms_Users` ADD CONSTRAINT `cms_Users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleModulePermission` ADD CONSTRAINT `RoleModulePermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleModulePermission` ADD CONSTRAINT `RoleModulePermission_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `Module`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Manager` ADD CONSTRAINT `Manager_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ManagerAssignment` ADD CONSTRAINT `ManagerAssignment_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clinic` ADD CONSTRAINT `Clinic_cms_UsersId_fkey` FOREIGN KEY (`cms_UsersId`) REFERENCES `cms_Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Clinic` ADD CONSTRAINT `Clinic_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Provider` ADD CONSTRAINT `Provider_cms_UsersId_fkey` FOREIGN KEY (`cms_UsersId`) REFERENCES `cms_Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Provider` ADD CONSTRAINT `Provider_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_cms_UsersId_fkey` FOREIGN KEY (`cms_UsersId`) REFERENCES `cms_Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `FileAssignment` ADD CONSTRAINT `FileAssignment_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `File`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FileAssignment` ADD CONSTRAINT `FileAssignment_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FileAssignment` ADD CONSTRAINT `FileAssignment_cms_UsersId_fkey` FOREIGN KEY (`cms_UsersId`) REFERENCES `cms_Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `FieldPermission` ADD CONSTRAINT `FieldPermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ManagerToManagerAssignment` ADD CONSTRAINT `_ManagerToManagerAssignment_A_fkey` FOREIGN KEY (`A`) REFERENCES `Manager`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ManagerToManagerAssignment` ADD CONSTRAINT `_ManagerToManagerAssignment_B_fkey` FOREIGN KEY (`B`) REFERENCES `ManagerAssignment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ClinicToManagerAssignment` ADD CONSTRAINT `_ClinicToManagerAssignment_A_fkey` FOREIGN KEY (`A`) REFERENCES `Clinic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ClinicToManagerAssignment` ADD CONSTRAINT `_ClinicToManagerAssignment_B_fkey` FOREIGN KEY (`B`) REFERENCES `ManagerAssignment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ClinicToFileAssignment` ADD CONSTRAINT `_ClinicToFileAssignment_A_fkey` FOREIGN KEY (`A`) REFERENCES `Clinic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ClinicToFileAssignment` ADD CONSTRAINT `_ClinicToFileAssignment_B_fkey` FOREIGN KEY (`B`) REFERENCES `FileAssignment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
