import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

class ReviewJobDto {
  @ApiPropertyOptional({ enum: ['approve', 'reject'] })
  action: 'approve' | 'reject';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

@ApiTags('job')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  // ── GET /api/job (public) ─────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: '求人検索（認証不要）' })
  searchJobs(@Query() dto: SearchJobsDto) {
    return this.jobService.searchJobs(dto);
  }

  // ── GET /api/job/:code (public) ───────────────────────────

  @Public()
  @Get(':code')
  @ApiOperation({ summary: '求人詳細取得（認証不要）' })
  getJob(@Param('code') code: string) {
    return this.jobService.getJob(code);
  }

  // ── POST /api/job (COMPANY or AGENT) ──────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.COMPANY, UserRole.AGENT)
  @ApiOperation({ summary: '求人作成' })
  createJob(@CurrentUser() user: JwtPayload, @Body() dto: CreateJobDto) {
    return this.jobService.createJob(user, dto);
  }

  // ── PATCH /api/job/:code/activate (COMPANY or AGENT) ──────

  @Patch(':code/activate')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.COMPANY, UserRole.AGENT)
  @ApiOperation({ summary: '求人を公開する' })
  activateJob(@CurrentUser() user: JwtPayload, @Param('code') code: string) {
    return this.jobService.toggleJobStatus(user, code, true);
  }

  // ── PATCH /api/job/:code/pause (COMPANY or AGENT) ─────────

  @Patch(':code/pause')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.COMPANY, UserRole.AGENT)
  @ApiOperation({ summary: '求人を停止する' })
  pauseJob(@CurrentUser() user: JwtPayload, @Param('code') code: string) {
    return this.jobService.toggleJobStatus(user, code, false);
  }

  // ── PATCH /api/job/:code/review (AGENT only) ──────────────

  @Patch(':code/review')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.AGENT)
  @ApiBody({ type: ReviewJobDto })
  @ApiOperation({ summary: 'アルバイト求人の審査（承認・却下）' })
  reviewJob(
    @CurrentUser() user: JwtPayload,
    @Param('code') code: string,
    @Body() body: ReviewJobDto,
  ) {
    return this.jobService.reviewJob(user.sub, code, body.action, body.rejectionReason);
  }
}
