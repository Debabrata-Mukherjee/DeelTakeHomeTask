import { Module } from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { profileProviders } from '../providers/profile.provider';
import { ProfileController } from 'src/controllers/profile.controller';

@Module({
  providers: [ProfileService, ...profileProviders],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
