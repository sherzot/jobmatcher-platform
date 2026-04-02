import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ApplyJobDto {
  @ApiPropertyOptional({ description: '志望動機・カバーレター' })
  @IsOptional()
  @IsString()
  coverLetter?: string;
}
