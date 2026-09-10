import type { Prisma } from '@prisma/client';

export interface OutboxMessage {
  id: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  payload: Prisma.JsonValue;
  schemaVersion: number;
  occurredAt: Date;
}

export interface OutboxTransport {
  publish(message: OutboxMessage): Promise<void>;
}
