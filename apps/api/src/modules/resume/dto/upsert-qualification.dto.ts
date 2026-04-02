import {
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

export class UpsertQualificationDto {
  @ApiPropertyOptional({ description: 'Update existing (omit to create)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  id?: number;

  @ApiProperty({ example: '応用情報技術者試験' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ example: '情報処理推進機構' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  issuedBy?: string;

  @ApiPropertyOptional({ example: '2023年06月' })
  @IsOptional()
  @Matches(YEAR_MONTH_REGEX, { message: 'issuedDate must be in YYYY年MM月 format' })
  issuedDate?: string;

  @ApiPropertyOptional({ example: '2026年06月' })
  @IsOptional()
  @Matches(YEAR_MONTH_REGEX, { message: 'expiryDate must be in YYYY年MM月 format' })
  expiryDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
