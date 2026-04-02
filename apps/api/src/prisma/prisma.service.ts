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

  // ─────────────────────────────────────────────────────────────
  // Auto-generate BUSINESS IDENTIFIER codes after record creation
  //
  // | Model       | Field       | Pattern     | Example      |
  // |-------------|-------------|-------------|--------------|
  // | Candidate   | userCode    | U + 7-digit | U0000001     |
  // | Company     | companyCode | C + 7-digit | C0000001     |
  // | Agent       | agentCode   | A + 7-digit | A0000001     |
  // | Admin       | adminCode   | admin + id  | admin1       |
  // | Job         | jobCode     | J + 7-digit | J0000001     |
  // | Application | appCode     | APP + 7-dig | APP0000001   |
  // ─────────────────────────────────────────────────────────────
  private registerCodeMiddleware(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any).$use(async (params: any, next: any) => {
      const result = await next(params);

      if (params.action !== 'create' || !result?.id) return result;

      type CodeConfig = { field: string; value: (id: number) => string };
      const modelCodeMap: Record<string, CodeConfig> = {
        Candidate:   { field: 'userCode',    value: (id) => `U${String(id).padStart(7, '0')}` },
        Company:     { field: 'companyCode', value: (id) => `C${String(id).padStart(7, '0')}` },
        Agent:       { field: 'agentCode',   value: (id) => `A${String(id).padStart(7, '0')}` },
        Admin:       { field: 'adminCode',   value: (id) => `admin${id}` },
        Job:         { field: 'jobCode',     value: (id) => `J${String(id).padStart(7, '0')}` },
        Application: { field: 'appCode',     value: (id) => `APP${String(id).padStart(7, '0')}` },
      };

      const config = modelCodeMap[params.model];
      if (!config) return result;

      const code = config.value(result.id);
      const modelKey = params.model.charAt(0).toLowerCase() + params.model.slice(1);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (this as any)[modelKey].update({
        where: { id: result.id },
        data: { [config.field]: code },
      });

      return { ...result, [config.field]: code };
    });
  }
}
