import { Module } from '@nestjs/common';
import { AIGovernanceController } from './ai-governance.controller';
import { AIGovernanceService } from './ai-governance.service';

@Module({
  controllers: [AIGovernanceController],
  providers: [AIGovernanceService],
  exports: [AIGovernanceService],
})
export class AIGovernanceModule {}
