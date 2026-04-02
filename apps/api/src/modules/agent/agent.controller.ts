import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AgentService } from './agent.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@ApiTags('agent')
@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  // ── GET /api/agent/me ─────────────────────────────────────

  @Get('me')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'エージェントプロフィール取得' })
  getMyProfile(@CurrentUser() user: JwtPayload) {
    return this.agentService.getMyProfile(user.sub);
  }

  // ── GET /api/agent/me/companies ───────────────────────────

  @Get('me/companies')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: '担当企業一覧（エージェント）' })
  getAssignedCompanies(@CurrentUser() user: JwtPayload) {
    return this.agentService.getAssignedCompanies(user.sub);
  }

  // ── POST /api/agent/company/:code/assign ──────────────────

  @Post('company/:code/assign')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '企業をエージェントに割り当て（管理者のみ）' })
  assignCompany(
    @CurrentUser() user: JwtPayload,
    @Param('code') companyCode: string,
    @Body('isPrimary') isPrimary?: boolean,
  ) {
    return this.agentService.assignCompany(user.sub, companyCode, isPrimary);
  }
}
