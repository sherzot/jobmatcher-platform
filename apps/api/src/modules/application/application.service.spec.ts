import { ConflictException, ForbiddenException } from '@nestjs/common';
import { ApplicationStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ApplicationService } from './application.service';

describe('ApplicationService authorization and concurrency', () => {
  const applicationFindUnique = jest.fn();
  const applicationFindMany = jest.fn();
  const jobFindUnique = jest.fn();
  const agentFindUnique = jest.fn();
  const assignmentFindUnique = jest.fn();
  const runTransaction = jest.fn();
  const prisma = {
    application: {
      findUnique: applicationFindUnique,
      findMany: applicationFindMany,
    },
    job: { findUnique: jobFindUnique },
    agent: { findUnique: agentFindUnique },
    agentCompany: { findUnique: assignmentFindUnique },
    $transaction: runTransaction,
  } as unknown as PrismaService;
  const service = new ApplicationService(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
    agentFindUnique.mockResolvedValue({ id: 2, isActive: true });
  });

  it('denies an agent applications for an unassigned company', async () => {
    jobFindUnique.mockResolvedValue({ id: 3, companyId: 9 });
    assignmentFindUnique.mockResolvedValue(null);

    await expect(
      service.getJobApplications(20, 'J0000003'),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(assignmentFindUnique).toHaveBeenCalledWith({
      where: {
        agentId_companyId: { agentId: 2, companyId: 9 },
      },
      select: { id: true },
    });
    expect(applicationFindMany).not.toHaveBeenCalled();
  });

  it('denies company-role access to candidate application details', async () => {
    applicationFindUnique.mockResolvedValue({
      id: 1,
      userId: 42,
      job: { companyId: 9 },
      statusHistory: [],
    });

    await expect(
      service.getApplication(
        {
          sub: 10,
          email: 'company@example.com',
          role: UserRole.COMPANY,
          businessCode: 'C0000001',
        },
        'APP0000001',
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rejects a stale parallel status transition without side effects', async () => {
    applicationFindUnique.mockResolvedValue({
      id: 1,
      jobId: 3,
      status: ApplicationStatus.PENDING,
    });
    jobFindUnique.mockResolvedValue({ companyId: 9 });
    assignmentFindUnique.mockResolvedValue({ id: 4 });
    const transaction = {
      application: {
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        findUniqueOrThrow: jest.fn(),
      },
      applicationStatusHistory: { create: jest.fn() },
      outboxEvent: { create: jest.fn() },
    };
    runTransaction.mockImplementation(
      async (callback: (client: typeof transaction) => Promise<unknown>) =>
        callback(transaction),
    );

    await expect(
      service.updateStatus(20, 'APP0000001', {
        status: ApplicationStatus.CASUAL_INTERVIEW,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(transaction.applicationStatusHistory.create).not.toHaveBeenCalled();
    expect(transaction.outboxEvent.create).not.toHaveBeenCalled();
  });
});
