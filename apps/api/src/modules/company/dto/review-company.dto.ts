import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import type { CompanyReviewAction } from '../domain/company-approval.policy';

export class ReviewCompanyDto {
  @ApiProperty({ enum: ['approve', 'reject'] })
  @IsIn(['approve', 'reject'])
  action: CompanyReviewAction;

  @ApiPropertyOptional({
    description: 'Required when rejecting a company registration',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
