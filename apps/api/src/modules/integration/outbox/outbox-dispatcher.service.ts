import { Injectable } from '@nestjs/common';
import { OutboxEvent, OutboxEventStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import type { OutboxMessage, OutboxTransport } from './outbox-transport';

const DEFAULT_BATCH_SIZE = 20;
const MAX_BATCH_SIZE = 100;
const DEFAULT_MAX_ATTEMPTS = 5;
const BASE_RETRY_DELAY_MS = 1_000;

@Injectable()
export class OutboxDispatcherService {
  constructor(private readonly prisma: PrismaService) {}

  async publishBatch(
    workerId: string,
    transport: OutboxTransport,
    options: {
      batchSize?: number;
      maxAttempts?: number;
      now?: Date;
    } = {},
  ): Promise<{ claimed: number; published: number; failed: number }> {
    const now = options.now ?? new Date();
    const batchSize = Math.min(
      Math.max(options.batchSize ?? DEFAULT_BATCH_SIZE, 1),
      MAX_BATCH_SIZE,
    );
    const maxAttempts = Math.max(
      options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS,
      1,
    );
    const events = await this.claimBatch(workerId, batchSize, now);
    let published = 0;
    let failed = 0;

    for (const event of events) {
      try {
        await transport.publish(this.toMessage(event));
        const marked = await this.prisma.outboxEvent.updateMany({
          where: {
            id: event.id,
            status: OutboxEventStatus.PROCESSING,
            lockedBy: workerId,
          },
          data: {
            status: OutboxEventStatus.PUBLISHED,
            publishedAt: new Date(),
            lockedAt: null,
            lockedBy: null,
            lastError: null,
          },
        });
        if (marked.count === 1) {
          published += 1;
        }
      } catch (error) {
        if (
          await this.recordFailure(event, workerId, error, maxAttempts, now)
        ) {
          failed += 1;
        }
      }
    }

    return { claimed: events.length, published, failed };
  }

  async releaseStaleClaims(staleBefore: Date): Promise<number> {
    const result = await this.prisma.outboxEvent.updateMany({
      where: {
        status: OutboxEventStatus.PROCESSING,
        lockedAt: { lt: staleBefore },
      },
      data: {
        status: OutboxEventStatus.PENDING,
        lockedAt: null,
        lockedBy: null,
      },
    });

    return result.count;
  }

  private async claimBatch(
    workerId: string,
    batchSize: number,
    now: Date,
  ): Promise<OutboxEvent[]> {
    const candidates = await this.prisma.outboxEvent.findMany({
      where: {
        status: OutboxEventStatus.PENDING,
        availableAt: { lte: now },
      },
      orderBy: [{ occurredAt: 'asc' }, { id: 'asc' }],
      take: batchSize,
    });
    const claimed: OutboxEvent[] = [];

    for (const candidate of candidates) {
      const claim = await this.prisma.outboxEvent.updateMany({
        where: {
          id: candidate.id,
          status: OutboxEventStatus.PENDING,
          availableAt: { lte: now },
        },
        data: {
          status: OutboxEventStatus.PROCESSING,
          lockedAt: now,
          lockedBy: workerId,
        },
      });
      if (claim.count === 1) {
        claimed.push({
          ...candidate,
          status: OutboxEventStatus.PROCESSING,
          lockedAt: now,
          lockedBy: workerId,
        });
      }
    }

    return claimed;
  }

  private async recordFailure(
    event: OutboxEvent,
    workerId: string,
    error: unknown,
    maxAttempts: number,
    now: Date,
  ): Promise<boolean> {
    const attempts = event.attempts + 1;
    const exhausted = attempts >= maxAttempts;
    const delayMs = BASE_RETRY_DELAY_MS * 2 ** Math.min(attempts - 1, 10);

    const result = await this.prisma.outboxEvent.updateMany({
      where: {
        id: event.id,
        status: OutboxEventStatus.PROCESSING,
        lockedBy: workerId,
      },
      data: {
        attempts,
        status: exhausted
          ? OutboxEventStatus.FAILED
          : OutboxEventStatus.PENDING,
        availableAt: exhausted
          ? event.availableAt
          : new Date(now.getTime() + delayMs),
        lockedAt: null,
        lockedBy: null,
        lastError: this.errorMessage(error),
      },
    });
    return result.count === 1;
  }

  private toMessage(event: OutboxEvent): OutboxMessage {
    return {
      id: event.id,
      aggregateType: event.aggregateType,
      aggregateId: event.aggregateId,
      eventType: event.eventType,
      payload: event.payload,
      schemaVersion: event.schemaVersion,
      occurredAt: event.occurredAt,
    };
  }

  private errorMessage(error: unknown): string {
    const message =
      error instanceof Error ? error.message : 'Unknown publish error';
    return message.slice(0, 2_000);
  }
}
