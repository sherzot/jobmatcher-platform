import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { JapaneseLevel, VisaStatus } from '@prisma/client';

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstNameKana?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastNameKana?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  gender?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  avatarUrl?: string;

  // Location
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  prefecture?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  // Language
  @ApiPropertyOptional({ enum: JapaneseLevel })
  @IsOptional()
  @IsEnum(JapaneseLevel)
  japaneseLevel?: JapaneseLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  englishLevel?: string;

  // Visa
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nationality?: string;

  @ApiPropertyOptional({ enum: VisaStatus })
  @IsOptional()
  @IsEnum(VisaStatus)
  visaStatus?: VisaStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  visaExpiry?: string;

  // Career
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(50)
  yearsOfExperience?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  currentSalary?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  selfIntroduction?: string;

  // Motivation & Strengths
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  motivation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  approach?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  strengths?: string;
}
