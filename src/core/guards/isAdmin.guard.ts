import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestWithProfile } from '../types/requestWithProfile';
import { ProfileService } from 'src/services/profile.service';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(private readonly profileService: ProfileService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithProfile>();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const profileId = parseInt(request.headers['profile_id'], 10);

    if (isNaN(profileId) || profileId <= 0) {
      throw new UnauthorizedException('Missing or invalid profile ID');
    }

    const profile = await this.profileService.findProfileById(profileId);
    if (!profile) {
      throw new UnauthorizedException('Unauthorized Access');
    }

    if (profile.dataValues.type !== 'admin') {
      throw new UnauthorizedException('Access denied: Admins only');
    }

    request.profile = profile;
    return true;
  }
}
