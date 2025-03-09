import { Module } from '@nestjs/common';
import { BalanceController } from 'src/controllers/balance.controller';
import { AuthGuard } from 'src/core/guards/profile.guard';
import { BalanceService } from 'src/services/balance.service';
import { ProfileModule } from './profile.module';
import { profileProviders } from 'src/providers/profile.provider';
import { DatabaseModule } from 'src/core/database/database.module';

@Module({
  imports: [ProfileModule, DatabaseModule],
  providers: [BalanceService, AuthGuard, ...profileProviders],
  controllers: [BalanceController],
  exports: [BalanceService],
})
export class BalanceModule {}
