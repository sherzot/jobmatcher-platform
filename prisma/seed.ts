import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin user ─────────────────────────────────────────────
  const adminEmail = 'admin@jobmatch.com';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existing) {
    const hashedPassword = await bcrypt.hash('Admin@123456', 12);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
      },
    });

    // Manually set admin code (admin1 pattern)
    await prisma.user.update({
      where: { id: admin.id },
      data: { code: 'admin1' },
    });

    console.log(`✅ Admin created: ${adminEmail} / Admin@123456`);
  } else {
    console.log(`ℹ️  Admin already exists: ${adminEmail}`);
  }

  // ── Demo Agent ─────────────────────────────────────────────
  const agentEmail = 'agent@jobmatch.com';
  const existingAgent = await prisma.user.findUnique({ where: { email: agentEmail } });

  if (!existingAgent) {
    const hashedPassword = await bcrypt.hash('Agent@123456', 12);
    await prisma.user.create({
      data: {
        email: agentEmail,
        password: hashedPassword,
        role: UserRole.AGENT,
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
        agent: {
          create: {
            displayName: '田中 エージェント',
            bio: 'ITエンジニア専門の採用エージェントです。',
            phone: '090-0000-0000',
          },
        },
      },
    });
    console.log(`✅ Demo Agent created: ${agentEmail} / Agent@123456`);
  } else {
    console.log(`ℹ️  Agent already exists: ${agentEmail}`);
  }

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
