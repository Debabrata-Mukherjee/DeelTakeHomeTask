import { Inject, Injectable } from '@nestjs/common';
import { Profile } from '../entities/profile.entity';
import { PROFILE_REPOSITORY } from 'src/core/constants';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: typeof Profile,
  ) {}

  async findProfileById(id: number): Promise<Profile | null> {
    return this.profileRepository.findOne({ where: { id } });
  }
}
