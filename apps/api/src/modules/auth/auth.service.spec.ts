import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService account lifecycle authorization', () => {
  const userFindUnique = jest.fn();
  const prisma = {
    user: { findUnique: userFindUnique },
  } as unknown as PrismaService;
  const service = new AuthService(
    prisma,
    {} as JwtService,
    {} as ConfigService,
  );

  it('does not issue tokens to an inactive account', async () => {
    userFindUnique.mockResolvedValue({
      id: 1,
      email: 'inactive@example.com',
      password: await bcrypt.hash('Password123', 4),
      role: UserRole.CANDIDATE,
      status: UserStatus.INACTIVE,
      emailVerifiedAt: new Date(),
      candidate: { userCode: 'U0000001' },
      company: null,
      agent: null,
      admin: null,
    });

    await expect(
      service.login({
        email: 'inactive@example.com',
        password: 'Password123',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
