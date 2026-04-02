import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ApplicationService } from './application.service';
import { ApplyJobDto } from './dto/apply-job.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@ApiTags('application')
@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  // ── POST /api/application/job/:code/apply ─────────────────

  @Post('job/:code/apply')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.CANDIDATE)
  @ApiOperation({ summary: '求人に応募する' })
  apply(
    @CurrentUser() user: JwtPayload,
    @Param('code') code: string,
    @Body() dto: ApplyJobDto,
  ) {
    return this.applicationService.apply(user.sub, code, dto);
  }

  // ── GET /api/application/me ───────────────────────────────

  @Get('me')
  @Roles(UserRole.CANDIDATE)
  @ApiOperation({ summary: '自分の応募一覧' })
  getMyApplications(@CurrentUser() user: JwtPayload) {
    return this.applicationService.getMyApplications(user.sub);
  }

  // ── GET /api/application/:code ────────────────────────────

  @Get(':code')
  @ApiOperation({ summary: '応募詳細取得' })
  getApplication(
    @CurrentUser() user: JwtPayload,
    @Param('code') code: string,
  ) {
    return this.applicationService.getApplication(user, code);
  }

  // ── PATCH /api/application/:code/status (AGENT) ───────────

  @Patch(':code/status')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: '応募ステータスの更新（エージェントのみ）' })
  updateStatus(
    @CurrentUser() user: JwtPayload,
    @Param('code') code: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.applicationService.updateStatus(user.sub, code, dto);
  }

  // ── PATCH /api/application/:code/withdraw (CANDIDATE) ─────

  @Patch(':code/withdraw')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.CANDIDATE)
  @ApiOperation({ summary: '応募を取り消す' })
  withdraw(
    @CurrentUser() user: JwtPayload,
    @Param('code') code: string,
  ) {
    return this.applicationService.withdraw(user.sub, code);
  }

  // ── GET /api/application/job/:code (AGENT) ────────────────

  @Get('job/:code')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: '求人への応募者一覧（エージェントのみ）' })
  getJobApplications(
    @CurrentUser() user: JwtPayload,
    @Param('code') code: string,
  ) {
    return this.applicationService.getJobApplications(user.sub, code);
  }
}
