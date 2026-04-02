-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('CANDIDATE', 'AGENT', 'COMPANY', 'ADMIN') NOT NULL DEFAULT 'CANDIDATE',
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION') NOT NULL DEFAULT 'PENDING_VERIFICATION',
    `emailVerifiedAt` DATETIME(3) NULL,
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_role_idx`(`role`),
    INDEX `users_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `candidates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userCode` VARCHAR(12) NOT NULL DEFAULT '',
    `userId` INTEGER NOT NULL,
    `firstName` VARCHAR(100) NOT NULL,
    `lastName` VARCHAR(100) NOT NULL,
    `firstNameKana` VARCHAR(100) NULL,
    `lastNameKana` VARCHAR(100) NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `gender` VARCHAR(20) NULL,
    `phone` VARCHAR(20) NULL,
    `avatarUrl` VARCHAR(500) NULL,
    `country` VARCHAR(100) NULL,
    `prefecture` VARCHAR(100) NULL,
    `city` VARCHAR(100) NULL,
    `address` TEXT NULL,
    `desiredJobTypes` TEXT NULL,
    `desiredLocations` TEXT NULL,
    `desiredSalaryMin` INTEGER NULL,
    `desiredSalaryMax` INTEGER NULL,
    `availableFrom` DATETIME(3) NULL,
    `isOpenToWork` BOOLEAN NOT NULL DEFAULT true,
    `japaneseLevel` ENUM('N1', 'N2', 'N3', 'N4', 'N5', 'BUSINESS', 'NATIVE', 'NONE') NOT NULL DEFAULT 'NONE',
    `englishLevel` VARCHAR(50) NULL,
    `otherLanguages` TEXT NULL,
    `nationality` VARCHAR(100) NULL,
    `visaStatus` ENUM('NOT_REQUIRED', 'SPONSORED', 'SELF_SPONSORED', 'ALREADY_HAVE') NOT NULL DEFAULT 'NOT_REQUIRED',
    `visaExpiry` DATETIME(3) NULL,
    `yearsOfExperience` INTEGER NULL,
    `currentSalary` INTEGER NULL,
    `selfIntroduction` TEXT NULL,
    `motivation` TEXT NULL,
    `approach` TEXT NULL,
    `strengths` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `candidates_userCode_key`(`userCode`),
    UNIQUE INDEX `candidates_userId_key`(`userId`),
    INDEX `candidates_userCode_idx`(`userCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resumes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `candidateId` INTEGER NOT NULL,
    `title` VARCHAR(200) NOT NULL DEFAULT 'My Resume',
    `isPublic` BOOLEAN NOT NULL DEFAULT false,
    `pdfUrl` VARCHAR(500) NULL,
    `uploadedPdfUrl` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `resumes_candidateId_key`(`candidateId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `educations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `resumeId` INTEGER NOT NULL,
    `schoolName` VARCHAR(200) NOT NULL,
    `faculty` VARCHAR(200) NULL,
    `degree` VARCHAR(100) NULL,
    `startDate` VARCHAR(20) NOT NULL,
    `endDate` VARCHAR(20) NULL,
    `isGraduated` BOOLEAN NOT NULL DEFAULT true,
    `description` TEXT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `experiences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `resumeId` INTEGER NOT NULL,
    `companyName` VARCHAR(200) NOT NULL,
    `position` VARCHAR(200) NOT NULL,
    `employeeCount` VARCHAR(50) NULL,
    `startDate` VARCHAR(20) NOT NULL,
    `endDate` VARCHAR(20) NULL,
    `isCurrent` BOOLEAN NOT NULL DEFAULT false,
    `description` TEXT NULL,
    `achievements` TEXT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `resumeId` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `level` VARCHAR(50) NULL,
    `yearsUsed` INTEGER NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `qualifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `resumeId` INTEGER NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `issuedBy` VARCHAR(200) NULL,
    `issuedDate` VARCHAR(20) NULL,
    `expiryDate` VARCHAR(20) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `companies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyCode` VARCHAR(12) NOT NULL DEFAULT '',
    `status` ENUM('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SUSPENDED') NOT NULL DEFAULT 'PENDING_APPROVAL',
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `nameKana` VARCHAR(200) NULL,
    `nameEn` VARCHAR(200) NULL,
    `logoUrl` VARCHAR(500) NULL,
    `websiteUrl` VARCHAR(500) NULL,
    `description` TEXT NULL,
    `industry` VARCHAR(100) NULL,
    `employeeCount` VARCHAR(50) NULL,
    `founded` INTEGER NULL,
    `country` VARCHAR(100) NULL,
    `prefecture` VARCHAR(100) NULL,
    `city` VARCHAR(100) NULL,
    `address` TEXT NULL,
    `registrationNote` TEXT NULL,
    `businessRegNumber` VARCHAR(100) NULL,
    `rejectionReason` TEXT NULL,
    `approvedAt` DATETIME(3) NULL,
    `approvedByAgentId` INTEGER NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `companies_companyCode_key`(`companyCode`),
    UNIQUE INDEX `companies_userId_key`(`userId`),
    INDEX `companies_companyCode_idx`(`companyCode`),
    INDEX `companies_status_idx`(`status`),
    INDEX `companies_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `agentCode` VARCHAR(12) NOT NULL DEFAULT '',
    `userId` INTEGER NOT NULL,
    `displayName` VARCHAR(200) NOT NULL,
    `bio` TEXT NULL,
    `avatarUrl` VARCHAR(500) NULL,
    `phone` VARCHAR(20) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `agents_agentCode_key`(`agentCode`),
    UNIQUE INDEX `agents_userId_key`(`userId`),
    INDEX `agents_agentCode_idx`(`agentCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agent_companies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `agentId` INTEGER NOT NULL,
    `companyId` INTEGER NOT NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `agent_companies_agentId_companyId_key`(`agentId`, `companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminCode` VARCHAR(20) NOT NULL DEFAULT '',
    `userId` INTEGER NOT NULL,
    `displayName` VARCHAR(200) NOT NULL,
    `isSuperAdmin` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admins_adminCode_key`(`adminCode`),
    UNIQUE INDEX `admins_userId_key`(`userId`),
    INDEX `admins_adminCode_idx`(`adminCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jobs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jobCode` VARCHAR(12) NOT NULL DEFAULT '',
    `companyId` INTEGER NOT NULL,
    `title` VARCHAR(300) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `requirements` TEXT NULL,
    `benefits` TEXT NULL,
    `jobType` ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE') NOT NULL DEFAULT 'FULL_TIME',
    `workLocation` ENUM('ONSITE', 'REMOTE', 'HYBRID') NOT NULL DEFAULT 'ONSITE',
    `status` ENUM('DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'PAUSED', 'CLOSED', 'REJECTED', 'DELETED') NOT NULL DEFAULT 'DRAFT',
    `country` VARCHAR(100) NULL,
    `prefecture` VARCHAR(100) NULL,
    `city` VARCHAR(100) NULL,
    `salaryType` ENUM('HOURLY', 'MONTHLY', 'ANNUAL') NOT NULL DEFAULT 'ANNUAL',
    `salaryMin` INTEGER NULL,
    `salaryMax` INTEGER NULL,
    `salaryCurrency` VARCHAR(10) NOT NULL DEFAULT 'JPY',
    `japaneseLevel` ENUM('N1', 'N2', 'N3', 'N4', 'N5', 'BUSINESS', 'NATIVE', 'NONE') NOT NULL DEFAULT 'NONE',
    `visaSponsorship` BOOLEAN NOT NULL DEFAULT false,
    `minExperience` INTEGER NULL,
    `skills` TEXT NULL,
    `viewCount` INTEGER NOT NULL DEFAULT 0,
    `applyCount` INTEGER NOT NULL DEFAULT 0,
    `createdByRole` VARCHAR(20) NOT NULL DEFAULT 'COMPANY',
    `createdById` INTEGER NOT NULL,
    `rejectionReason` TEXT NULL,
    `reviewedAt` DATETIME(3) NULL,
    `reviewedById` INTEGER NULL,
    `publishedAt` DATETIME(3) NULL,
    `closesAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `jobs_jobCode_key`(`jobCode`),
    INDEX `jobs_jobCode_idx`(`jobCode`),
    INDEX `jobs_status_idx`(`status`),
    INDEX `jobs_jobType_idx`(`jobType`),
    INDEX `jobs_workLocation_idx`(`workLocation`),
    INDEX `jobs_prefecture_idx`(`prefecture`),
    INDEX `jobs_japaneseLevel_idx`(`japaneseLevel`),
    FULLTEXT INDEX `jobs_title_description_idx`(`title`, `description`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `applications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `appCode` VARCHAR(14) NOT NULL DEFAULT '',
    `userId` INTEGER NOT NULL,
    `jobId` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'CASUAL_INTERVIEW', 'SCREENING', 'FIRST_INTERVIEW', 'SECOND_INTERVIEW', 'THIRD_INTERVIEW', 'FINAL_INTERVIEW', 'OFFER', 'ACCEPTED', 'REJECTED', 'WITHDRAWN') NOT NULL DEFAULT 'PENDING',
    `coverLetter` TEXT NULL,
    `resumeSnapshot` LONGTEXT NULL,
    `agentNote` TEXT NULL,
    `rejectionReason` TEXT NULL,
    `appliedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `applications_appCode_key`(`appCode`),
    INDEX `applications_appCode_idx`(`appCode`),
    INDEX `applications_status_idx`(`status`),
    INDEX `applications_userId_idx`(`userId`),
    INDEX `applications_jobId_idx`(`jobId`),
    UNIQUE INDEX `applications_userId_jobId_key`(`userId`, `jobId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `application_status_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `applicationId` INTEGER NOT NULL,
    `fromStatus` ENUM('PENDING', 'CASUAL_INTERVIEW', 'SCREENING', 'FIRST_INTERVIEW', 'SECOND_INTERVIEW', 'THIRD_INTERVIEW', 'FINAL_INTERVIEW', 'OFFER', 'ACCEPTED', 'REJECTED', 'WITHDRAWN') NULL,
    `toStatus` ENUM('PENDING', 'CASUAL_INTERVIEW', 'SCREENING', 'FIRST_INTERVIEW', 'SECOND_INTERVIEW', 'THIRD_INTERVIEW', 'FINAL_INTERVIEW', 'OFFER', 'ACCEPTED', 'REJECTED', 'WITHDRAWN') NOT NULL,
    `note` TEXT NULL,
    `changedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conversations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('APPLICATION_AGENT_CANDIDATE', 'APPLICATION_AGENT_COMPANY', 'APPLICATION_CANDIDATE_COMPANY', 'GENERAL_AGENT_CANDIDATE', 'GENERAL_AGENT_COMPANY', 'ADMIN_SUPPORT') NOT NULL,
    `applicationId` INTEGER NULL,
    `agentId` INTEGER NULL,
    `candidateId` INTEGER NULL,
    `companyId` INTEGER NULL,
    `agentEnabled` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `conversations_applicationId_key`(`applicationId`),
    INDEX `conversations_applicationId_idx`(`applicationId`),
    INDEX `conversations_agentId_idx`(`agentId`),
    INDEX `conversations_candidateId_idx`(`candidateId`),
    INDEX `conversations_companyId_idx`(`companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `conversationId` INTEGER NOT NULL,
    `senderId` INTEGER NOT NULL,
    `type` ENUM('TEXT', 'FILE', 'SYSTEM') NOT NULL DEFAULT 'TEXT',
    `content` TEXT NOT NULL,
    `fileUrl` VARCHAR(500) NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `readAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `messages_conversationId_idx`(`conversationId`),
    INDEX `messages_senderId_idx`(`senderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `type` ENUM('APPLICATION_SUBMITTED', 'APPLICATION_STATUS_CHANGED', 'NEW_MESSAGE', 'NEW_JOB_MATCH', 'INTERVIEW_SCHEDULED', 'OFFER_RECEIVED', 'COMPANY_REGISTRATION', 'COMPANY_APPROVED', 'COMPANY_REJECTED', 'SYSTEM') NOT NULL,
    `title` VARCHAR(300) NOT NULL,
    `body` TEXT NOT NULL,
    `data` TEXT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `readAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notifications_userId_isRead_idx`(`userId`, `isRead`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `token` VARCHAR(500) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `refresh_tokens_token_key`(`token`),
    INDEX `refresh_tokens_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `candidates` ADD CONSTRAINT `candidates_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resumes` ADD CONSTRAINT `resumes_candidateId_fkey` FOREIGN KEY (`candidateId`) REFERENCES `candidates`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `educations` ADD CONSTRAINT `educations_resumeId_fkey` FOREIGN KEY (`resumeId`) REFERENCES `resumes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiences` ADD CONSTRAINT `experiences_resumeId_fkey` FOREIGN KEY (`resumeId`) REFERENCES `resumes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skills` ADD CONSTRAINT `skills_resumeId_fkey` FOREIGN KEY (`resumeId`) REFERENCES `resumes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `qualifications` ADD CONSTRAINT `qualifications_resumeId_fkey` FOREIGN KEY (`resumeId`) REFERENCES `resumes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `companies` ADD CONSTRAINT `companies_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agents` ADD CONSTRAINT `agents_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agent_companies` ADD CONSTRAINT `agent_companies_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `agents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agent_companies` ADD CONSTRAINT `agent_companies_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admins` ADD CONSTRAINT `admins_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `applications` ADD CONSTRAINT `applications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `applications` ADD CONSTRAINT `applications_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `jobs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `application_status_history` ADD CONSTRAINT `application_status_history_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `applications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `applications`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
