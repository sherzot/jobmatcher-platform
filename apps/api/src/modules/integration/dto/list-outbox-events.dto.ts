import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { OutboxEventStatus } from '@prisma/client';

export class ListOutboxEventsDto {
  @IsOptional()
  @IsEnum(OutboxEventStatus)
  status?: OutboxEventStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
