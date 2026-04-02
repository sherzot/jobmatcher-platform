import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Get my profile ─────────────────────────────────────────

  async getMyProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        code: true,
        email: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
        lastLoginAt: true,
        createdAt: true,
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'ユーザーが見つかりません。' });
    }

    return user;
  }

  // ── Update profile (基本情報) ──────────────────────────────

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });

    if (!profile) {
      throw new NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'プロフィールが見つかりません。' });
    }

    const updated = await this.prisma.profile.update({
      where: { userId },
      data: {
        ...(dto.firstName !== undefined && { firstName: dto.firstName }),
        ...(dto.lastName !== undefined && { lastName: dto.lastName }),
        ...(dto.firstNameKana !== undefined && { firstNameKana: dto.firstNameKana }),
        ...(dto.lastNameKana !== undefined && { lastNameKana: dto.lastNameKana }),
        ...(dto.dateOfBirth !== undefined && { dateOfBirth: new Date(dto.dateOfBirth) }),
        ...(dto.gender !== undefined && { gender: dto.gender }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
        ...(dto.country !== undefined && { country: dto.country }),
        ...(dto.prefecture !== undefined && { prefecture: dto.prefecture }),
        ...(dto.city !== undefined && { city: dto.city }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.japaneseLevel !== undefined && { japaneseLevel: dto.japaneseLevel }),
        ...(dto.englishLevel !== undefined && { englishLevel: dto.englishLevel }),
        ...(dto.nationality !== undefined && { nationality: dto.nationality }),
        ...(dto.visaStatus !== undefined && { visaStatus: dto.visaStatus }),
        ...(dto.visaExpiry !== undefined && { visaExpiry: new Date(dto.visaExpiry) }),
        ...(dto.yearsOfExperience !== undefined && { yearsOfExperience: dto.yearsOfExperience }),
        ...(dto.currentSalary !== undefined && { currentSalary: dto.currentSalary }),
        ...(dto.selfIntroduction !== undefined && { selfIntroduction: dto.selfIntroduction }),
        ...(dto.motivation !== undefined && { motivation: dto.motivation }),
        ...(dto.approach !== undefined && { approach: dto.approach }),
        ...(dto.strengths !== undefined && { strengths: dto.strengths }),
      },
    });

    return updated;
  }

  // ── Update preferences (希望条件) ──────────────────────────

  async updatePreferences(userId: number, dto: UpdatePreferencesDto) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });

    if (!profile) {
      throw new NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'プロフィールが見つかりません。' });
    }

    const updated = await this.prisma.profile.update({
      where: { userId },
      data: {
        ...(dto.desiredJobTypes !== undefined && {
          desiredJobTypes: JSON.stringify(dto.desiredJobTypes),
        }),
        ...(dto.desiredLocations !== undefined && {
          desiredLocations: JSON.stringify(dto.desiredLocations),
        }),
        ...(dto.desiredSalaryMin !== undefined && { desiredSalaryMin: dto.desiredSalaryMin }),
        ...(dto.desiredSalaryMax !== undefined && { desiredSalaryMax: dto.desiredSalaryMax }),
        ...(dto.availableFrom !== undefined && { availableFrom: new Date(dto.availableFrom) }),
        ...(dto.isOpenToWork !== undefined && { isOpenToWork: dto.isOpenToWork }),
      },
    });

    return updated;
  }
}
