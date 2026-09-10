import { Injectable } from '@nestjs/common';
import type { OutboxEventStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IntegrationQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async listOutboxEvents(
    status: OutboxEventStatus | undefined,
    page = 1,
    limit = 20,
  ) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};
    const [items, total] = await Promise.all([
      this.prisma.outboxEvent.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ occurredAt: 'desc' }, { id: 'desc' }],
        select: {
          id: true,
          aggregateType: true,
          aggregateId: true,
          eventType: true,
          schemaVersion: true,
          status: true,
          attempts: true,
          availableAt: true,
          occurredAt: true,
          publishedAt: true,
          lastError: true,
        },
      }),
      this.prisma.outboxEvent.count({ where }),
    ]);

    return { items, total, page, limit };
  }
}
