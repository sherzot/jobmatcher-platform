import { PrismaClient, UserRole, UserStatus, CompanyStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────
// BUSINESS IDENTIFIER generators
// ─────────────────────────────────────────────────────────────
const candidateCode = (id: number) => `U${String(id).padStart(7, '0')}`;
const companyCode   = (id: number) => `C${String(id).padStart(7, '0')}`;
const agentCode     = (id: number) => `A${String(id).padStart(7, '0')}`;
const adminCode     = (id: number) => `admin${id}`;
const jobCode       = (id: number) => `J${String(id).padStart(7, '0')}`;
const appCode       = (id: number) => `APP${String(id).padStart(7, '0')}`;

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin ──────────────────────────────────────────────────
  const adminEmail = 'admin@jobmatch.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hash = await bcrypt.hash('Admin@123456', 12);
    const user = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hash,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
      },
    });

    const admin = await prisma.admin.create({
      data: { userId: user.id, displayName: 'システム管理者', isSuperAdmin: true },
    });

    await prisma.admin.update({
      where: { id: admin.id },
      data: { adminCode: adminCode(admin.id) },
    });

    console.log(`✅ Admin created — ${adminEmail} / Admin@123456 — code: ${adminCode(admin.id)}`);
  } else {
    console.log(`ℹ️  Admin already exists: ${adminEmail}`);
  }

  // ── Agent ──────────────────────────────────────────────────
  const agentEmail = 'agent@jobmatch.com';
  const existingAgent = await prisma.user.findUnique({ where: { email: agentEmail } });

  if (!existingAgent) {
    const hash = await bcrypt.hash('Agent@123456', 12);
    const user = await prisma.user.create({
      data: {
        email: agentEmail,
        password: hash,
        role: UserRole.AGENT,
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
      },
    });

    const agent = await prisma.agent.create({
      data: {
        userId: user.id,
        displayName: '田中 エージェント',
        bio: 'ITエンジニア専門の採用エージェントです。',
        phone: '090-0000-0001',
      },
    });

    await prisma.agent.update({
      where: { id: agent.id },
      data: { agentCode: agentCode(agent.id) },
    });

    console.log(`✅ Agent created — ${agentEmail} / Agent@123456 — code: ${agentCode(agent.id)}`);
  } else {
    console.log(`ℹ️  Agent already exists: ${agentEmail}`);
  }

  // ── Demo Company (approved) ────────────────────────────────
  const companyEmail = 'company@jobmatch.com';
  const existingCompany = await prisma.user.findUnique({ where: { email: companyEmail } });

  if (!existingCompany) {
    const hash = await bcrypt.hash('Company@123456', 12);
    const user = await prisma.user.create({
      data: {
        email: companyEmail,
        password: hash,
        role: UserRole.COMPANY,
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
      },
    });

    const agent = await prisma.agent.findFirst();

    const company = await prisma.company.create({
      data: {
        userId: user.id,
        name: 'テックスタート株式会社',
        nameEn: 'TechStart Inc.',
        industry: 'IT・ソフトウェア',
        employeeCount: '50-100',
        prefecture: '東京都',
        city: '渋谷区',
        status: CompanyStatus.APPROVED,
        approvedAt: new Date(),
        approvedByAgentId: agent?.id ?? null,
        businessRegNumber: '1234567890123',
        isActive: true,
      },
    });

    await prisma.company.update({
      where: { id: company.id },
      data: { companyCode: companyCode(company.id) },
    });

    console.log(`✅ Company created — ${companyEmail} / Company@123456 — code: ${companyCode(company.id)}`);
  } else {
    console.log(`ℹ️  Company already exists: ${companyEmail}`);
  }

  // ── Demo Candidate ─────────────────────────────────────────
  const candidateEmail = 'user@jobmatch.com';
  const existingCandidate = await prisma.user.findUnique({ where: { email: candidateEmail } });

  if (!existingCandidate) {
    const hash = await bcrypt.hash('User@123456', 12);
    const user = await prisma.user.create({
      data: {
        email: candidateEmail,
        password: hash,
        role: UserRole.CANDIDATE,
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
      },
    });

    const candidate = await prisma.candidate.create({
      data: {
        userId: user.id,
        firstName: '太郎',
        lastName: '山田',
        firstNameKana: 'タロウ',
        lastNameKana: 'ヤマダ',
        phone: '090-0000-0002',
        country: 'Japan',
        prefecture: '東京都',
        city: '新宿区',
        japaneseLevel: 'NATIVE',
        yearsOfExperience: 5,
        isOpenToWork: true,
      },
    });

    await prisma.candidate.update({
      where: { id: candidate.id },
      data: { userCode: candidateCode(candidate.id) },
    });

    console.log(`✅ Candidate created — ${candidateEmail} / User@123456 — code: ${candidateCode(candidate.id)}`);
  } else {
    console.log(`ℹ️  Candidate already exists: ${candidateEmail}`);
  }

  console.log('\n✅ Seed completed!');
  console.log('\nCode generation rules:');
  console.log('  Candidate → U0000001 (U + 7-digit zero-padded id)');
  console.log('  Company   → C0000001 (C + 7-digit zero-padded id)');
  console.log('  Agent     → A0000001 (A + 7-digit zero-padded id)');
  console.log('  Admin     → admin1   (admin + sequential id)');
  console.log('  Job       → J0000001 (J + 7-digit zero-padded id)');
  console.log('  Application → APP0000001 (APP + 7-digit zero-padded id)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
