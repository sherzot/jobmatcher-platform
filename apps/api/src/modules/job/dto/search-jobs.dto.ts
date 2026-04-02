import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { JapaneseLevel, JobType, SalaryType, WorkLocation } from '@prisma/client';

export class SearchJobsDto {
  @ApiPropertyOptional({ description: 'Full-text search query' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ enum: JobType })
  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType;

  @ApiPropertyOptional({ enum: WorkLocation })
  @IsOptional()
  @IsEnum(WorkLocation)
  workLocation?: WorkLocation;

  @ApiPropertyOptional({ enum: SalaryType })
  @IsOptional()
  @IsEnum(SalaryType)
  salaryType?: SalaryType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prefecture?: string;

  @ApiPropertyOptional({ enum: JapaneseLevel })
  @IsOptional()
  @IsEnum(JapaneseLevel)
  japaneseLevel?: JapaneseLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMin?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
