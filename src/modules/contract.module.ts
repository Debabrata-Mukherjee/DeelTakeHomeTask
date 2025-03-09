import { Module } from '@nestjs/common';
import { ContractService } from '../services/contract.service';
import { contractProviders } from '../providers/contract.provider';
import { ProfileModule } from './profile.module';
import { AuthGuard } from 'src/core/guards/profile.guard';
import { ContractController } from 'src/controllers/contract.controller';

@Module({
  imports: [ProfileModule],
  providers: [ContractService, AuthGuard, ...contractProviders],
  controllers: [ContractController],
  exports: [ContractService],
})
export class ContractModule {}
