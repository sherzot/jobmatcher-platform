import { BadRequestException, ConflictException } from '@nestjs/common';
import { AIExecutionPurpose, AIExecutionStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AIGovernanceService } from './ai-governance.service';

describe('AIGovernanceService', () => {
  const create = jest.fn();
  const findUnique = jest.fn();
  const findUniqueOrThrow = jest.fn();
  const updateMany = jest.fn(() => Promise.resolve({ count: 0 }));
  const prisma = {
    aIExecution: {
      create,
      findUnique,
      findUniqueOrThrow,
      updateMany,
    },
  } as unknown as PrismaService;
  const service = new AIGovernanceService(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
    findUnique.mockResolvedValue(null);
  });

  it('persists the target status when an execution starts', async () => {
    updateMany.mockResolvedValue({ count: 1 });
    findUniqueOrThrow.mockResolvedValue({
      id: 'execution-1',
      status: AIExecutionStatus.RUNNING,
    });

    await expect(service.startExecution('execution-1')).resolves.toMatchObject({
      status: AIExecutionStatus.RUNNING,
    });
    expect(updateMany).toHaveBeenCalledTimes(1);
    const update = updateMany.mock.calls[0][0] as {
      where: { id: string; status: AIExecutionStatus };
      data: Record<string, unknown>;
    };
    expect(update.where).toEqual({
      id: 'execution-1',
      status: AIExecutionStatus.REQUESTED,
    });
    expect(update.data.status).toBe(AIExecutionStatus.RUNNING);
    expect(update.data.startedAt).toBeInstanceOf(Date);
  });

  it('records execution metadata without prompt content', async () => {
    const request = {
      purpose: AIExecutionPurpose.MATCHING,
      idempotencyKey: 'match:candidate-1:job-2:v1',
      provider: 'provider-name',
      model: 'model-name',
      promptVersion: 'matching-v1',
      inputReference: 'candidate-1:job-2',
    };
    create.mockResolvedValue({ id: 'execution-1', ...request });

    await expect(service.requestExecution(request)).resolves.toMatchObject({
      id: 'execution-1',
      idempotencyKey: request.idempotencyKey,
    });
    expect(create).toHaveBeenCalledWith({ data: request });
  });

  it('replays the existing execution for the same idempotent request', async () => {
    const request = {
      purpose: AIExecutionPurpose.RESUME_PARSING,
      idempotencyKey: 'resume:run-1:v1',
      actorUserId: 42,
      provider: 'provider-name',
      model: 'model-name',
      promptVersion: 'resume-v1',
      inputReference: 'resume-run-1',
    };
    const existing = {
      id: 'execution-1',
      ...request,
      status: AIExecutionStatus.REQUESTED,
      inputTokens: null,
      outputTokens: null,
      latencyMs: null,
      costMicros: null,
      costCurrency: null,
      errorCode: null,
      requestedAt: new Date(),
      startedAt: null,
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    findUnique.mockResolvedValue(existing);

    await expect(service.requestExecution(request)).resolves.toBe(existing);
    expect(create).not.toHaveBeenCalled();
  });

  it('rejects an idempotency key reused with different metadata', async () => {
    findUnique.mockResolvedValue({
      id: 'execution-1',
      purpose: AIExecutionPurpose.RESUME_PARSING,
      idempotencyKey: 'resume:run-1:v1',
      actorUserId: 42,
      provider: 'provider-name',
      model: 'model-name',
      promptVersion: 'resume-v1',
      inputReference: 'resume-run-1',
    });

    await expect(
      service.requestExecution({
        purpose: AIExecutionPurpose.RESUME_PARSING,
        idempotencyKey: 'resume:run-1:v1',
        actorUserId: 42,
        provider: 'different-provider',
        model: 'model-name',
        promptVersion: 'resume-v1',
        inputReference: 'resume-run-1',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(create).not.toHaveBeenCalled();
  });

  it('replays the winner of a concurrent idempotent create', async () => {
    const request = {
      purpose: AIExecutionPurpose.RESUME_PARSING,
      idempotencyKey: 'resume:run-1:v1',
      provider: 'provider-name',
      model: 'model-name',
      promptVersion: 'resume-v1',
    };
    const winner = {
      id: 'execution-1',
      ...request,
      actorUserId: null,
      inputReference: null,
    };
    findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(winner);
    create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('duplicate key', {
        code: 'P2002',
        clientVersion: '5.22.0',
      }),
    );

    await expect(service.requestExecution(request)).resolves.toBe(winner);
    expect(findUnique).toHaveBeenCalledTimes(2);
  });

  it('rejects negative metering values before persistence', async () => {
    await expect(
      service.completeExecution('execution-1', {
        inputTokens: -1,
        outputTokens: 10,
        latencyMs: 50,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
