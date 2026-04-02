import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';
import { AdminService } from './admin.service';
import { CreateAgentDto } from '../agent/dto/create-agent.dto';
import { Roles } from '../../common/decorators/roles.decorator';

class SetUserStatusDto {
  @ApiProperty({ enum: UserStatus })
  @IsEnum(UserStatus)
  status: UserStatus;
}

@ApiTags('admin')
@Controller('admin')
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ── GET /api/admin/stats ──────────────────────────────────

  @Get('stats')
  @ApiOperation({ summary: 'ダッシュボード統計' })
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // ── User management ────────────────────────────────────────

  @Get('users')
  @ApiOperation({ summary: 'ユーザー一覧' })
  listUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.listUsers(page, limit);
  }

  @Patch('users/:code/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ユーザーステータス変更' })
  setUserStatus(
    @Param('code') code: string,
    @Body() dto: SetUserStatusDto,
  ) {
    return this.adminService.setUserStatus(code, dto.status);
  }

  // ── Agent management ───────────────────────────────────────

  @Post('agents')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'エージェント作成' })
  createAgent(@Body() dto: CreateAgentDto) {
    return this.adminService.createAgent(dto);
  }

  @Get('agents')
  @ApiOperation({ summary: 'エージェント一覧' })
  listAgents() {
    return this.adminService.listAgents();
  }

  // ── Company management ─────────────────────────────────────

  @Get('companies')
  @ApiOperation({ summary: '企業一覧' })
  listCompanies(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.listCompanies(page, limit);
  }

  // ── Agent-company assignment ───────────────────────────────

  @Post('agents/:agentCode/companies/:companyCode')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'エージェントに企業を割り当て' })
  assignAgentToCompany(
    @Param('agentCode') agentCode: string,
    @Param('companyCode') companyCode: string,
  ) {
    return this.adminService.assignAgentToCompany(agentCode, companyCode);
  }

  // ── Job moderation ─────────────────────────────────────────

  @Get('jobs/pending')
  @ApiOperation({ summary: 'レビュー待ち求人一覧' })
  listPendingJobs() {
    return this.adminService.listPendingJobs();
  }

  @Delete('jobs/:code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '求人削除（管理者）' })
  deleteJob(@Param('code') code: string) {
    return this.adminService.deleteJob(code);
  }
}
