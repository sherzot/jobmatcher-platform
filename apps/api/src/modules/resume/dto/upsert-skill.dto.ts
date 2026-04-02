import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpsertSkillDto {
  @ApiPropertyOptional({ description: 'Update existing (omit to create)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  id?: number;

  @ApiProperty({ example: 'TypeScript' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: '上級' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  level?: string;

  @ApiPropertyOptional({ example: 3, description: '経験年数' })
  @IsOptional()
  @IsInt()
  @Min(0)
  yearsUsed?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
