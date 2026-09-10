import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import {
  formatAdminCode,
  formatAgentCode,
  formatApplicationCode,
  formatCandidateCode,
  formatCompanyCode,
  formatJobCode,
} from '../common/domain/business-code';

type CreatedRecord = { id: number } & Record<string, unknown>;

function isCreatedRecord(value: unknown): value is CreatedRecord {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'number'
  );
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'warn', 'error']
          : ['warn', 'error'],
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
    const middleware: Prisma.Middleware<unknown> = async (params, next) => {
      const result = await next(params);

      if (params.action !== 'create' || !isCreatedRecord(result)) {
        return result;
      }

      switch (params.model) {
        case 'Candidate': {
          if (result.userCode) return result;
          const userCode = formatCandidateCode(result.id);
          await this.candidate.update({
            where: { id: result.id },
            data: { userCode },
          });
          return { ...result, userCode };
        }
        case 'Company': {
          if (result.companyCode) return result;
          const companyCode = formatCompanyCode(result.id);
          await this.company.update({
            where: { id: result.id },
            data: { companyCode },
          });
          return { ...result, companyCode };
        }
        case 'Agent': {
          if (result.agentCode) return result;
          const agentCode = formatAgentCode(result.id);
          await this.agent.update({
            where: { id: result.id },
            data: { agentCode },
          });
          return { ...result, agentCode };
        }
        case 'Admin': {
          if (result.adminCode) return result;
          const adminCode = formatAdminCode(result.id);
          await this.admin.update({
            where: { id: result.id },
            data: { adminCode },
          });
          return { ...result, adminCode };
        }
        case 'Job': {
          if (result.jobCode) return result;
          const jobCode = formatJobCode(result.id);
          await this.job.update({
            where: { id: result.id },
            data: { jobCode },
          });
          return { ...result, jobCode };
        }
        case 'Application': {
          if (result.appCode) return result;
          const appCode = formatApplicationCode(result.id);
          await this.application.update({
            where: { id: result.id },
            data: { appCode },
          });
          return { ...result, appCode };
        }
        default:
          return result;
      }
    };

    this.$use(middleware);
  }
}
