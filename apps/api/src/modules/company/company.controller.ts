import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // ── GET /api/company/me ───────────────────────────────────

  @Get('me')
  @Roles(UserRole.COMPANY)
  @ApiOperation({ summary: '自社情報取得' })
  getMyCompany(@CurrentUser() user: JwtPayload) {
    return this.companyService.getMyCompany(user.sub);
  }

  // ── PATCH /api/company/me ─────────────────────────────────

  @Patch('me')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.COMPANY)
  @ApiOperation({ summary: '自社情報更新' })
  updateCompany(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companyService.updateCompany(user.sub, dto);
  }

  // ── GET /api/company/:code (AGENT / ADMIN) ────────────────

  @Get(':code')
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @ApiOperation({ summary: '会社詳細取得（エージェント・管理者）' })
  getCompanyByCode(@Param('code') code: string) {
    return this.companyService.getCompanyByCode(code);
  }

  // ── PATCH /api/company/:code/activate (AGENT) ─────────────

  @Patch(':code/activate')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: '企業を有効化する（エージェントのみ）' })
  activateCompany(
    @CurrentUser() user: JwtPayload,
    @Param('code') code: string,
  ) {
    return this.companyService.setCompanyActive(user.sub, code, true);
  }

  // ── PATCH /api/company/:code/deactivate (AGENT) ───────────

  @Patch(':code/deactivate')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: '企業を無効化する（エージェントのみ）' })
  deactivateCompany(
    @CurrentUser() user: JwtPayload,
    @Param('code') code: string,
  ) {
    return this.companyService.setCompanyActive(user.sub, code, false);
  }
}
