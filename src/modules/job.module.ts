import { Module } from '@nestjs/common';
import { JobService } from '../services/job.service';
import { AuthGuard } from 'src/core/guards/profile.guard';
import { ProfileModule } from './profile.module';
import { DatabaseModule } from 'src/core/database/database.module';
import { JobController } from 'src/controllers/job.controller';
import { jobProviders } from 'src/providers/job.provider';

@Module({
  imports: [ProfileModule, DatabaseModule],
  providers: [JobService, AuthGuard, ...jobProviders],
  controllers: [JobController],
  exports: [JobService],
})
export class JobModule {}
