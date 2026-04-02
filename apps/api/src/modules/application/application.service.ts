import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationStatus, JobStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ApplyJobDto } from './dto/apply-job.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Apply to job ──────────────────────────────────────────

  async apply(userId: number, jobCode: string, dto: ApplyJobDto) {
    const job = await this.prisma.job.findUnique({ where: { code: jobCode } });
    if (!job || job.status !== JobStatus.ACTIVE) {
      throw new NotFoundException({ code: 'JOB_NOT_FOUND', message: '応募可能な求人が見つかりません。' });
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
    const profile = await this.prisma.profile.findUnique({
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

    const resumeSnapshot = profile ? JSON.stringify(profile) : null;

    const application = await this.prisma.application.create({
      data: {
        userId,
        jobId: job.id,
        status: ApplicationStatus.PENDING,
        coverLetter: dto.coverLetter,
        resumeSnapshot,
      },
    });

    // Record initial status history
    await this.prisma.applicationStatusHistory.create({
      data: {
        applicationId: application.id,
        fromStatus: null,
        toStatus: ApplicationStatus.PENDING,
        changedBy: userId,
      },
    });

    // Increment job apply count
    await this.prisma.job.update({
      where: { id: job.id },
      data: { applyCount: { increment: 1 } },
    });

    // TODO: trigger notification queue (email to agent + in-app)

    return application;
  }

  // ── Get my applications (CANDIDATE) ───────────────────────

  async getMyApplications(userId: number) {
    return this.prisma.application.findMany({
      where: { userId },
      orderBy: { appliedAt: 'desc' },
      include: {
        job: {
          select: {
            code: true,
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
      where: { code: applicationCode },
      include: {
        job: { include: { company: true } },
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!application) {
      throw new NotFoundException({ code: 'APPLICATION_NOT_FOUND', message: '応募が見つかりません。' });
    }

    // CANDIDATE can only see own applications
    if (actor.role === UserRole.CANDIDATE && application.userId !== actor.sub) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'アクセスが拒否されました。' });
    }

    return application;
  }

  // ── Update application status (AGENT) ─────────────────────

  async updateStatus(agentUserId: number, applicationCode: string, dto: UpdateStatusDto) {
    const application = await this.prisma.application.findUnique({
      where: { code: applicationCode },
    });

    if (!application) {
      throw new NotFoundException({ code: 'APPLICATION_NOT_FOUND', message: '応募が見つかりません。' });
    }

    if (application.status === dto.status) {
      throw new BadRequestException({
        code: 'SAME_STATUS',
        message: '現在のステータスと同じです。',
      });
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.application.update({
        where: { id: application.id },
        data: {
          status: dto.status,
          agentNote: dto.note,
          rejectionReason:
            dto.status === ApplicationStatus.REJECTED ? dto.note : undefined,
        },
      }),
      this.prisma.applicationStatusHistory.create({
        data: {
          applicationId: application.id,
          fromStatus: application.status,
          toStatus: dto.status,
          note: dto.note,
          changedBy: agentUserId,
        },
      }),
    ]);

    // TODO: trigger notification queue (email + in-app to candidate)

    return updated;
  }

  // ── Withdraw application (CANDIDATE) ─────────────────────

  async withdraw(userId: number, applicationCode: string) {
    const application = await this.prisma.application.findUnique({
      where: { code: applicationCode },
    });

    if (!application) {
      throw new NotFoundException({ code: 'APPLICATION_NOT_FOUND', message: '応募が見つかりません。' });
    }
    if (application.userId !== userId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'アクセスが拒否されました。' });
    }

    const terminal: ApplicationStatus[] = [
      ApplicationStatus.REJECTED,
      ApplicationStatus.WITHDRAWN,
      ApplicationStatus.ACCEPTED,
    ];
    if (terminal.includes(application.status)) {
      throw new BadRequestException({
        code: 'CANNOT_WITHDRAW',
        message: 'この応募は取り消しできません。',
      });
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.application.update({
        where: { id: application.id },
        data: { status: ApplicationStatus.WITHDRAWN },
      }),
      this.prisma.applicationStatusHistory.create({
        data: {
          applicationId: application.id,
          fromStatus: application.status,
          toStatus: ApplicationStatus.WITHDRAWN,
          changedBy: userId,
        },
      }),
    ]);

    return updated;
  }

  // ── Agent: list all applications for a job ────────────────

  async getJobApplications(agentUserId: number, jobCode: string) {
    const job = await this.prisma.job.findUnique({ where: { code: jobCode } });
    if (!job) {
      throw new NotFoundException({ code: 'JOB_NOT_FOUND', message: '求人が見つかりません。' });
    }

    return this.prisma.application.findMany({
      where: { jobId: job.id },
      orderBy: { appliedAt: 'desc' },
      include: {
        user: {
          select: {
            code: true,
            email: true,
            profile: {
              select: {
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
}
