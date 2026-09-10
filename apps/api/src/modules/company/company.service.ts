import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CompanyStatus, UserStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import {
  canReviewCompany,
  CompanyReviewAction,
  hasValidCompanyRejectionReason,
} from './domain/company-approval.policy';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Get own company profile ────────────────────────────────

  async getMyCompany(userId: number) {
    const company = await this.prisma.company.findUnique({
      where: { userId },
      include: {
        jobs: {
          where: { status: { not: 'DELETED' } },
          orderBy: { createdAt: 'desc' },
          select: {
            jobCode: true,
            title: true,
            description: true,
            status: true,
            jobType: true,
            workLocation: true,
            salaryType: true,
            salaryMin: true,
            salaryMax: true,
            prefecture: true,
            japaneseLevel: true,
            visaSponsorship: true,
            skills: true,
            closesAt: true,
            applyCount: true,
            viewCount: true,
            publishedAt: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException({
        code: 'COMPANY_NOT_FOUND',
        message: '会社情報が見つかりません。',
      });
    }

    return company;
  }

  // ── Update company profile ─────────────────────────────────

  async updateCompany(userId: number, dto: UpdateCompanyDto) {
    const company = await this.prisma.company.findUnique({ where: { userId } });
    if (!company) {
      throw new NotFoundException({
        code: 'COMPANY_NOT_FOUND',
        message: '会社情報が見つかりません。',
      });
    }

    return this.prisma.company.update({
      where: { userId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.nameKana !== undefined && { nameKana: dto.nameKana }),
        ...(dto.nameEn !== undefined && { nameEn: dto.nameEn }),
        ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl }),
        ...(dto.websiteUrl !== undefined && { websiteUrl: dto.websiteUrl }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.industry !== undefined && { industry: dto.industry }),
        ...(dto.employeeCount !== undefined && {
          employeeCount: dto.employeeCount,
        }),
        ...(dto.founded !== undefined && { founded: dto.founded }),
        ...(dto.country !== undefined && { country: dto.country }),
        ...(dto.prefecture !== undefined && { prefecture: dto.prefecture }),
        ...(dto.city !== undefined && { city: dto.city }),
        ...(dto.address !== undefined && { address: dto.address }),
      },
    });
  }

  // ── Get company by code (Agent/Admin) ──────────────────────

  async getCompanyByCode(code: string) {
    const company = await this.prisma.company.findUnique({
      where: { companyCode: code },
      include: {
        agentCompanies: {
          include: {
            agent: { select: { agentCode: true, displayName: true } },
          },
        },
        jobs: {
          where: { status: { not: 'DELETED' } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!company) {
      throw new NotFoundException({
        code: 'COMPANY_NOT_FOUND',
        message: '会社情報が見つかりません。',
      });
    }

    return company;
  }

  // ── Agent: activate/deactivate company ────────────────────

  async setCompanyActive(
    agentUserId: number,
    companyCode: string,
    isActive: boolean,
  ) {
    const agent = await this.prisma.agent.findUnique({
      where: { userId: agentUserId },
    });
    if (!agent || !agent.isActive) {
      throw new ForbiddenException({
        code: 'NOT_AN_ACTIVE_AGENT',
        message: '有効なエージェントのみ企業を操作できます。',
      });
    }

    const company = await this.prisma.company.findUnique({
      where: { companyCode },
    });
    if (!company) {
      throw new NotFoundException({
        code: 'COMPANY_NOT_FOUND',
        message: '会社情報が見つかりません。',
      });
    }
    if (company.status !== CompanyStatus.APPROVED) {
      throw new BadRequestException({
        code: 'COMPANY_NOT_APPROVED',
        message: '承認済みの会社のみ有効状態を変更できます。',
      });
    }
    const assignment = await this.prisma.agentCompany.findUnique({
      where: {
        agentId_companyId: {
          agentId: agent.id,
          companyId: company.id,
        },
      },
      select: { id: true },
    });
    if (!assignment) {
      throw new ForbiddenException({
        code: 'COMPANY_NOT_ASSIGNED',
        message: 'この会社を操作する権限がありません。',
      });
    }

    return this.prisma.company.update({
      where: { companyCode },
      data: { isActive },
    });
  }

  async reviewCompany(
    agentUserId: number,
    companyCode: string,
    action: CompanyReviewAction,
    reason?: string,
  ) {
    const agent = await this.prisma.agent.findUnique({
      where: { userId: agentUserId },
    });
    if (!agent || !agent.isActive) {
      throw new ForbiddenException({
        code: 'NOT_AN_ACTIVE_AGENT',
        message: '有効なエージェントのみ企業を審査できます。',
      });
    }

    const company = await this.prisma.company.findUnique({
      where: { companyCode },
    });
    if (!company) {
      throw new NotFoundException({
        code: 'COMPANY_NOT_FOUND',
        message: '会社情報が見つかりません。',
      });
    }
    if (!canReviewCompany(company.status)) {
      throw new BadRequestException({
        code: 'COMPANY_NOT_PENDING',
        message: 'この会社は審査待ち状態ではありません。',
      });
    }
    if (!hasValidCompanyRejectionReason(action, reason)) {
      throw new BadRequestException({
        code: 'REJECTION_REASON_REQUIRED',
        message: '却下理由を入力してください。',
      });
    }

    return this.prisma.$transaction(async (transaction) => {
      const transition = await transaction.company.updateMany({
        where: {
          id: company.id,
          status: CompanyStatus.PENDING_APPROVAL,
        },
        data: {
          status:
            action === 'approve'
              ? CompanyStatus.APPROVED
              : CompanyStatus.REJECTED,
          isActive: action === 'approve',
          approvedAt: action === 'approve' ? new Date() : null,
          approvedByAgentId: action === 'approve' ? agent.id : null,
          rejectionReason: action === 'reject' ? reason?.trim() : null,
        },
      });

      if (transition.count !== 1) {
        throw new BadRequestException({
          code: 'COMPANY_REVIEW_CONFLICT',
          message: '会社の審査状態が更新されました。再読み込みしてください。',
        });
      }

      await transaction.user.update({
        where: { id: company.userId },
        data: {
          status:
            action === 'approve' ? UserStatus.ACTIVE : UserStatus.INACTIVE,
        },
      });

      if (action === 'approve') {
        await transaction.agentCompany.upsert({
          where: {
            agentId_companyId: {
              agentId: agent.id,
              companyId: company.id,
            },
          },
          create: {
            agentId: agent.id,
            companyId: company.id,
            isPrimary: true,
          },
          update: { isPrimary: true },
        });
      }

      await transaction.outboxEvent.create({
        data: {
          aggregateType: 'Company',
          aggregateId: String(company.id),
          eventType:
            action === 'approve' ? 'CompanyApproved' : 'CompanyRejected',
          payload: {
            companyId: company.id,
            reviewedByAgentId: agent.id,
          },
        },
      });

      return transaction.company.findUniqueOrThrow({
        where: { id: company.id },
      });
    });
  }
}
