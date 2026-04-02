import { UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: number;           // users.id
  email: string;
  role: UserRole;
  businessCode: string;  // U0000001 | C0000001 | A0000001 | admin1
}
