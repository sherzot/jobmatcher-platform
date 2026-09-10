import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JobStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import {
  canReviewJob,
  canToggleJobPublication,
  hasValidSalaryRange,
  resolveInitialJobStatus,
} from './domain/job-lifecycle.policy';

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
    if (dto.jobType) where.jobType = dto.jobType;
    if (dto.workLocation) where.workLocation = dto.workLocation;
    if (dto.salaryType) where.salaryType = dto.salaryType;
    if (dto.prefecture) where.prefecture = { contains: dto.prefecture };
    if (dto.japaneseLevel) where.japaneseLevel = dto.japaneseLevel;
    if (dto.salaryMin) where.salaryMax = { gte: dto.salaryMin };

    const [items, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          jobCode: true,
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
            select: {
              id: true,
              companyCode: true,
              name: true,
              logoUrl: true,
              industry: true,
            },
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
      where: { jobCode: code },
      include: {
        company: {
          select: {
            id: true,
            companyCode: true,
            name: true,
            logoUrl: true,
            websiteUrl: true,
            industry: true,
            prefecture: true,
          },
        },
      },
    });

    if (!job || job.status !== JobStatus.ACTIVE) {
      throw new NotFoundException({
        code: 'JOB_NOT_FOUND',
        message: '求人が見つかりません。',
      });
    }

    // Increment view count (fire-and-forget)
    this.prisma.job
      .update({
        where: { jobCode: code },
        data: { viewCount: { increment: 1 } },
      })
      .catch(() => null);

    return job;
  }

  // ── Create job (COMPANY or AGENT) ─────────────────────────

  async createJob(actor: JwtPayload, dto: CreateJobDto) {
    let companyId: number;

    if (!hasValidSalaryRange(dto.salaryMin, dto.salaryMax)) {
      throw new BadRequestException({
        code: 'INVALID_SALARY_RANGE',
        message: '最低給与は最高給与以下である必要があります。',
      });
    }

    if (actor.role === UserRole.COMPANY) {
      const company = await this.prisma.company.findUnique({
        where: { userId: actor.sub },
      });
      if (!company || !company.isActive) {
        throw new ForbiddenException({
          code: 'COMPANY_NOT_ACTIVE',
          message: '会社アカウントが有効化されていません。',
        });
      }
      companyId = company.id;
    } else if (actor.role === UserRole.AGENT) {
      if (!dto.companyId)
        throw new BadRequestException({
          code: 'MISSING_COMPANY_ID',
          message: 'エージェントは対象会社を指定してください。',
        });
      await this.assertAgentAssignedToCompany(actor.sub, dto.companyId);
      companyId = dto.companyId;
    } else {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'アクセスが拒否されました。',
      });
    }

    const status = resolveInitialJobStatus(
      dto.salaryType,
      dto.jobType,
    ) as JobStatus;

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

  private async assertAgentAssignedToCompany(
    agentUserId: number,
    companyId: number,
  ) {
    const agent = await this.prisma.agent.findUnique({
      where: { userId: agentUserId },
      select: { id: true, isActive: true },
    });
    if (!agent?.isActive)
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: '有効なエージェントのみ求人を作成できます。',
      });
    const assignment = await this.prisma.agentCompany.findUnique({
      where: { agentId_companyId: { agentId: agent.id, companyId } },
    });
    if (!assignment)
      throw new ForbiddenException({
        code: 'COMPANY_NOT_ASSIGNED',
        message: 'この会社は担当エージェントに割り当てられていません。',
      });
  }

  // ── Agent: approve or reject a pending job ────────────────

  async reviewJob(
    agentUserId: number,
    jobCode: string,
    action: 'approve' | 'reject',
    rejectionReason?: string,
  ) {
    const agent = await this.prisma.agent.findUnique({
      where: { userId: agentUserId },
    });
    if (!agent || !agent.isActive) {
      throw new ForbiddenException({
        code: 'NOT_AN_ACTIVE_AGENT',
        message: '有効なエージェントのみ求人を審査できます。',
      });
    }

    const job = await this.prisma.job.findUnique({ where: { jobCode } });
    if (!job) {
      throw new NotFoundException({
        code: 'JOB_NOT_FOUND',
        message: '求人が見つかりません。',
      });
    }
    const assignment = await this.prisma.agentCompany.findUnique({
      where: {
        agentId_companyId: { agentId: agent.id, companyId: job.companyId },
      },
    });
    if (!assignment) {
      throw new ForbiddenException({
        code: 'COMPANY_NOT_ASSIGNED',
        message: 'この会社の求人を審査する権限がありません。',
      });
    }
    if (!canReviewJob(job.status)) {
      throw new BadRequestException({
        code: 'NOT_PENDING',
        message: 'この求人はレビュー待ち状態ではありません。',
      });
    }

    const newStatus =
      action === 'approve' ? JobStatus.ACTIVE : JobStatus.REJECTED;

    const transition = await this.prisma.job.updateMany({
      where: { id: job.id, status: JobStatus.PENDING_REVIEW },
      data: {
        status: newStatus,
        reviewedAt: new Date(),
        reviewedById: agent.id,
        rejectionReason: action === 'reject' ? rejectionReason : null,
        publishedAt: action === 'approve' ? new Date() : null,
      },
    });
    if (transition.count !== 1) {
      throw new ConflictException({
        code: 'JOB_REVIEW_CONFLICT',
        message: '求人の審査状態が更新されました。再読み込みしてください。',
      });
    }
    return this.prisma.job.findUniqueOrThrow({ where: { id: job.id } });
  }

  // ── COMPANY/AGENT: toggle job active/paused ───────────────

  async toggleJobStatus(actor: JwtPayload, jobCode: string, activate: boolean) {
    const job = await this.getOwnedJobOrThrow(actor, jobCode);

    if (!canToggleJobPublication(job.status)) {
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

  async updateJob(actor: JwtPayload, jobCode: string, dto: UpdateJobDto) {
    const job = await this.getOwnedJobOrThrow(actor, jobCode);
    if (
      dto.salaryMin !== undefined &&
      dto.salaryMax !== undefined &&
      dto.salaryMin > dto.salaryMax
    ) {
      throw new BadRequestException({
        code: 'INVALID_SALARY_RANGE',
        message: '最低給与は最高給与以下である必要があります。',
      });
    }
    const { skills, closesAt, ...fields } = dto;
    return this.prisma.job.update({
      where: { id: job.id },
      data: {
        ...fields,
        ...(skills !== undefined ? { skills: JSON.stringify(skills) } : {}),
        ...(closesAt !== undefined
          ? { closesAt: closesAt ? new Date(closesAt) : null }
          : {}),
      },
    });
  }

  async deleteJob(actor: JwtPayload, jobCode: string) {
    const job = await this.getOwnedJobOrThrow(actor, jobCode);
    return this.prisma.job.update({
      where: { id: job.id },
      data: { status: JobStatus.DELETED },
    });
  }

  // ── Private helpers ────────────────────────────────────────

  private async getOwnedJobOrThrow(actor: JwtPayload, jobCode: string) {
    const job = await this.prisma.job.findUnique({ where: { jobCode } });
    if (!job) {
      throw new NotFoundException({
        code: 'JOB_NOT_FOUND',
        message: '求人が見つかりません。',
      });
    }

    if (actor.role === UserRole.COMPANY) {
      const company = await this.prisma.company.findUnique({
        where: { userId: actor.sub },
      });
      if (!company || job.companyId !== company.id) {
        throw new ForbiddenException({
          code: 'FORBIDDEN',
          message: 'この求人を操作する権限がありません。',
        });
      }
    } else if (actor.role === UserRole.AGENT) {
      const agent = await this.prisma.agent.findUnique({
        where: { userId: actor.sub },
      });
      if (!agent) {
        throw new ForbiddenException({
          code: 'NOT_AN_AGENT',
          message: 'エージェントが見つかりません。',
        });
      }
      const assignment = await this.prisma.agentCompany.findUnique({
        where: {
          agentId_companyId: { agentId: agent.id, companyId: job.companyId },
        },
      });
      if (!assignment) {
        throw new ForbiddenException({
          code: 'COMPANY_NOT_ASSIGNED',
          message: 'この求人を操作する権限がありません。',
        });
      }
    } else {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'この求人を操作する権限がありません。',
      });
    }

    return job;
  }
}
