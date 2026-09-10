import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { InboxService } from './inbox.service';

describe('InboxService', () => {
  const findUnique = jest.fn();
  const create = jest.fn();
  const transaction = {
    processedMessage: { findUnique, create },
  } as unknown as Prisma.TransactionClient;
  const prisma = {
    $transaction: jest.fn(
      (callback: (client: Prisma.TransactionClient) => Promise<unknown>) =>
        callback(transaction),
    ),
  } as unknown as PrismaService;
  const service = new InboxService(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('applies a database handler and records the message atomically', async () => {
    findUnique.mockResolvedValue(null);
    create.mockResolvedValue({
      consumerName: 'notifications',
      messageId: 'event-1',
    });
    const handler = jest.fn().mockResolvedValue(undefined);

    await expect(
      service.processOnce('notifications', 'event-1', handler),
    ).resolves.toBe('processed');
    expect(handler).toHaveBeenCalledWith(transaction);
    expect(create).toHaveBeenCalledWith({
      data: { consumerName: 'notifications', messageId: 'event-1' },
    });
  });

  it('does not repeat a processed message', async () => {
    findUnique.mockResolvedValue({
      consumerName: 'notifications',
      messageId: 'event-1',
    });
    const handler = jest.fn();

    await expect(
      service.processOnce('notifications', 'event-1', handler),
    ).resolves.toBe('duplicate');
    expect(handler).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });
});
