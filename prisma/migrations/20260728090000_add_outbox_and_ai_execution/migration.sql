-- CreateTable
CREATE TABLE `outbox_events` (
    `id` VARCHAR(36) NOT NULL,
    `aggregateType` VARCHAR(100) NOT NULL,
    `aggregateId` VARCHAR(64) NOT NULL,
    `eventType` VARCHAR(150) NOT NULL,
    `payload` JSON NOT NULL,
    `schemaVersion` INTEGER NOT NULL DEFAULT 1,
    `status` ENUM('PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `availableAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `occurredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `publishedAt` DATETIME(3) NULL,
    `lastError` TEXT NULL,
    `lockedAt` DATETIME(3) NULL,
    `lockedBy` VARCHAR(100) NULL,

    INDEX `outbox_events_status_availableAt_idx`(`status`, `availableAt`),
    INDEX `outbox_events_status_lockedAt_idx`(`status`, `lockedAt`),
    INDEX `outbox_events_aggregateType_aggregateId_idx`(`aggregateType`, `aggregateId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `processed_messages` (
    `consumerName` VARCHAR(100) NOT NULL,
    `messageId` VARCHAR(100) NOT NULL,
    `processedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`consumerName`, `messageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_executions` (
    `id` VARCHAR(36) NOT NULL,
    `purpose` ENUM('RESUME_PARSING', 'JOB_PARSING', 'MATCHING', 'RECOMMENDATION', 'ASSISTANT') NOT NULL,
    `status` ENUM('REQUESTED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'BLOCKED') NOT NULL DEFAULT 'REQUESTED',
    `idempotencyKey` VARCHAR(100) NOT NULL,
    `actorUserId` INTEGER NULL,
    `provider` VARCHAR(100) NOT NULL,
    `model` VARCHAR(150) NOT NULL,
    `promptVersion` VARCHAR(100) NOT NULL,
    `inputReference` VARCHAR(200) NULL,
    `inputTokens` INTEGER NULL,
    `outputTokens` INTEGER NULL,
    `latencyMs` INTEGER NULL,
    `costMicros` BIGINT NULL,
    `costCurrency` VARCHAR(3) NULL,
    `errorCode` VARCHAR(100) NULL,
    `requestedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `startedAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ai_executions_idempotencyKey_key`(`idempotencyKey`),
    INDEX `ai_executions_actorUserId_requestedAt_idx`(`actorUserId`, `requestedAt`),
    INDEX `ai_executions_purpose_status_idx`(`purpose`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ai_executions`
ADD CONSTRAINT `ai_executions_actorUserId_fkey`
FOREIGN KEY (`actorUserId`) REFERENCES `users`(`id`)
ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE `resume_processing_runs` (
    `id` VARCHAR(36) NOT NULL,
    `candidateId` INTEGER NOT NULL,
    `resumeId` INTEGER NOT NULL,
    `status` ENUM('REQUESTED', 'PROCESSING', 'PROPOSED', 'CONFIRMED', 'REJECTED', 'FAILED', 'EXPIRED') NOT NULL DEFAULT 'REQUESTED',
    `idempotencyKey` VARCHAR(100) NOT NULL,
    `documentObjectKey` VARCHAR(500) NOT NULL,
    `documentSha256` CHAR(64) NOT NULL,
    `proposal` JSON NULL,
    `proposalVersion` INTEGER NOT NULL DEFAULT 1,
    `aiExecutionId` VARCHAR(36) NULL,
    `errorCode` VARCHAR(100) NULL,
    `requestedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `processingAt` DATETIME(3) NULL,
    `proposedAt` DATETIME(3) NULL,
    `confirmedAt` DATETIME(3) NULL,
    `rejectedAt` DATETIME(3) NULL,
    `failedAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `resume_processing_runs_idempotencyKey_key`(`idempotencyKey`),
    UNIQUE INDEX `resume_processing_runs_aiExecutionId_key`(`aiExecutionId`),
    INDEX `resume_processing_runs_candidateId_status_idx`(`candidateId`, `status`),
    INDEX `resume_processing_runs_status_requestedAt_idx`(`status`, `requestedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `resume_processing_runs`
ADD CONSTRAINT `resume_processing_runs_candidateId_fkey`
FOREIGN KEY (`candidateId`) REFERENCES `candidates`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resume_processing_runs`
ADD CONSTRAINT `resume_processing_runs_resumeId_fkey`
FOREIGN KEY (`resumeId`) REFERENCES `resumes`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resume_processing_runs`
ADD CONSTRAINT `resume_processing_runs_aiExecutionId_fkey`
FOREIGN KEY (`aiExecutionId`) REFERENCES `ai_executions`(`id`)
ON DELETE SET NULL ON UPDATE CASCADE;
