import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ResumeService } from './resume.service';
import { UpsertEducationDto } from './dto/upsert-education.dto';
import { UpsertExperienceDto } from './dto/upsert-experience.dto';
import { UpsertSkillDto } from './dto/upsert-skill.dto';
import { UpsertQualificationDto } from './dto/upsert-qualification.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@ApiTags('resume')
@Controller('resume')
@Roles(UserRole.CANDIDATE)
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  // ── GET /api/resume ────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: '職務経歴書の取得' })
  getMyResume(@CurrentUser() user: JwtPayload) {
    return this.resumeService.getMyResume(user.sub);
  }

  // ── Education ──────────────────────────────────────────────

  @Post('education')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '学歴 追加・更新（最大3件）' })
  upsertEducation(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpsertEducationDto,
  ) {
    return this.resumeService.upsertEducation(user.sub, dto);
  }

  @Delete('education/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '学歴 削除' })
  deleteEducation(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.resumeService.deleteEducation(user.sub, id);
  }

  // ── Experience ─────────────────────────────────────────────

  @Post('experience')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '経歴 追加・更新（最大10件）' })
  upsertExperience(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpsertExperienceDto,
  ) {
    return this.resumeService.upsertExperience(user.sub, dto);
  }

  @Delete('experience/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '経歴 削除' })
  deleteExperience(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.resumeService.deleteExperience(user.sub, id);
  }

  // ── Skill ──────────────────────────────────────────────────

  @Post('skill')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'スキル 追加・更新' })
  upsertSkill(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpsertSkillDto,
  ) {
    return this.resumeService.upsertSkill(user.sub, dto);
  }

  @Delete('skill/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'スキル 削除' })
  deleteSkill(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.resumeService.deleteSkill(user.sub, id);
  }

  // ── Qualification ──────────────────────────────────────────

  @Post('qualification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '資格 追加・更新' })
  upsertQualification(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpsertQualificationDto,
  ) {
    return this.resumeService.upsertQualification(user.sub, dto);
  }

  @Delete('qualification/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '資格 削除' })
  deleteQualification(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.resumeService.deleteQualification(user.sub, id);
  }
}
