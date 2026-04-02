import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ── GET /api/user/me ──────────────────────────────────────

  @Get('me')
  @ApiOperation({ summary: '自分のプロフィール取得' })
  getMyProfile(@CurrentUser() user: JwtPayload) {
    return this.userService.getMyProfile(user.sub);
  }

  // ── PATCH /api/user/profile ───────────────────────────────

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.CANDIDATE)
  @ApiOperation({ summary: '基本情報の更新（候補者のみ）' })
  updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(user.sub, dto);
  }

  // ── PATCH /api/user/preferences ───────────────────────────

  @Patch('preferences')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.CANDIDATE)
  @ApiOperation({ summary: '希望条件の更新（候補者のみ）' })
  updatePreferences(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdatePreferencesDto,
  ) {
    return this.userService.updatePreferences(user.sub, dto);
  }
}
