import { Module } from '@nestjs/common';
import { InboxService } from './inbox/inbox.service';
import { IntegrationController } from './integration.controller';
import { IntegrationQueryService } from './integration-query.service';
import { OutboxDispatcherService } from './outbox/outbox-dispatcher.service';

@Module({
  controllers: [IntegrationController],
  providers: [InboxService, IntegrationQueryService, OutboxDispatcherService],
  exports: [InboxService, OutboxDispatcherService],
})
export class IntegrationModule {}
