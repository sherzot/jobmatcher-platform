import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CompanyStatus, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterCandidateDto } from './dto/register-candidate.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/jwt-payload.type';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ── Register Candidate ─────────────────────────────────────

  async registerCandidate(dto: RegisterCandidateDto) {
    await this.assertEmailUnique(dto.email);

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const verificationCode = this.generateVerificationCode();

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        password: hashedPassword,
        role: UserRole.CANDIDATE,
        status: UserStatus.PENDING_VERIFICATION,
        candidate: {
          create: {
            lastName: dto.lastName,
            firstName: dto.firstName,
          },
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        candidate: { select: { id: true, userCode: true } },
      },
    });

    // TODO: send verification email with verificationCode (notification module)
    this.logger.log(
      `Candidate registered: ${user.email} — verification code: ${verificationCode}`,
    );

    return {
      message: '登録が完了しました。メールをご確認ください。',
      userId: user.id,
      userCode: user.candidate?.userCode,
    };
  }

  // ── Register Company ───────────────────────────────────────
  // Company status starts as PENDING_APPROVAL — agent must approve before login

  async registerCompany(dto: RegisterCompanyDto) {
    await this.assertEmailUnique(dto.email);

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        password: hashedPassword,
        role: UserRole.COMPANY,
        status: UserStatus.PENDING_VERIFICATION,
        company: {
          create: {
            name: dto.companyName,
            nameEn: dto.companyNameEn,
            industry: dto.industry,
            prefecture: dto.prefecture,
            businessRegNumber: dto.businessRegNumber,
            registrationNote: dto.registrationNote,
            status: CompanyStatus.PENDING_APPROVAL,
            isActive: false,
          },
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        company: { select: { id: true, companyCode: true, name: true, status: true } },
      },
    });

    this.logger.log(`Company registered: ${user.email} — awaiting agent approval`);

    // TODO: send notification to all agents (notification module)

    return {
      message:
        '登録が完了しました。担当エージェントが内容を確認後、アカウントが有効化されます。',
      userId: user.id,
      companyId: user.company?.id,
      companyCode: user.company?.companyCode,
    };
  }

  // ── Login (all roles) ──────────────────────────────────────

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
        candidate: { select: { userCode: true } },
        company:   { select: { companyCode: true, status: true } },
        agent:     { select: { agentCode: true } },
        admin:     { select: { adminCode: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'メールアドレスまたはパスワードが正しくありません。',
      });
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'メールアドレスまたはパスワードが正しくありません。',
      });
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException({
        code: 'ACCOUNT_SUSPENDED',
        message: 'このアカウントは停止されています。',
      });
    }

    // Company must be approved by agent before login
    if (user.role === UserRole.COMPANY) {
      const companyStatus = user.company?.status;
      if (companyStatus === CompanyStatus.PENDING_APPROVAL) {
        throw new UnauthorizedException({
          code: 'COMPANY_PENDING_APPROVAL',
          message:
            '担当エージェントが会社情報を審査中です。承認後にログインできます。',
        });
      }
      if (companyStatus === CompanyStatus.REJECTED) {
        throw new ForbiddenException({
          code: 'COMPANY_REJECTED',
          message: '登録が承認されませんでした。詳細はサポートにお問い合わせください。',
        });
      }
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Resolve the business identifier for this role
    const businessCode = this.resolveBusinessCode(user);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      businessCode,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(payload),
      this.signRefreshToken(payload),
    ]);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: await bcrypt.hash(refreshToken, 10),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        businessCode,
        email: user.email,
        role: user.role,
      },
    };
  }

  // ── Refresh tokens ─────────────────────────────────────────

  async refresh(payload: JwtPayload & { refreshToken: string }) {
    const storedTokens = await this.prisma.refreshToken.findMany({
      where: { userId: payload.sub, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    let tokenValid = false;
    for (const stored of storedTokens) {
      if (await bcrypt.compare(payload.refreshToken, stored.token)) {
        tokenValid = true;
        await this.prisma.refreshToken.delete({ where: { id: stored.id } });
        break;
      }
    }

    if (!tokenValid) {
      throw new UnauthorizedException({
        code: 'INVALID_REFRESH_TOKEN',
        message: 'セッションが無効です。再度ログインしてください。',
      });
    }

    const newPayload: JwtPayload = {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      businessCode: payload.businessCode,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(newPayload),
      this.signRefreshToken(newPayload),
    ]);

    await this.prisma.refreshToken.create({
      data: {
        userId: payload.sub,
        token: await bcrypt.hash(refreshToken, 10),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  // ── Logout ─────────────────────────────────────────────────

  async logout(userId: number): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
  }

  // ── Verify email ───────────────────────────────────────────

  async verifyEmail(userId: number, code: string): Promise<void> {
    if (!/^\d{6}$/.test(code)) {
      throw new BadRequestException({
        code: 'INVALID_CODE',
        message: '確認コードが正しくありません。',
      });
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException({ code: 'NOT_FOUND', message: 'ユーザーが見つかりません。' });
    }

    if (user.emailVerifiedAt) {
      throw new BadRequestException({
        code: 'ALREADY_VERIFIED',
        message: 'このメールアドレスはすでに確認済みです。',
      });
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerifiedAt: new Date(),
        // Candidates become ACTIVE immediately; companies stay PENDING_VERIFICATION until agent approves
        status:
          user.role === UserRole.CANDIDATE ? UserStatus.ACTIVE : UserStatus.PENDING_VERIFICATION,
      },
    });
  }

  // ── Private helpers ────────────────────────────────────────

  private resolveBusinessCode(user: {
    role: UserRole;
    candidate?: { userCode: string } | null;
    company?:   { companyCode: string } | null;
    agent?:     { agentCode: string } | null;
    admin?:     { adminCode: string } | null;
  }): string {
    switch (user.role) {
      case UserRole.CANDIDATE: return user.candidate?.userCode ?? '';
      case UserRole.COMPANY:   return user.company?.companyCode ?? '';
      case UserRole.AGENT:     return user.agent?.agentCode ?? '';
      case UserRole.ADMIN:     return user.admin?.adminCode ?? '';
    }
  }

  private async assertEmailUnique(email: string): Promise<void> {
    const existing = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException({
        code: 'EMAIL_TAKEN',
        message: 'このメールアドレスはすでに登録されています。',
      });
    }
  }

  private signAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.config.get<string>('jwt.accessSecret'),
      expiresIn: this.config.get<string>('jwt.accessExpiresIn') as unknown as number,
    });
  }

  private signRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.config.get<string>('jwt.refreshSecret'),
      expiresIn: this.config.get<string>('jwt.refreshExpiresIn') as unknown as number,
    });
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
