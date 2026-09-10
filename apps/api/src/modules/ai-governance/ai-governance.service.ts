import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AIExecution,
  AIExecutionPurpose,
  AIExecutionStatus,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  canTransitionAIExecution,
  hasValidAIUsage,
} from './domain/ai-execution.policy';

export interface RequestAIExecution {
  purpose: AIExecutionPurpose;
  idempotencyKey: string;
  actorUserId?: number;
  provider: string;
  model: string;
  promptVersion: string;
  inputReference?: string;
}

export interface CompleteAIExecution {
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  costMicros?: bigint;
  costCurrency?: string;
}

@Injectable()
export class AIGovernanceService {
  constructor(private readonly prisma: PrismaService) {}

  async requestExecution(input: RequestAIExecution) {
    const existing = await this.prisma.aIExecution.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (existing) {
      return this.assertSameRequest(existing, input);
    }

    try {
      return await this.prisma.aIExecution.create({ data: input });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const concurrent = await this.prisma.aIExecution.findUnique({
          where: { idempotencyKey: input.idempotencyKey },
        });
        if (concurrent) {
          return this.assertSameRequest(concurrent, input);
        }
      }
      throw error;
    }
  }

  startExecution(id: string) {
    return this.transition(
      id,
      AIExecutionStatus.REQUESTED,
      AIExecutionStatus.RUNNING,
      {
        startedAt: new Date(),
      },
    );
  }

  async completeExecution(id: string, usage: CompleteAIExecution) {
    if (
      !hasValidAIUsage(
        usage.inputTokens,
        usage.outputTokens,
        usage.latencyMs,
        usage.costMicros,
      )
    ) {
      throw new BadRequestException({
        code: 'INVALID_AI_USAGE',
        message: 'AI usage values must be non-negative.',
      });
    }

    return this.transition(
      id,
      AIExecutionStatus.RUNNING,
      AIExecutionStatus.SUCCEEDED,
      {
        ...usage,
        completedAt: new Date(),
      },
    );
  }

  failExecution(id: string, errorCode: string) {
    return this.transition(
      id,
      AIExecutionStatus.RUNNING,
      AIExecutionStatus.FAILED,
      {
        errorCode,
        completedAt: new Date(),
      },
    );
  }

  blockExecution(id: string, errorCode: string) {
    return this.transition(
      id,
      AIExecutionStatus.REQUESTED,
      AIExecutionStatus.BLOCKED,
      {
        errorCode,
        completedAt: new Date(),
      },
    );
  }

  async listExecutions(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.aIExecution.findMany({
        skip,
        take: limit,
        orderBy: { requestedAt: 'desc' },
      }),
      this.prisma.aIExecution.count(),
    ]);

    return { items, total, page, limit };
  }

  private async transition(
    id: string,
    from: AIExecutionStatus,
    to: AIExecutionStatus,
    data: Record<string, unknown>,
  ) {
    if (!canTransitionAIExecution(from, to)) {
      throw new BadRequestException({
        code: 'INVALID_AI_EXECUTION_TRANSITION',
        message: 'Invalid AI execution status transition.',
      });
    }

    const result = await this.prisma.aIExecution.updateMany({
      where: { id, status: from },
      data: { ...data, status: to },
    });
    if (result.count !== 1) {
      const exists = await this.prisma.aIExecution.findUnique({
        where: { id },
        select: { id: true },
      });
      if (!exists) {
        throw new NotFoundException({
          code: 'AI_EXECUTION_NOT_FOUND',
          message: 'AI execution was not found.',
        });
      }
      throw new ConflictException({
        code: 'AI_EXECUTION_CONFLICT',
        message: 'AI execution state changed before this operation completed.',
      });
    }

    return this.prisma.aIExecution.findUniqueOrThrow({ where: { id } });
  }

  private assertSameRequest(
    execution: AIExecution,
    input: RequestAIExecution,
  ): AIExecution {
    if (
      execution.purpose !== input.purpose ||
      execution.actorUserId !== (input.actorUserId ?? null) ||
      execution.provider !== input.provider ||
      execution.model !== input.model ||
      execution.promptVersion !== input.promptVersion ||
      execution.inputReference !== (input.inputReference ?? null)
    ) {
      throw new ConflictException({
        code: 'AI_IDEMPOTENCY_KEY_REUSED',
        message:
          'The same AI idempotency key cannot be used for different execution metadata.',
      });
    }
    return execution;
  }
}
