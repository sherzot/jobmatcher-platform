import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AgentService } from '../agent/agent.service';
import { CreateAgentDto } from '../agent/dto/create-agent.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly agentService: AgentService,
  ) {}

  // ── Dashboard stats ────────────────────────────────────────

  async getDashboardStats() {
    const [totalUsers, totalCompanies, totalJobs, totalApplications, pendingCompanies, pendingJobs] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.company.count(),
        this.prisma.job.count({ where: { status: { not: 'DELETED' } } }),
        this.prisma.application.count(),
        this.prisma.company.count({ where: { isActive: false } }),
        this.prisma.job.count({ where: { status: 'PENDING_REVIEW' } }),
      ]);

    return {
      totalUsers,
      totalCompanies,
      totalJobs,
      totalApplications,
      pendingCompanies,
      pendingJobs,
    };
  }

  // ── User management ────────────────────────────────────────

  async listUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, code: true, email: true, role: true, status: true,
          emailVerifiedAt: true, lastLoginAt: true, createdAt: true,
          profile: { select: { firstName: true, lastName: true } },
        },
      }),
      this.prisma.user.count(),
    ]);
    return { items, total, page, limit };
  }

  async setUserStatus(userCode: string, status: UserStatus) {
    const user = await this.prisma.user.findUnique({ where: { code: userCode } });
    if (!user) {
      throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'ユーザーが見つかりません。' });
    }

    return this.prisma.user.update({ where: { code: userCode }, data: { status } });
  }

  // ── Agent management ───────────────────────────────────────

  async createAgent(dto: CreateAgentDto) {
    return this.agentService.createAgent(dto);
  }

  async listAgents() {
    return this.agentService.listAgents();
  }

  // ── Company management ─────────────────────────────────────

  async listCompanies(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.company.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { code: true, email: true, status: true } },
          agentCompanies: {
            include: { agent: { select: { code: true, displayName: true } } },
          },
        },
      }),
      this.prisma.company.count(),
    ]);
    return { items, total, page, limit };
  }

  // ── Job moderation ─────────────────────────────────────────

  async listPendingJobs() {
    return this.prisma.job.findMany({
      where: { status: 'PENDING_REVIEW' },
      orderBy: { createdAt: 'asc' },
      include: {
        company: { select: { code: true, name: true } },
      },
    });
  }

  async deleteJob(jobCode: string) {
    const job = await this.prisma.job.findUnique({ where: { code: jobCode } });
    if (!job) {
      throw new NotFoundException({ code: 'JOB_NOT_FOUND', message: '求人が見つかりません。' });
    }
    if (job.status === 'DELETED') {
      throw new BadRequestException({ code: 'ALREADY_DELETED', message: 'この求人はすでに削除されています。' });
    }
    return this.prisma.job.update({ where: { code: jobCode }, data: { status: 'DELETED' } });
  }

  // ── Agent-company assignment ───────────────────────────────

  async assignAgentToCompany(agentCode: string, companyCode: string) {
    const agent = await this.prisma.agent.findUnique({ where: { code: agentCode } });
    if (!agent) {
      throw new NotFoundException({ code: 'AGENT_NOT_FOUND', message: 'エージェントが見つかりません。' });
    }

    const agentUser = await this.prisma.user.findUnique({ where: { id: agent.userId } });
    if (!agentUser) {
      throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'ユーザーが見つかりません。' });
    }

    return this.agentService.assignCompany(agentUser.id, companyCode, false);
  }
}
