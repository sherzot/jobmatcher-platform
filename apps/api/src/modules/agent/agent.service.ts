import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAgentDto } from './dto/create-agent.dto';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AgentService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Admin: create agent ────────────────────────────────────

  async createAgent(dto: CreateAgentDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException({
        code: 'EMAIL_TAKEN',
        message: 'このメールアドレスはすでに登録されています。',
      });
    }

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        password: hashedPassword,
        role: UserRole.AGENT,
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
        agent: {
          create: {
            displayName: dto.displayName,
            bio: dto.bio,
            phone: dto.phone,
          },
        },
      },
      select: {
        id: true,
        code: true,
        email: true,
        role: true,
        agent: { select: { id: true, code: true, displayName: true } },
      },
    });

    return user;
  }

  // ── Get agent profile ──────────────────────────────────────

  async getMyProfile(userId: number) {
    const agent = await this.prisma.agent.findUnique({
      where: { userId },
      include: {
        agentCompanies: {
          include: {
            company: {
              select: {
                id: true, code: true, name: true, logoUrl: true,
                industry: true, isActive: true, isVerified: true,
              },
            },
          },
        },
      },
    });

    if (!agent) {
      throw new NotFoundException({ code: 'AGENT_NOT_FOUND', message: 'エージェントが見つかりません。' });
    }

    return agent;
  }

  // ── Assign company to agent ────────────────────────────────

  async assignCompany(agentUserId: number, companyCode: string, isPrimary = false) {
    const agent = await this.prisma.agent.findUnique({ where: { userId: agentUserId } });
    if (!agent) {
      throw new NotFoundException({ code: 'AGENT_NOT_FOUND', message: 'エージェントが見つかりません。' });
    }

    const company = await this.prisma.company.findUnique({ where: { code: companyCode } });
    if (!company) {
      throw new NotFoundException({ code: 'COMPANY_NOT_FOUND', message: '会社が見つかりません。' });
    }

    return this.prisma.agentCompany.upsert({
      where: { agentId_companyId: { agentId: agent.id, companyId: company.id } },
      create: { agentId: agent.id, companyId: company.id, isPrimary },
      update: { isPrimary },
    });
  }

  // ── List all agents (Admin) ────────────────────────────────

  async listAgents() {
    return this.prisma.agent.findMany({
      include: {
        user: { select: { code: true, email: true, status: true } },
        agentCompanies: {
          include: { company: { select: { code: true, name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Create job on behalf of company (Agent) ───────────────

  async getAssignedCompanies(agentUserId: number) {
    const agent = await this.prisma.agent.findUnique({ where: { userId: agentUserId } });
    if (!agent) {
      throw new NotFoundException({ code: 'AGENT_NOT_FOUND', message: 'エージェントが見つかりません。' });
    }

    return this.prisma.agentCompany.findMany({
      where: { agentId: agent.id },
      include: {
        company: {
          include: {
            jobs: {
              where: { status: { not: 'DELETED' } },
              orderBy: { createdAt: 'desc' },
              select: {
                code: true, title: true, status: true, jobType: true,
                applyCount: true, publishedAt: true,
              },
            },
          },
        },
      },
    });
  }
}
