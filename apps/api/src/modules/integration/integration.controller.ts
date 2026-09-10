import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { ListOutboxEventsDto } from './dto/list-outbox-events.dto';
import { IntegrationQueryService } from './integration-query.service';

@ApiTags('integration')
@Controller('integration')
@Roles(UserRole.ADMIN)
export class IntegrationController {
  constructor(private readonly queries: IntegrationQueryService) {}

  @Get('outbox')
  @ApiOperation({ summary: 'Outbox delivery metadata list (admin only)' })
  listOutboxEvents(@Query() query: ListOutboxEventsDto) {
    return this.queries.listOutboxEvents(query.status, query.page, query.limit);
  }
}
