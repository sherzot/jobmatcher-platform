import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const YEAR_MONTH_REGEX = /^\d{4}年\d{2}月$/;

export class UpsertEducationDto {
  @ApiPropertyOptional({ description: 'Update existing (omit to create)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  id?: number;

  @ApiProperty({ example: '東京大学' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  schoolName: string;

  @ApiPropertyOptional({ example: '工学部情報工学科' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  faculty?: string;

  @ApiPropertyOptional({ example: '学士' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  degree?: string;

  @ApiProperty({ example: '2018年04月' })
  @IsNotEmpty()
  @Matches(YEAR_MONTH_REGEX, { message: 'startDate must be in YYYY年MM月 format' })
  startDate: string;

  @ApiPropertyOptional({ example: '2022年03月' })
  @IsOptional()
  @Matches(YEAR_MONTH_REGEX, { message: 'endDate must be in YYYY年MM月 format' })
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isGraduated?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
