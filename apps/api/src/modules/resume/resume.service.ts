import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpsertEducationDto } from './dto/upsert-education.dto';
import { UpsertExperienceDto } from './dto/upsert-experience.dto';
import { UpsertSkillDto } from './dto/upsert-skill.dto';
import { UpsertQualificationDto } from './dto/upsert-qualification.dto';

const MAX_EDUCATIONS = 3;
const MAX_EXPERIENCES = 10;

@Injectable()
export class ResumeService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Get resume ─────────────────────────────────────────────

  async getMyResume(userId: number) {
    const candidate = await this.getCandidateOrThrow(userId);

    const resume = await this.prisma.resume.findUnique({
      where: { candidateId: candidate.id },
      include: {
        educations: { orderBy: { sortOrder: 'asc' } },
        experiences: { orderBy: { sortOrder: 'asc' } },
        skills: { orderBy: { sortOrder: 'asc' } },
        qualifications: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!resume) {
      // Auto-create empty resume on first access
      return this.prisma.resume.create({
        data: { candidateId: candidate.id },
        include: {
          educations: true,
          experiences: true,
          skills: true,
          qualifications: true,
        },
      });
    }

    return resume;
  }

  // ── Education ──────────────────────────────────────────────

  async upsertEducation(userId: number, dto: UpsertEducationDto) {
    const resume = await this.getResumeOrCreate(userId);

    if (dto.id) {
      // Update
      await this.assertEducationOwnership(dto.id, resume.id);
      return this.prisma.education.update({
        where: { id: dto.id },
        data: {
          schoolName: dto.schoolName,
          faculty: dto.faculty,
          degree: dto.degree,
          startDate: dto.startDate,
          endDate: dto.endDate,
          isGraduated: dto.isGraduated ?? true,
          description: dto.description,
          sortOrder: dto.sortOrder ?? 0,
        },
      });
    }

    // Create — enforce max 3
    const count = await this.prisma.education.count({ where: { resumeId: resume.id } });
    if (count >= MAX_EDUCATIONS) {
      throw new BadRequestException({
        code: 'EDUCATION_LIMIT',
        message: `学歴は最大${MAX_EDUCATIONS}件まで登録できます。`,
      });
    }

    return this.prisma.education.create({
      data: {
        resumeId: resume.id,
        schoolName: dto.schoolName,
        faculty: dto.faculty,
        degree: dto.degree,
        startDate: dto.startDate,
        endDate: dto.endDate,
        isGraduated: dto.isGraduated ?? true,
        description: dto.description,
        sortOrder: dto.sortOrder ?? count,
      },
    });
  }

  async deleteEducation(userId: number, educationId: number) {
    const resume = await this.getResumeOrThrow(userId);
    await this.assertEducationOwnership(educationId, resume.id);
    await this.prisma.education.delete({ where: { id: educationId } });
  }

  // ── Experience ─────────────────────────────────────────────

  async upsertExperience(userId: number, dto: UpsertExperienceDto) {
    const resume = await this.getResumeOrCreate(userId);

    if (dto.id) {
      await this.assertExperienceOwnership(dto.id, resume.id);
      return this.prisma.experience.update({
        where: { id: dto.id },
        data: {
          companyName: dto.companyName,
          position: dto.position,
          employeeCount: dto.employeeCount,
          startDate: dto.startDate,
          endDate: dto.endDate,
          isCurrent: dto.isCurrent ?? false,
          description: dto.description,
          achievements: dto.achievements,
          sortOrder: dto.sortOrder ?? 0,
        },
      });
    }

    const count = await this.prisma.experience.count({ where: { resumeId: resume.id } });
    if (count >= MAX_EXPERIENCES) {
      throw new BadRequestException({
        code: 'EXPERIENCE_LIMIT',
        message: `経歴は最大${MAX_EXPERIENCES}件まで登録できます。`,
      });
    }

    return this.prisma.experience.create({
      data: {
        resumeId: resume.id,
        companyName: dto.companyName,
        position: dto.position,
        employeeCount: dto.employeeCount,
        startDate: dto.startDate,
        endDate: dto.endDate,
        isCurrent: dto.isCurrent ?? false,
        description: dto.description,
        achievements: dto.achievements,
        sortOrder: dto.sortOrder ?? count,
      },
    });
  }

  async deleteExperience(userId: number, experienceId: number) {
    const resume = await this.getResumeOrThrow(userId);
    await this.assertExperienceOwnership(experienceId, resume.id);
    await this.prisma.experience.delete({ where: { id: experienceId } });
  }

  // ── Skill ──────────────────────────────────────────────────

  async upsertSkill(userId: number, dto: UpsertSkillDto) {
    const resume = await this.getResumeOrCreate(userId);

    if (dto.id) {
      await this.assertSkillOwnership(dto.id, resume.id);
      return this.prisma.skill.update({
        where: { id: dto.id },
        data: {
          name: dto.name,
          level: dto.level,
          yearsUsed: dto.yearsUsed,
          sortOrder: dto.sortOrder ?? 0,
        },
      });
    }

    const count = await this.prisma.skill.count({ where: { resumeId: resume.id } });
    return this.prisma.skill.create({
      data: {
        resumeId: resume.id,
        name: dto.name,
        level: dto.level,
        yearsUsed: dto.yearsUsed,
        sortOrder: dto.sortOrder ?? count,
      },
    });
  }

  async deleteSkill(userId: number, skillId: number) {
    const resume = await this.getResumeOrThrow(userId);
    await this.assertSkillOwnership(skillId, resume.id);
    await this.prisma.skill.delete({ where: { id: skillId } });
  }

  // ── Qualification ──────────────────────────────────────────

  async upsertQualification(userId: number, dto: UpsertQualificationDto) {
    const resume = await this.getResumeOrCreate(userId);

    if (dto.id) {
      await this.assertQualificationOwnership(dto.id, resume.id);
      return this.prisma.qualification.update({
        where: { id: dto.id },
        data: {
          name: dto.name,
          issuedBy: dto.issuedBy,
          issuedDate: dto.issuedDate,
          expiryDate: dto.expiryDate,
          sortOrder: dto.sortOrder ?? 0,
        },
      });
    }

    const count = await this.prisma.qualification.count({ where: { resumeId: resume.id } });
    return this.prisma.qualification.create({
      data: {
        resumeId: resume.id,
        name: dto.name,
        issuedBy: dto.issuedBy,
        issuedDate: dto.issuedDate,
        expiryDate: dto.expiryDate,
        sortOrder: dto.sortOrder ?? count,
      },
    });
  }

  async deleteQualification(userId: number, qualificationId: number) {
    const resume = await this.getResumeOrThrow(userId);
    await this.assertQualificationOwnership(qualificationId, resume.id);
    await this.prisma.qualification.delete({ where: { id: qualificationId } });
  }

  // ── Private helpers ────────────────────────────────────────

  private async getCandidateOrThrow(userId: number) {
    const candidate = await this.prisma.candidate.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException({ code: 'CANDIDATE_NOT_FOUND', message: '候補者プロフィールが見つかりません。' });
    }
    return candidate;
  }

  private async getResumeOrCreate(userId: number) {
    const candidate = await this.getCandidateOrThrow(userId);
    let resume = await this.prisma.resume.findUnique({ where: { candidateId: candidate.id } });
    if (!resume) {
      resume = await this.prisma.resume.create({ data: { candidateId: candidate.id } });
    }
    return resume;
  }

  private async getResumeOrThrow(userId: number) {
    const candidate = await this.getCandidateOrThrow(userId);
    const resume = await this.prisma.resume.findUnique({ where: { candidateId: candidate.id } });
    if (!resume) {
      throw new NotFoundException({ code: 'RESUME_NOT_FOUND', message: '職務経歴書が見つかりません。' });
    }
    return resume;
  }

  private async assertEducationOwnership(educationId: number, resumeId: number) {
    const record = await this.prisma.education.findUnique({ where: { id: educationId } });
    if (!record || record.resumeId !== resumeId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'このデータにアクセスする権限がありません。' });
    }
  }

  private async assertExperienceOwnership(experienceId: number, resumeId: number) {
    const record = await this.prisma.experience.findUnique({ where: { id: experienceId } });
    if (!record || record.resumeId !== resumeId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'このデータにアクセスする権限がありません。' });
    }
  }

  private async assertSkillOwnership(skillId: number, resumeId: number) {
    const record = await this.prisma.skill.findUnique({ where: { id: skillId } });
    if (!record || record.resumeId !== resumeId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'このデータにアクセスする権限がありません。' });
    }
  }

  private async assertQualificationOwnership(qualificationId: number, resumeId: number) {
    const record = await this.prisma.qualification.findUnique({ where: { id: qualificationId } });
    if (!record || record.resumeId !== resumeId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'このデータにアクセスする権限がありません。' });
    }
  }
}
