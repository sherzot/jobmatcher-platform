import { ConflictException, ForbiddenException } from '@nestjs/common';
import { JobStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { JobService } from './job.service';

describe('JobService review authorization and concurrency', () => {
  const agentFindUnique = jest.fn();
  const jobFindUnique = jest.fn();
  const assignmentFindUnique = jest.fn();
  const jobUpdateMany = jest.fn();
  const jobFindUniqueOrThrow = jest.fn();
  const jobCreate = jest.fn();
  const prisma = {
    agent: { findUnique: agentFindUnique },
    job: {
      findUnique: jobFindUnique,
      updateMany: jobUpdateMany,
      findUniqueOrThrow: jobFindUniqueOrThrow,
      create: jobCreate,
    },
    agentCompany: { findUnique: assignmentFindUnique },
  } as unknown as PrismaService;
  const service = new JobService(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
    agentFindUnique.mockResolvedValue({ id: 2, isActive: true });
    jobFindUnique.mockResolvedValue({
      id: 3,
      companyId: 9,
      status: JobStatus.PENDING_REVIEW,
    });
  });

  it('denies review by an agent not assigned to the company', async () => {
    assignmentFindUnique.mockResolvedValue(null);

    await expect(
      service.reviewJob(20, 'J0000003', 'approve'),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(jobUpdateMany).not.toHaveBeenCalled();
  });

  it('rejects the loser of concurrent job reviews', async () => {
    assignmentFindUnique.mockResolvedValue({ id: 4 });
    jobUpdateMany.mockResolvedValue({ count: 0 });

    await expect(
      service.reviewJob(20, 'J0000003', 'approve'),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(jobFindUniqueOrThrow).not.toHaveBeenCalled();
  });

  it('denies agent job creation for an unassigned company', async () => {
    assignmentFindUnique.mockResolvedValue(null);
    await expect(
      service.createJob(
        {
          sub: 20,
          role: UserRole.AGENT,
          email: 'agent@example.com',
          businessCode: 'A0000001',
        },
        {
          companyId: 99,
          title: 'Test',
          description: 'Test',
          jobType: 'FULL_TIME',
          workLocation: 'REMOTE',
          salaryType: 'ANNUAL',
        },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(jobCreate).not.toHaveBeenCalled();
  });

  it('creates an agent job only after assignment authorization', async () => {
    assignmentFindUnique.mockResolvedValue({ id: 4 });
    jobCreate.mockResolvedValue({ id: 8, jobCode: 'J0000008' });
    const result = await service.createJob(
      {
        sub: 20,
        role: UserRole.AGENT,
        email: 'agent@example.com',
        businessCode: 'A0000001',
      },
      {
        companyId: 9,
        title: 'Test',
        description: 'Test',
        jobType: 'FULL_TIME',
        workLocation: 'REMOTE',
        salaryType: 'ANNUAL',
      },
    );
    expect(result.job).toEqual({ id: 8, jobCode: 'J0000008' });
    expect(jobCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ companyId: 9 }) as unknown as Record<
          string,
          unknown
        >,
      }),
    );
  });
});
