import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JobStatus, JobType, SalaryType, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Injectable()
export class JobService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Public: search active jobs ────────────────────────────

  async searchJobs(dto: SearchJobsDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { status: JobStatus.ACTIVE };

    if (dto.q) {
      where.OR = [
        { title: { contains: dto.q } },
        { description: { contains: dto.q } },
      ];
    }
    if (dto.jobType)     where.jobType     = dto.jobType;
    if (dto.workLocation) where.workLocation = dto.workLocation;
    if (dto.salaryType)  where.salaryType  = dto.salaryType;
    if (dto.prefecture)  where.prefecture  = { contains: dto.prefecture };
    if (dto.japaneseLevel) where.japaneseLevel = dto.japaneseLevel;
    if (dto.salaryMin)   where.salaryMax   = { gte: dto.salaryMin };

    const [items, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          code: true,
          title: true,
          jobType: true,
          workLocation: true,
          status: true,
          prefecture: true,
          city: true,
          salaryType: true,
          salaryMin: true,
          salaryMax: true,
          japaneseLevel: true,
          visaSponsorship: true,
          publishedAt: true,
          closesAt: true,
          viewCount: true,
          applyCount: true,
          company: {
            select: { id: true, code: true, name: true, logoUrl: true, industry: true },
          },
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  // ── Public: get single job ────────────────────────────────

  async getJob(code: string) {
    const job = await this.prisma.job.findUnique({
      where: { code },
      include: {
        company: {
          select: { id: true, code: true, name: true, logoUrl: true, websiteUrl: true, industry: true, prefecture: true },
        },
      },
    });

    if (!job || job.status !== JobStatus.ACTIVE) {
      throw new NotFoundException({ code: 'JOB_NOT_FOUND', message: '求人が見つかりません。' });
    }

    // Increment view count (fire-and-forget)
    this.prisma.job.update({ where: { code }, data: { viewCount: { increment: 1 } } }).catch(() => null);

    return job;
  }

  // ── Create job (COMPANY or AGENT) ─────────────────────────

  async createJob(actor: JwtPayload, dto: CreateJobDto) {
    let companyId: number;

    if (actor.role === UserRole.COMPANY) {
      const company = await this.prisma.company.findUnique({ where: { userId: actor.sub } });
      if (!company || !company.isActive) {
        throw new ForbiddenException({
          code: 'COMPANY_NOT_ACTIVE',
          message: '会社アカウントが有効化されていません。',
        });
      }
      companyId = company.id;
    } else if (actor.role === UserRole.AGENT) {
      // Agent must specify companyId via query or body — for now expect it in body
      throw new BadRequestException({
        code: 'MISSING_COMPANY_ID',
        message: 'エージェントは対象会社を指定してください。',
      });
    } else {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'アクセスが拒否されました。' });
    }

    const status = this.resolveJobStatus(dto.salaryType, dto.jobType);

    const job = await this.prisma.job.create({
      data: {
        companyId,
        title: dto.title,
        description: dto.description,
        requirements: dto.requirements,
        benefits: dto.benefits,
        jobType: dto.jobType,
        workLocation: dto.workLocation,
        status,
        country: dto.country,
        prefecture: dto.prefecture,
        city: dto.city,
        salaryType: dto.salaryType,
        salaryMin: dto.salaryMin,
        salaryMax: dto.salaryMax,
        japaneseLevel: dto.japaneseLevel,
        visaSponsorship: dto.visaSponsorship ?? false,
        minExperience: dto.minExperience,
        skills: dto.skills ? JSON.stringify(dto.skills) : null,
        createdByRole: actor.role,
        createdById: actor.sub,
        closesAt: dto.closesAt ? new Date(dto.closesAt) : null,
        publishedAt: status === JobStatus.ACTIVE ? new Date() : null,
      },
    });

    return { job, status };
  }

  // ── Agent: approve or reject a pending job ────────────────

  async reviewJob(
    agentUserId: number,
    jobCode: string,
    action: 'approve' | 'reject',
    rejectionReason?: string,
  ) {
    const agent = await this.prisma.agent.findUnique({ where: { userId: agentUserId } });
    if (!agent) {
      throw new ForbiddenException({ code: 'NOT_AN_AGENT', message: 'エージェントが見つかりません。' });
    }

    const job = await this.prisma.job.findUnique({ where: { code: jobCode } });
    if (!job) {
      throw new NotFoundException({ code: 'JOB_NOT_FOUND', message: '求人が見つかりません。' });
    }
    if (job.status !== JobStatus.PENDING_REVIEW) {
      throw new BadRequestException({
        code: 'NOT_PENDING',
        message: 'この求人はレビュー待ち状態ではありません。',
      });
    }

    const newStatus = action === 'approve' ? JobStatus.ACTIVE : JobStatus.REJECTED;

    return this.prisma.job.update({
      where: { id: job.id },
      data: {
        status: newStatus,
        reviewedAt: new Date(),
        reviewedById: agent.id,
        rejectionReason: action === 'reject' ? rejectionReason : null,
        publishedAt: action === 'approve' ? new Date() : null,
      },
    });
  }

  // ── COMPANY/AGENT: toggle job active/paused ───────────────

  async toggleJobStatus(actor: JwtPayload, jobCode: string, activate: boolean) {
    const job = await this.getOwnedJobOrThrow(actor, jobCode);

    const toggleable: JobStatus[] = [JobStatus.ACTIVE, JobStatus.PAUSED];
    if (!toggleable.includes(job.status)) {
      throw new BadRequestException({
        code: 'INVALID_STATUS',
        message: 'この求人は公開・停止できる状態ではありません。',
      });
    }

    return this.prisma.job.update({
      where: { id: job.id },
      data: { status: activate ? JobStatus.ACTIVE : JobStatus.PAUSED },
    });
  }

  // ── Private helpers ────────────────────────────────────────

  /**
   * Approval logic:
   * - HOURLY → always PENDING_REVIEW
   * - MONTHLY + PART_TIME → PENDING_REVIEW
   * - MONTHLY + FULL_TIME/other → ACTIVE
   * - ANNUAL → always ACTIVE
   */
  private resolveJobStatus(salaryType: SalaryType, jobType: JobType): JobStatus {
    if (salaryType === SalaryType.HOURLY) return JobStatus.PENDING_REVIEW;
    if (salaryType === SalaryType.MONTHLY && jobType === JobType.PART_TIME) return JobStatus.PENDING_REVIEW;
    return JobStatus.ACTIVE;
  }

  private async getOwnedJobOrThrow(actor: JwtPayload, jobCode: string) {
    const job = await this.prisma.job.findUnique({ where: { code: jobCode } });
    if (!job) {
      throw new NotFoundException({ code: 'JOB_NOT_FOUND', message: '求人が見つかりません。' });
    }

    if (actor.role === UserRole.COMPANY) {
      const company = await this.prisma.company.findUnique({ where: { userId: actor.sub } });
      if (!company || job.companyId !== company.id) {
        throw new ForbiddenException({ code: 'FORBIDDEN', message: 'この求人を操作する権限がありません。' });
      }
    }
    // AGENT can manage any job (for their assigned companies — full check can be added later)

    return job;
  }
}
