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

export class UpsertExperienceDto {
  @ApiPropertyOptional({ description: 'Update existing (omit to create)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  id?: number;

  @ApiProperty({ example: '株式会社テクノロジー' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  companyName: string;

  @ApiProperty({ example: 'バックエンドエンジニア' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  position: string;

  @ApiPropertyOptional({ example: '50-100人', description: '従業員数' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  employeeCount?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  achievements?: string;

  @ApiProperty({ example: '2022年04月' })
  @IsNotEmpty()
  @Matches(YEAR_MONTH_REGEX, { message: 'startDate must be in YYYY年MM月 format' })
  startDate: string;

  @ApiPropertyOptional({ example: '2024年03月' })
  @IsOptional()
  @Matches(YEAR_MONTH_REGEX, { message: 'endDate must be in YYYY年MM月 format' })
  endDate?: string;

  @ApiPropertyOptional({ description: '現在もここで勤務中' })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

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
