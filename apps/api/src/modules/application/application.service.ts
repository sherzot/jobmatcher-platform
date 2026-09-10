import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationStatus, JobStatus, Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ApplyJobDto } from './dto/apply-job.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import {
  canAgentTransitionApplication,
  canCandidateWithdrawApplication,
} from './domain/application-status.policy';
import {
  createTemporaryBusinessCode,
  formatApplicationCode,
} from '../../common/domain/business-code';

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Apply to job ──────────────────────────────────────────

  async apply(userId: number, jobCode: string, dto: ApplyJobDto) {
    const job = await this.prisma.job.findUnique({ where: { jobCode } });
    if (!job || job.status !== JobStatus.ACTIVE) {
      throw new NotFoundException({
        code: 'JOB_NOT_FOUND',
        message: '応募可能な求人が見つかりません。',
      });
    }

    // Check for duplicate application
    const existing = await this.prisma.application.findUnique({
      where: { userId_jobId: { userId, jobId: job.id } },
    });
    if (existing) {
      throw new ConflictException({
        code: 'ALREADY_APPLIED',
        message: 'この求人にはすでに応募済みです。',
      });
    }

    // Capture resume snapshot
    const candidate = await this.prisma.candidate.findUnique({
      where: { userId },
      include: {
        resume: {
          include: {
            educations: true,
            experiences: true,
            skills: true,
            qualifications: true,
          },
        },
      },
    });

    const resumeSnapshot = candidate ? JSON.stringify(candidate) : null;

    try {
      return await this.prisma.$transaction(async (transaction) => {
        const created = await transaction.application.create({
          data: {
            appCode: createTemporaryBusinessCode(14),
            userId,
            jobId: job.id,
            status: ApplicationStatus.PENDING,
            coverLetter: dto.coverLetter,
            resumeSnapshot,
          },
        });

        const coded = await transaction.application.update({
          where: { id: created.id },
          data: { appCode: formatApplicationCode(created.id) },
        });

        await transaction.applicationStatusHistory.create({
          data: {
            applicationId: created.id,
            fromStatus: null,
            toStatus: ApplicationStatus.PENDING,
            changedBy: userId,
          },
        });

        await transaction.job.update({
          where: { id: job.id },
          data: { applyCount: { increment: 1 } },
        });
        await transaction.outboxEvent.create({
          data: {
            aggregateType: 'Application',
            aggregateId: String(coded.id),
            eventType: 'ApplicationSubmitted',
            payload: {
              applicationId: coded.id,
              candidateUserId: userId,
              jobId: job.id,
              status: coded.status,
            },
          },
        });

        return coded;
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException({
          code: 'ALREADY_APPLIED',
          message: 'この求人にはすでに応募済みです。',
        });
      }
      throw error;
    }
  }

  // ── Get my applications (CANDIDATE) ───────────────────────

  async getMyApplications(userId: number) {
    return this.prisma.application.findMany({
      where: { userId },
      orderBy: { appliedAt: 'desc' },
      include: {
        job: {
          select: {
            jobCode: true,
            title: true,
            jobType: true,
            prefecture: true,
            salaryType: true,
            salaryMin: true,
            salaryMax: true,
            company: { select: { name: true, logoUrl: true } },
          },
        },
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    });
  }

  // ── Get single application ─────────────────────────────────

  async getApplication(actor: JwtPayload, applicationCode: string) {
    const application = await this.prisma.application.findUnique({
      where: { appCode: applicationCode },
      include: {
        job: { include: { company: true } },
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!application) {
      throw new NotFoundException({
        code: 'APPLICATION_NOT_FOUND',
        message: '応募が見つかりません。',
      });
    }

    if (actor.role === UserRole.CANDIDATE) {
      if (application.userId !== actor.sub) {
        throw this.applicationForbidden();
      }
    } else if (actor.role === UserRole.AGENT) {
      await this.assertAgentAssignedToCompany(
        actor.sub,
        application.job.companyId,
      );
    } else if (actor.role !== UserRole.ADMIN) {
      throw this.applicationForbidden();
    }

    return application;
  }

  // ── Update application status (AGENT) ─────────────────────

  async updateStatus(
    agentUserId: number,
    applicationCode: string,
    dto: UpdateStatusDto,
  ) {
    const application = await this.prisma.application.findUnique({
      where: { appCode: applicationCode },
    });

    if (!application) {
      throw new NotFoundException({
        code: 'APPLICATION_NOT_FOUND',
        message: '応募が見つかりません。',
      });
    }
    await this.assertAgentAssignedToJob(agentUserId, application.jobId);

    if (application.status === dto.status) {
      throw new BadRequestException({
        code: 'SAME_STATUS',
        message: '現在のステータスと同じです。',
      });
    }
    if (!canAgentTransitionApplication(application.status, dto.status)) {
      throw new BadRequestException({
        code: 'INVALID_STATUS_TRANSITION',
        message: 'この応募ステータスへの変更は許可されていません。',
      });
    }

    return this.prisma.$transaction(async (transaction) => {
      const transition = await transaction.application.updateMany({
        where: { id: application.id, status: application.status },
        data: {
          status: dto.status,
          agentNote: dto.note,
          rejectionReason:
            dto.status === ApplicationStatus.REJECTED ? dto.note : undefined,
        },
      });
      if (transition.count !== 1) {
        throw new ConflictException({
          code: 'APPLICATION_STATUS_CONFLICT',
          message: '応募ステータスが更新されました。再読み込みしてください。',
        });
      }
      await transaction.applicationStatusHistory.create({
        data: {
          applicationId: application.id,
          fromStatus: application.status,
          toStatus: dto.status,
          note: dto.note,
          changedBy: agentUserId,
        },
      });
      await transaction.outboxEvent.create({
        data: {
          aggregateType: 'Application',
          aggregateId: String(application.id),
          eventType: 'ApplicationStatusChanged',
          payload: {
            applicationId: application.id,
            fromStatus: application.status,
            toStatus: dto.status,
            changedByUserId: agentUserId,
          },
        },
      });
      return transaction.application.findUniqueOrThrow({
        where: { id: application.id },
      });
    });
  }

  // ── Withdraw application (CANDIDATE) ─────────────────────

  async withdraw(userId: number, applicationCode: string) {
    const application = await this.prisma.application.findUnique({
      where: { appCode: applicationCode },
    });

    if (!application) {
      throw new NotFoundException({
        code: 'APPLICATION_NOT_FOUND',
        message: '応募が見つかりません。',
      });
    }
    if (application.userId !== userId) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'アクセスが拒否されました。',
      });
    }

    if (!canCandidateWithdrawApplication(application.status)) {
      throw new BadRequestException({
        code: 'CANNOT_WITHDRAW',
        message: 'この応募は取り消しできません。',
      });
    }

    return this.prisma.$transaction(async (transaction) => {
      const transition = await transaction.application.updateMany({
        where: { id: application.id, status: application.status },
        data: { status: ApplicationStatus.WITHDRAWN },
      });
      if (transition.count !== 1) {
        throw new ConflictException({
          code: 'APPLICATION_STATUS_CONFLICT',
          message: '応募ステータスが更新されました。再読み込みしてください。',
        });
      }
      await transaction.applicationStatusHistory.create({
        data: {
          applicationId: application.id,
          fromStatus: application.status,
          toStatus: ApplicationStatus.WITHDRAWN,
          changedBy: userId,
        },
      });
      await transaction.outboxEvent.create({
        data: {
          aggregateType: 'Application',
          aggregateId: String(application.id),
          eventType: 'ApplicationWithdrawn',
          payload: {
            applicationId: application.id,
            fromStatus: application.status,
            withdrawnByUserId: userId,
          },
        },
      });
      return transaction.application.findUniqueOrThrow({
        where: { id: application.id },
      });
    });
  }

  // ── Agent: list all applications for a job ────────────────

  async getJobApplications(agentUserId: number, jobCode: string) {
    const job = await this.prisma.job.findUnique({ where: { jobCode } });
    if (!job) {
      throw new NotFoundException({
        code: 'JOB_NOT_FOUND',
        message: '求人が見つかりません。',
      });
    }
    await this.assertAgentAssignedToCompany(agentUserId, job.companyId);

    return this.prisma.application.findMany({
      where: { jobId: job.id },
      orderBy: { appliedAt: 'desc' },
      include: {
        user: {
          select: {
            email: true,
            candidate: {
              select: {
                userCode: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                japaneseLevel: true,
                yearsOfExperience: true,
              },
            },
          },
        },
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    });
  }

  private async assertAgentAssignedToJob(agentUserId: number, jobId: number) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      select: { companyId: true },
    });
    if (!job) {
      throw new NotFoundException({
        code: 'JOB_NOT_FOUND',
        message: '求人が見つかりません。',
      });
    }
    await this.assertAgentAssignedToCompany(agentUserId, job.companyId);
  }

  private async assertAgentAssignedToCompany(
    agentUserId: number,
    companyId: number,
  ) {
    const agent = await this.prisma.agent.findUnique({
      where: { userId: agentUserId },
      select: { id: true, isActive: true },
    });
    if (!agent || !agent.isActive) {
      throw this.applicationForbidden();
    }
    const assignment = await this.prisma.agentCompany.findUnique({
      where: {
        agentId_companyId: { agentId: agent.id, companyId },
      },
      select: { id: true },
    });
    if (!assignment) {
      throw this.applicationForbidden();
    }
  }

  private applicationForbidden() {
    return new ForbiddenException({
      code: 'FORBIDDEN',
      message: 'アクセスが拒否されました。',
    });
  }
}
