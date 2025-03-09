import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/profile.guard';
import { ProfileService } from 'src/services/profile.service';

@UseGuards(AuthGuard)
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id')
  async getProfileById(@Param('id') id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.profileService.findProfileById(id);
  }
}
