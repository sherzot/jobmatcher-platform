import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { JobType } from '@prisma/client';

export class UpdatePreferencesDto {
  @ApiPropertyOptional({ enum: JobType, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(JobType, { each: true })
  desiredJobTypes?: JobType[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  desiredLocations?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  desiredSalaryMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  desiredSalaryMax?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  availableFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isOpenToWork?: boolean;
}
