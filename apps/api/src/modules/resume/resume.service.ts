import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ResumeProcessingStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PrismaService } from '../../prisma/prisma.service';
import { UpsertEducationDto } from './dto/upsert-education.dto';
import { UpsertExperienceDto } from './dto/upsert-experience.dto';
import { UpsertSkillDto } from './dto/upsert-skill.dto';
import { UpsertQualificationDto } from './dto/upsert-qualification.dto';
import {
  canAddResumeSection,
  RESUME_SECTION_LIMITS,
} from './domain/resume-limits.policy';
import { RequestResumeExtractionDto } from './dto/request-resume-extraction.dto';
import { ResumeExtractionProposalDto } from './dto/resume-extraction-proposal.dto';
import { canTransitionResumeProcessing } from './domain/resume-processing.policy';

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
    const count = await this.prisma.education.count({
      where: { resumeId: resume.id },
    });
    if (!canAddResumeSection('education', count)) {
      throw new BadRequestException({
        code: 'EDUCATION_LIMIT',
        message: `学歴は最大${RESUME_SECTION_LIMITS.education}件まで登録できます。`,
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

    const count = await this.prisma.experience.count({
      where: { resumeId: resume.id },
    });
    if (!canAddResumeSection('experience', count)) {
      throw new BadRequestException({
        code: 'EXPERIENCE_LIMIT',
        message: `経歴は最大${RESUME_SECTION_LIMITS.experience}件まで登録できます。`,
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

    const count = await this.prisma.skill.count({
      where: { resumeId: resume.id },
    });
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

    const count = await this.prisma.qualification.count({
      where: { resumeId: resume.id },
    });
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

  async requestExtraction(userId: number, dto: RequestResumeExtractionDto) {
    const candidate = await this.getCandidateOrThrow(userId);
    const resume = await this.getResumeOrCreate(userId);
    const idempotencyKey = `${candidate.id}:${dto.idempotencyKey}`;
    const existing = await this.prisma.resumeProcessingRun.findUnique({
      where: { idempotencyKey },
    });
    if (existing) {
      return this.assertSameExtractionRequest(existing, dto);
    }

    try {
      return await this.prisma.$transaction(async (transaction) => {
        const run = await transaction.resumeProcessingRun.create({
          data: {
            candidateId: candidate.id,
            resumeId: resume.id,
            documentObjectKey: dto.documentObjectKey,
            documentSha256: dto.documentSha256,
            idempotencyKey,
          },
        });
        await transaction.outboxEvent.create({
          data: {
            aggregateType: 'ResumeProcessingRun',
            aggregateId: run.id,
            eventType: 'ResumeParsingRequested',
            payload: {
              runId: run.id,
              candidateId: candidate.id,
              resumeId: resume.id,
              documentObjectKey: dto.documentObjectKey,
              documentSha256: dto.documentSha256,
            },
          },
        });
        return run;
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const concurrent = await this.prisma.resumeProcessingRun.findUnique({
          where: { idempotencyKey },
        });
        if (concurrent) {
          return this.assertSameExtractionRequest(concurrent, dto);
        }
      }
      throw error;
    }
  }

  async getExtraction(userId: number, runId: string) {
    const candidate = await this.getCandidateOrThrow(userId);
    const run = await this.prisma.resumeProcessingRun.findFirst({
      where: { id: runId, candidateId: candidate.id },
      select: {
        id: true,
        status: true,
        proposal: true,
        proposalVersion: true,
        errorCode: true,
        requestedAt: true,
        processingAt: true,
        proposedAt: true,
        confirmedAt: true,
        rejectedAt: true,
        failedAt: true,
        expiresAt: true,
      },
    });
    if (!run) {
      throw new NotFoundException({
        code: 'EXTRACTION_NOT_FOUND',
        message: '履歴書解析処理が見つかりません。',
      });
    }
    return run;
  }

  async markExtractionProcessing(runId: string, aiExecutionId?: string) {
    return this.transitionProcessingRun(
      runId,
      [ResumeProcessingStatus.REQUESTED],
      ResumeProcessingStatus.PROCESSING,
      { processingAt: new Date(), aiExecutionId },
    );
  }

  async recordExtractionProposal(
    runId: string,
    input: unknown,
    aiExecutionId?: string,
  ) {
    const proposal = await this.validateExtractionProposal(input);
    return this.prisma.$transaction(async (transaction) => {
      const transition = await transaction.resumeProcessingRun.updateMany({
        where: { id: runId, status: ResumeProcessingStatus.PROCESSING },
        data: {
          status: ResumeProcessingStatus.PROPOSED,
          proposal: this.proposalToJson(proposal),
          proposedAt: new Date(),
          aiExecutionId,
          errorCode: null,
        },
      });
      if (transition.count !== 1) {
        throw this.extractionConflict();
      }
      await transaction.outboxEvent.create({
        data: {
          aggregateType: 'ResumeProcessingRun',
          aggregateId: runId,
          eventType: 'ResumeExtractionProposed',
          payload: { runId },
        },
      });
      return transaction.resumeProcessingRun.findUniqueOrThrow({
        where: { id: runId },
      });
    });
  }

  async failExtraction(runId: string, errorCode: string) {
    return this.transitionProcessingRun(
      runId,
      [ResumeProcessingStatus.REQUESTED, ResumeProcessingStatus.PROCESSING],
      ResumeProcessingStatus.FAILED,
      { errorCode: errorCode.slice(0, 100), failedAt: new Date() },
    );
  }

  async confirmExtraction(userId: number, runId: string) {
    const candidate = await this.getCandidateOrThrow(userId);
    const run = await this.prisma.resumeProcessingRun.findFirst({
      where: { id: runId, candidateId: candidate.id },
    });
    if (!run) {
      throw new NotFoundException({
        code: 'EXTRACTION_NOT_FOUND',
        message: '履歴書解析処理が見つかりません。',
      });
    }
    if (run.status !== ResumeProcessingStatus.PROPOSED || !run.proposal) {
      throw new ConflictException({
        code: 'EXTRACTION_NOT_CONFIRMABLE',
        message: 'この履歴書解析結果は確定できません。',
      });
    }
    const proposal = await this.validateExtractionProposal(run.proposal);

    return this.prisma.$transaction(async (transaction) => {
      const transition = await transaction.resumeProcessingRun.updateMany({
        where: {
          id: run.id,
          candidateId: candidate.id,
          status: ResumeProcessingStatus.PROPOSED,
        },
        data: {
          status: ResumeProcessingStatus.CONFIRMED,
          confirmedAt: new Date(),
        },
      });
      if (transition.count !== 1) {
        throw this.extractionConflict();
      }

      await transaction.education.deleteMany({
        where: { resumeId: run.resumeId },
      });
      await transaction.experience.deleteMany({
        where: { resumeId: run.resumeId },
      });
      await transaction.skill.deleteMany({ where: { resumeId: run.resumeId } });
      await transaction.qualification.deleteMany({
        where: { resumeId: run.resumeId },
      });

      if (proposal.educations.length > 0) {
        await transaction.education.createMany({
          data: proposal.educations.map((education, sortOrder) => ({
            resumeId: run.resumeId,
            ...education,
            isGraduated: education.isGraduated ?? true,
            sortOrder,
          })),
        });
      }
      if (proposal.experiences.length > 0) {
        await transaction.experience.createMany({
          data: proposal.experiences.map((experience, sortOrder) => ({
            resumeId: run.resumeId,
            ...experience,
            isCurrent: experience.isCurrent ?? false,
            sortOrder,
          })),
        });
      }
      if (proposal.skills.length > 0) {
        await transaction.skill.createMany({
          data: proposal.skills.map((skill, sortOrder) => ({
            resumeId: run.resumeId,
            ...skill,
            sortOrder,
          })),
        });
      }
      if (proposal.qualifications.length > 0) {
        await transaction.qualification.createMany({
          data: proposal.qualifications.map((qualification, sortOrder) => ({
            resumeId: run.resumeId,
            ...qualification,
            sortOrder,
          })),
        });
      }
      if (proposal.title) {
        await transaction.resume.update({
          where: { id: run.resumeId },
          data: { title: proposal.title },
        });
      }
      await transaction.outboxEvent.create({
        data: {
          aggregateType: 'Resume',
          aggregateId: String(run.resumeId),
          eventType: 'ResumeExtractionConfirmed',
          payload: {
            runId: run.id,
            resumeId: run.resumeId,
            candidateId: candidate.id,
          },
        },
      });

      return transaction.resume.findUniqueOrThrow({
        where: { id: run.resumeId },
        include: {
          educations: { orderBy: { sortOrder: 'asc' } },
          experiences: { orderBy: { sortOrder: 'asc' } },
          skills: { orderBy: { sortOrder: 'asc' } },
          qualifications: { orderBy: { sortOrder: 'asc' } },
        },
      });
    });
  }

  async rejectExtraction(userId: number, runId: string) {
    const candidate = await this.getCandidateOrThrow(userId);
    return this.prisma.$transaction(async (transaction) => {
      const transition = await transaction.resumeProcessingRun.updateMany({
        where: {
          id: runId,
          candidateId: candidate.id,
          status: ResumeProcessingStatus.PROPOSED,
        },
        data: {
          status: ResumeProcessingStatus.REJECTED,
          rejectedAt: new Date(),
        },
      });
      if (transition.count !== 1) {
        throw new ConflictException({
          code: 'EXTRACTION_NOT_REJECTABLE',
          message: 'この履歴書解析結果は却下できません。',
        });
      }
      await transaction.outboxEvent.create({
        data: {
          aggregateType: 'ResumeProcessingRun',
          aggregateId: runId,
          eventType: 'ResumeExtractionRejected',
          payload: { runId, candidateId: candidate.id },
        },
      });
      return { id: runId, status: ResumeProcessingStatus.REJECTED };
    });
  }

  // ── Private helpers ────────────────────────────────────────

  private async transitionProcessingRun(
    runId: string,
    from: ResumeProcessingStatus[],
    to: ResumeProcessingStatus,
    data: Prisma.ResumeProcessingRunUncheckedUpdateManyInput = {},
  ) {
    if (!from.every((status) => canTransitionResumeProcessing(status, to))) {
      throw this.extractionConflict();
    }

    const transition = await this.prisma.resumeProcessingRun.updateMany({
      where: {
        id: runId,
        status: { in: from },
      },
      data: {
        ...data,
        status: to,
      },
    });
    if (transition.count !== 1) {
      throw this.extractionConflict();
    }

    return this.prisma.resumeProcessingRun.findUniqueOrThrow({
      where: { id: runId },
    });
  }

  private async validateExtractionProposal(input: unknown) {
    const proposal = plainToInstance(ResumeExtractionProposalDto, input);
    const errors = await validate(proposal, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      throw new BadRequestException({
        code: 'INVALID_EXTRACTION_PROPOSAL',
        message: '履歴書解析結果の形式が不正です。',
      });
    }
    return proposal;
  }

  private proposalToJson(
    proposal: ResumeExtractionProposalDto,
  ): Prisma.InputJsonObject {
    return {
      ...(proposal.title === undefined ? {} : { title: proposal.title }),
      educations: proposal.educations.map((education) => ({
        schoolName: education.schoolName,
        ...(education.faculty === undefined
          ? {}
          : { faculty: education.faculty }),
        ...(education.degree === undefined ? {} : { degree: education.degree }),
        startDate: education.startDate,
        ...(education.endDate === undefined
          ? {}
          : { endDate: education.endDate }),
        ...(education.isGraduated === undefined
          ? {}
          : { isGraduated: education.isGraduated }),
      })),
      experiences: proposal.experiences.map((experience) => ({
        companyName: experience.companyName,
        position: experience.position,
        startDate: experience.startDate,
        ...(experience.endDate === undefined
          ? {}
          : { endDate: experience.endDate }),
        ...(experience.isCurrent === undefined
          ? {}
          : { isCurrent: experience.isCurrent }),
        ...(experience.description === undefined
          ? {}
          : { description: experience.description }),
        ...(experience.achievements === undefined
          ? {}
          : { achievements: experience.achievements }),
      })),
      skills: proposal.skills.map((skill) => ({
        name: skill.name,
        ...(skill.level === undefined ? {} : { level: skill.level }),
        ...(skill.yearsUsed === undefined
          ? {}
          : { yearsUsed: skill.yearsUsed }),
      })),
      qualifications: proposal.qualifications.map((qualification) => ({
        name: qualification.name,
        ...(qualification.issuedBy === undefined
          ? {}
          : { issuedBy: qualification.issuedBy }),
        ...(qualification.issuedDate === undefined
          ? {}
          : { issuedDate: qualification.issuedDate }),
        ...(qualification.expiryDate === undefined
          ? {}
          : { expiryDate: qualification.expiryDate }),
      })),
    };
  }

  private extractionConflict() {
    return new ConflictException({
      code: 'EXTRACTION_STATE_CONFLICT',
      message: '履歴書解析処理の状態が変更されています。',
    });
  }

  private assertSameExtractionRequest<
    T extends { documentObjectKey: string; documentSha256: string },
  >(run: T, dto: RequestResumeExtractionDto): T {
    if (
      run.documentObjectKey !== dto.documentObjectKey ||
      run.documentSha256 !== dto.documentSha256
    ) {
      throw new ConflictException({
        code: 'IDEMPOTENCY_KEY_REUSED',
        message: '同じ冪等性キーを異なる履歴書には使用できません。',
      });
    }
    return run;
  }

  private async getCandidateOrThrow(userId: number) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { userId },
    });
    if (!candidate) {
      throw new NotFoundException({
        code: 'CANDIDATE_NOT_FOUND',
        message: '候補者プロフィールが見つかりません。',
      });
    }
    return candidate;
  }

  private async getResumeOrCreate(userId: number) {
    const candidate = await this.getCandidateOrThrow(userId);
    let resume = await this.prisma.resume.findUnique({
      where: { candidateId: candidate.id },
    });
    if (!resume) {
      resume = await this.prisma.resume.create({
        data: { candidateId: candidate.id },
      });
    }
    return resume;
  }

  private async getResumeOrThrow(userId: number) {
    const candidate = await this.getCandidateOrThrow(userId);
    const resume = await this.prisma.resume.findUnique({
      where: { candidateId: candidate.id },
    });
    if (!resume) {
      throw new NotFoundException({
        code: 'RESUME_NOT_FOUND',
        message: '職務経歴書が見つかりません。',
      });
    }
    return resume;
  }

  private async assertEducationOwnership(
    educationId: number,
    resumeId: number,
  ) {
    const record = await this.prisma.education.findUnique({
      where: { id: educationId },
    });
    if (!record || record.resumeId !== resumeId) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'このデータにアクセスする権限がありません。',
      });
    }
  }

  private async assertExperienceOwnership(
    experienceId: number,
    resumeId: number,
  ) {
    const record = await this.prisma.experience.findUnique({
      where: { id: experienceId },
    });
    if (!record || record.resumeId !== resumeId) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'このデータにアクセスする権限がありません。',
      });
    }
  }

  private async assertSkillOwnership(skillId: number, resumeId: number) {
    const record = await this.prisma.skill.findUnique({
      where: { id: skillId },
    });
    if (!record || record.resumeId !== resumeId) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'このデータにアクセスする権限がありません。',
      });
    }
  }

  private async assertQualificationOwnership(
    qualificationId: number,
    resumeId: number,
  ) {
    const record = await this.prisma.qualification.findUnique({
      where: { id: qualificationId },
    });
    if (!record || record.resumeId !== resumeId) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'このデータにアクセスする権限がありません。',
      });
    }
  }
}
