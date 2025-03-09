import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './modules/profile.module';
import { DatabaseModule } from './core/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ContractModule } from './modules/contract.module';
import { JobModule } from './modules/job.module';
import { BalanceModule } from './modules/balance.module';
import { AnalyticsModule } from './modules/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ProfileModule,
    ContractModule,
    JobModule,
    BalanceModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
