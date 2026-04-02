import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole, UserStatus } from '@prisma/client';
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
        profile: {
          create: {
            lastName: dto.lastName,
            firstName: dto.firstName,
          },
        },
      },
      select: { id: true, code: true, email: true, role: true },
    });

    // TODO: send verification email with code (notification module)
    this.logger.log(`Candidate registered: ${user.email} — verification code: ${verificationCode}`);

    return {
      message: '登録が完了しました。メールをご確認ください。',
      userId: user.id,
      code: user.code,
    };
  }

  // ── Register Company ───────────────────────────────────────

  async registerCompany(dto: RegisterCompanyDto) {
    await this.assertEmailUnique(dto.email);

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const verificationCode = this.generateVerificationCode();

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
            isVerified: false,
            isActive: false, // active only after agent verifies
          },
        },
      },
      select: {
        id: true,
        code: true,
        email: true,
        role: true,
        company: { select: { id: true, code: true, name: true } },
      },
    });

    this.logger.log(`Company registered: ${user.email} — awaiting agent verification`);
    // TODO: notify admins/agents about new company registration

    return {
      message: '登録が完了しました。担当エージェントが内容を確認後、アカウントが有効化されます。',
      userId: user.id,
      companyId: user.company?.id,
      companyCode: user.company?.code,
    };
  }

  // ── Login (all roles) ──────────────────────────────────────

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      select: {
        id: true,
        code: true,
        email: true,
        password: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
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

    // COMPANY accounts need agent verification before login
    if (user.role === UserRole.COMPANY && user.status === UserStatus.PENDING_VERIFICATION) {
      throw new UnauthorizedException({
        code: 'PENDING_VERIFICATION',
        message: '担当エージェントがアカウントを確認中です。確認完了後にログインできます。',
      });
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      code: user.code,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(payload),
      this.signRefreshToken(payload),
    ]);

    // Store hashed refresh token
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
        code: user.code,
        email: user.email,
        role: user.role,
      },
    };
  }

  // ── Refresh tokens ─────────────────────────────────────────

  async refresh(payload: JwtPayload & { refreshToken: string }) {
    // Verify refresh token exists and is not expired
    const storedTokens = await this.prisma.refreshToken.findMany({
      where: {
        userId: payload.sub,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    let tokenValid = false;
    for (const stored of storedTokens) {
      if (await bcrypt.compare(payload.refreshToken, stored.token)) {
        tokenValid = true;
        // Rotate: delete old token
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
      code: payload.code,
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
    // Invalidate all refresh tokens for this user
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
  }

  // ── Verify email ───────────────────────────────────────────

  async verifyEmail(userId: number, code: string): Promise<void> {
    // In production: look up code from Redis/DB
    // For now: accept any 6-digit code (dev mode)
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
        status: user.role === UserRole.CANDIDATE ? UserStatus.ACTIVE : UserStatus.PENDING_VERIFICATION,
      },
    });
  }

  // ── Private helpers ────────────────────────────────────────

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
