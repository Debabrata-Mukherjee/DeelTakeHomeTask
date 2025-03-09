import { Profile } from 'src/entities/profile.entity';

export interface RequestWithProfile extends Request {
  profile?: Profile;
}
