/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { RequestWithProfile } from '../types/requestWithProfile';
import { ProfileService } from 'src/services/profile.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly profileService: ProfileService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithProfile>();

    const profileId = parseInt(request.headers['profile_id'], 10);

    if (isNaN(profileId) || profileId <= 0) {
      throw new UnauthorizedException('Missing or invalid profile ID');
    }

    const profile = await this.profileService.findProfileById(profileId);
    if (!profile) {
      throw new UnauthorizedException('Unauthorized Access');
    }

    request.profile = profile;
    return true;
  }
}
