/* eslint-disable @typescript-eslint/no-unsafe-assignment -- Jest asymmetric matchers are typed as any. */
import { OutboxEvent, OutboxEventStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { OutboxDispatcherService } from './outbox-dispatcher.service';
import type { OutboxTransport } from './outbox-transport';

const NOW = new Date('2026-07-28T00:00:00.000Z');

const event: OutboxEvent = {
  id: 'event-1',
  aggregateType: 'Application',
  aggregateId: '10',
  eventType: 'ApplicationSubmitted',
  payload: { applicationId: 10 } as Prisma.JsonObject,
  schemaVersion: 1,
  status: OutboxEventStatus.PENDING,
  attempts: 0,
  availableAt: NOW,
  occurredAt: NOW,
  publishedAt: null,
  lastError: null,
  lockedAt: null,
  lockedBy: null,
};

describe('OutboxDispatcherService', () => {
  const findMany = jest.fn();
  const updateMany = jest.fn();
  const prisma = {
    outboxEvent: { findMany, updateMany },
  } as unknown as PrismaService;
  const service = new OutboxDispatcherService(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
    findMany.mockResolvedValue([event]);
    updateMany.mockResolvedValue({ count: 1 });
  });

  it('claims and marks a published event', async () => {
    const publish = jest
      .fn<
        ReturnType<OutboxTransport['publish']>,
        Parameters<OutboxTransport['publish']>
      >()
      .mockResolvedValue(undefined);
    const transport: OutboxTransport = {
      publish,
    };

    await expect(
      service.publishBatch('worker-1', transport, { now: NOW }),
    ).resolves.toEqual({ claimed: 1, published: 1, failed: 0 });
    expect(publish).toHaveBeenCalledWith(
      expect.objectContaining({
        id: event.id,
        eventType: event.eventType,
      }),
    );
    expect(updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: event.id,
          lockedBy: 'worker-1',
        }),
        data: expect.objectContaining({ status: OutboxEventStatus.PUBLISHED }),
      }),
    );
  });

  it('moves an exhausted event to failed', async () => {
    const transport: OutboxTransport = {
      publish: jest.fn().mockRejectedValue(new Error('transport unavailable')),
    };

    await expect(
      service.publishBatch('worker-1', transport, {
        now: NOW,
        maxAttempts: 1,
      }),
    ).resolves.toEqual({ claimed: 1, published: 0, failed: 1 });
    expect(updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: event.id,
          lockedBy: 'worker-1',
        }),
        data: expect.objectContaining({
          attempts: 1,
          status: OutboxEventStatus.FAILED,
          lastError: 'transport unavailable',
        }),
      }),
    );
  });

  it('does not overwrite state after losing claim ownership', async () => {
    updateMany
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 0 });
    const publish = jest
      .fn<
        ReturnType<OutboxTransport['publish']>,
        Parameters<OutboxTransport['publish']>
      >()
      .mockResolvedValue(undefined);

    await expect(
      service.publishBatch('worker-1', { publish }, { now: NOW }),
    ).resolves.toEqual({ claimed: 1, published: 0, failed: 0 });
  });

  it('releases stale processing claims', async () => {
    updateMany.mockResolvedValue({ count: 3 });

    await expect(service.releaseStaleClaims(NOW)).resolves.toBe(3);
    expect(updateMany).toHaveBeenCalledWith({
      where: {
        status: OutboxEventStatus.PROCESSING,
        lockedAt: { lt: NOW },
      },
      data: {
        status: OutboxEventStatus.PENDING,
        lockedAt: null,
        lockedBy: null,
      },
    });
  });
});
