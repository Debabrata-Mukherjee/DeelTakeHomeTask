import { PROFILE_REPOSITORY } from 'src/core/constants';
import { Profile } from '../entities/profile.entity';

export const profileProviders = [
  {
    provide: PROFILE_REPOSITORY,
    useValue: Profile,
  },
];
