import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCompanyDto } from './dto/update-company.dto';

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
            code: true, title: true, status: true, jobType: true,
            salaryType: true, salaryMin: true, salaryMax: true,
            applyCount: true, viewCount: true, publishedAt: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException({ code: 'COMPANY_NOT_FOUND', message: '会社情報が見つかりません。' });
    }

    return company;
  }

  // ── Update company profile ─────────────────────────────────

  async updateCompany(userId: number, dto: UpdateCompanyDto) {
    const company = await this.prisma.company.findUnique({ where: { userId } });
    if (!company) {
      throw new NotFoundException({ code: 'COMPANY_NOT_FOUND', message: '会社情報が見つかりません。' });
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
        ...(dto.employeeCount !== undefined && { employeeCount: dto.employeeCount }),
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
      where: { code },
      include: {
        agentCompanies: {
          include: { agent: { select: { code: true, displayName: true } } },
        },
        jobs: {
          where: { status: { not: 'DELETED' } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!company) {
      throw new NotFoundException({ code: 'COMPANY_NOT_FOUND', message: '会社情報が見つかりません。' });
    }

    return company;
  }

  // ── Agent: activate/deactivate company ────────────────────

  async setCompanyActive(
    agentUserId: number,
    companyCode: string,
    isActive: boolean,
  ) {
    const agent = await this.prisma.agent.findUnique({ where: { userId: agentUserId } });
    if (!agent) {
      throw new ForbiddenException({ code: 'NOT_AN_AGENT', message: 'エージェントが見つかりません。' });
    }

    const company = await this.prisma.company.findUnique({ where: { code: companyCode } });
    if (!company) {
      throw new NotFoundException({ code: 'COMPANY_NOT_FOUND', message: '会社情報が見つかりません。' });
    }

    return this.prisma.company.update({
      where: { code: companyCode },
      data: { isActive, isVerified: isActive },
    });
  }
}
