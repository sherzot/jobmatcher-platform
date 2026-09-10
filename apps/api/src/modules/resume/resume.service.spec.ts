/* eslint-disable @typescript-eslint/no-unsafe-assignment -- Jest asymmetric matchers are typed as any. */
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ResumeProcessingStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ResumeService } from './resume.service';

describe('ResumeService extraction confirmation', () => {
  const candidateFindUnique = jest.fn();
  const processingRunFindFirst = jest.fn();
  const processingRunFindUnique = jest.fn();
  const resumeFindUnique = jest.fn();
  const runTransaction = jest.fn();
  const prisma = {
    candidate: { findUnique: candidateFindUnique },
    resume: { findUnique: resumeFindUnique },
    resumeProcessingRun: {
      findFirst: processingRunFindFirst,
      findUnique: processingRunFindUnique,
    },
    $transaction: runTransaction,
  } as unknown as PrismaService;
  const service = new ResumeService(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
    candidateFindUnique.mockResolvedValue({ id: 7, userId: 42 });
    resumeFindUnique.mockResolvedValue({ id: 11, candidateId: 7 });
  });

  it('rejects an idempotency key reused for a different document', async () => {
    processingRunFindUnique.mockResolvedValue({
      id: 'run-1',
      documentObjectKey: 'resumes/original.pdf',
      documentSha256: 'a'.repeat(64),
    });

    await expect(
      service.requestExtraction(42, {
        documentObjectKey: 'resumes/different.pdf',
        documentSha256: 'b'.repeat(64),
        idempotencyKey: 'upload-1',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(runTransaction).not.toHaveBeenCalled();
  });

  it('rejects malformed model output before opening a transaction', async () => {
    await expect(
      service.recordExtractionProposal('run-1', { title: 'incomplete' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(runTransaction).not.toHaveBeenCalled();
  });

  it('rejects an AI proposal that bypasses the resume date format', async () => {
    await expect(
      service.recordExtractionProposal('run-1', {
        educations: [{ schoolName: 'University', startDate: '2020-04' }],
        experiences: [],
        skills: [],
        qualifications: [],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(runTransaction).not.toHaveBeenCalled();
  });

  it('does not mutate a resume before a proposal is confirmable', async () => {
    processingRunFindFirst.mockResolvedValue({
      id: 'run-1',
      candidateId: 7,
      resumeId: 11,
      status: ResumeProcessingStatus.PROCESSING,
      proposal: null,
    });

    await expect(service.confirmExtraction(42, 'run-1')).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(runTransaction).not.toHaveBeenCalled();
  });

  it('does not expose another candidate processing run', async () => {
    processingRunFindFirst.mockResolvedValue(null);

    await expect(
      service.confirmExtraction(42, 'other-run'),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(processingRunFindFirst).toHaveBeenCalledWith({
      where: { id: 'other-run', candidateId: 7 },
    });
    expect(runTransaction).not.toHaveBeenCalled();
  });

  it('applies a validated proposal atomically after candidate confirmation', async () => {
    processingRunFindFirst.mockResolvedValue({
      id: 'run-1',
      candidateId: 7,
      resumeId: 11,
      status: ResumeProcessingStatus.PROPOSED,
      proposal: {
        title: 'Backend Engineer',
        educations: [{ schoolName: 'University', startDate: '2020年04月' }],
        experiences: [],
        skills: [{ name: 'TypeScript' }],
        qualifications: [],
      },
    });
    const transaction = {
      resumeProcessingRun: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      education: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        createMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      experience: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        createMany: jest.fn(),
      },
      skill: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        createMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      qualification: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        createMany: jest.fn(),
      },
      resume: {
        update: jest.fn().mockResolvedValue({ id: 11 }),
        findUniqueOrThrow: jest.fn().mockResolvedValue({ id: 11 }),
      },
      outboxEvent: {
        create: jest.fn().mockResolvedValue({ id: 'event-1' }),
      },
    };
    runTransaction.mockImplementation(
      async (callback: (client: typeof transaction) => Promise<unknown>) =>
        callback(transaction),
    );

    await expect(service.confirmExtraction(42, 'run-1')).resolves.toEqual({
      id: 11,
    });
    expect(transaction.resumeProcessingRun.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: ResumeProcessingStatus.PROPOSED,
        }),
        data: expect.objectContaining({
          status: ResumeProcessingStatus.CONFIRMED,
        }),
      }),
    );
    expect(transaction.education.createMany).toHaveBeenCalledTimes(1);
    expect(transaction.skill.createMany).toHaveBeenCalledTimes(1);
    expect(transaction.outboxEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          eventType: 'ResumeExtractionConfirmed',
        }),
      }),
    );
  });
});
