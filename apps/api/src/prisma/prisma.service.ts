import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['warn', 'error'],
    });
    this.registerCodeMiddleware();
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Database connected');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  // ── Auto-generate human-readable codes after creation ─────────
  private registerCodeMiddleware(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any).$use(async (params: any, next: any) => {
      const result = await next(params);

      if (params.action !== 'create') return result;

      const codeMap: Record<string, string> = {
        User:        'U',
        Job:         'J',
        Company:     'C',
        Agent:       'A',
        Application: 'APP',
      };

      const prefix = codeMap[params.model];
      if (!prefix || !result?.id) return result;

      const padded =
        prefix === 'APP'
          ? `APP${String(result.id).padStart(7, '0')}`
          : `${prefix}${String(result.id).padStart(7, '0')}`;

      const modelName = params.model as string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (this as any)[modelName.charAt(0).toLowerCase() + modelName.slice(1)].update({
        where: { id: result.id },
        data: { code: padded },
      });

      return { ...result, code: padded };
    });
  }
}
