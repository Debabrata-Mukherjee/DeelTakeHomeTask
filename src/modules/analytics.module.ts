import { Module } from '@nestjs/common';
import { AnalyticsController } from 'src/controllers/analytics.controller';
import { IsAdminGuard } from 'src/core/guards/isAdmin.guard';
import { profileProviders } from 'src/providers/profile.provider';
import { AnalyticsService } from 'src/services/analytics.service';
import { ProfileModule } from './profile.module';
import { DatabaseModule } from 'src/core/database/database.module';

@Module({
  imports: [ProfileModule, DatabaseModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, IsAdminGuard, ...profileProviders],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
