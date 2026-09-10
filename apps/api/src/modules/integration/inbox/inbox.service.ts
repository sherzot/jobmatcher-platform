import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

export type InboxHandler = (
  transaction: Prisma.TransactionClient,
) => Promise<void>;

@Injectable()
export class InboxService {
  constructor(private readonly prisma: PrismaService) {}

  async processOnce(
    consumerName: string,
    messageId: string,
    handler: InboxHandler,
  ): Promise<'processed' | 'duplicate'> {
    try {
      return await this.prisma.$transaction(async (transaction) => {
        const existing = await transaction.processedMessage.findUnique({
          where: {
            consumerName_messageId: { consumerName, messageId },
          },
        });
        if (existing) {
          return 'duplicate';
        }

        await handler(transaction);
        await transaction.processedMessage.create({
          data: { consumerName, messageId },
        });
        return 'processed';
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const winner = await this.prisma.processedMessage.findUnique({
          where: {
            consumerName_messageId: { consumerName, messageId },
          },
        });
        if (winner) {
          return 'duplicate';
        }
      }
      throw error;
    }
  }
}
