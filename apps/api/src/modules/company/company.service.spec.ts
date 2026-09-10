import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CompanyStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CompanyService } from './company.service';

describe('CompanyService activation authorization', () => {
  const agentFindUnique = jest.fn();
  const companyFindUnique = jest.fn();
  const assignmentFindUnique = jest.fn();
  const companyUpdate = jest.fn();
  const prisma = {
    agent: { findUnique: agentFindUnique },
    company: {
      findUnique: companyFindUnique,
      update: companyUpdate,
    },
    agentCompany: { findUnique: assignmentFindUnique },
  } as unknown as PrismaService;
  const service = new CompanyService(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
    agentFindUnique.mockResolvedValue({ id: 2, isActive: true });
  });

  it('does not let the legacy activation command bypass approval', async () => {
    companyFindUnique.mockResolvedValue({
      id: 9,
      status: CompanyStatus.PENDING_APPROVAL,
    });

    await expect(
      service.setCompanyActive(20, 'C0000009', true),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(assignmentFindUnique).not.toHaveBeenCalled();
    expect(companyUpdate).not.toHaveBeenCalled();
  });

  it('denies an unassigned agent from changing an approved company', async () => {
    companyFindUnique.mockResolvedValue({
      id: 9,
      status: CompanyStatus.APPROVED,
    });
    assignmentFindUnique.mockResolvedValue(null);

    await expect(
      service.setCompanyActive(20, 'C0000009', false),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(companyUpdate).not.toHaveBeenCalled();
  });
});
