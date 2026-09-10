import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { AIGovernanceService } from './ai-governance.service';
import { ListAIExecutionsDto } from './dto/list-ai-executions.dto';

@ApiTags('ai-governance')
@Controller('ai-governance')
@Roles(UserRole.ADMIN)
export class AIGovernanceController {
  constructor(private readonly aiGovernanceService: AIGovernanceService) {}

  @Get('executions')
  @ApiOperation({ summary: 'AI execution audit metadata list (admin only)' })
  listExecutions(@Query() query: ListAIExecutionsDto) {
    return this.aiGovernanceService.listExecutions(query.page, query.limit);
  }
}
