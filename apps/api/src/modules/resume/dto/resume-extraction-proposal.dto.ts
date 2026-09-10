import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { YEAR_MONTH_PATTERN } from '../domain/year-month';

class ExtractedEducationDto {
  @IsString()
  @MaxLength(200)
  schoolName: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  faculty?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  degree?: string;

  @IsString()
  @Matches(YEAR_MONTH_PATTERN, {
    message: 'startDate must be in YYYY年MM月 format',
  })
  startDate: string;

  @IsOptional()
  @Matches(YEAR_MONTH_PATTERN, {
    message: 'endDate must be in YYYY年MM月 format',
  })
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isGraduated?: boolean;
}

class ExtractedExperienceDto {
  @IsString()
  @MaxLength(200)
  companyName: string;

  @IsString()
  @MaxLength(200)
  position: string;

  @IsString()
  @Matches(YEAR_MONTH_PATTERN, {
    message: 'startDate must be in YYYY年MM月 format',
  })
  startDate: string;

  @IsOptional()
  @Matches(YEAR_MONTH_PATTERN, {
    message: 'endDate must be in YYYY年MM月 format',
  })
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  achievements?: string;
}

class ExtractedSkillDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  level?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsUsed?: number;
}

class ExtractedQualificationDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  issuedBy?: string;

  @IsOptional()
  @Matches(YEAR_MONTH_PATTERN, {
    message: 'issuedDate must be in YYYY年MM月 format',
  })
  issuedDate?: string;

  @IsOptional()
  @Matches(YEAR_MONTH_PATTERN, {
    message: 'expiryDate must be in YYYY年MM月 format',
  })
  expiryDate?: string;
}

export class ResumeExtractionProposalDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsArray()
  @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @Type(() => ExtractedEducationDto)
  educations: ExtractedEducationDto[];

  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => ExtractedExperienceDto)
  experiences: ExtractedExperienceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExtractedSkillDto)
  skills: ExtractedSkillDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExtractedQualificationDto)
  qualifications: ExtractedQualificationDto[];
}
