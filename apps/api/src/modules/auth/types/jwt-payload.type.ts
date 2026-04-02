import { UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: number;       // userId
  email: string;
  role: UserRole;
  code: string;      // U0000001 | A0000001 | C0000001
}
