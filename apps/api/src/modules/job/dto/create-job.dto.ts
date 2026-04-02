import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JapaneseLevel, JobType, SalaryType, WorkLocation } from '@prisma/client';

export class CreateJobDto {
  @ApiProperty({ example: 'バックエンドエンジニア（TypeScript / NestJS）' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  title: string;

  @ApiProperty({ example: '業務内容の詳細...' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  benefits?: string;

  @ApiProperty({ enum: JobType, default: JobType.FULL_TIME })
  @IsEnum(JobType)
  jobType: JobType;

  @ApiProperty({ enum: WorkLocation, default: WorkLocation.ONSITE })
  @IsEnum(WorkLocation)
  workLocation: WorkLocation;

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

  @ApiProperty({ enum: SalaryType, default: SalaryType.ANNUAL })
  @IsEnum(SalaryType)
  salaryType: SalaryType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMax?: number;

  @ApiPropertyOptional({ enum: JapaneseLevel })
  @IsOptional()
  @IsEnum(JapaneseLevel)
  japaneseLevel?: JapaneseLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  visaSponsorship?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  minExperience?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  closesAt?: string;
}
