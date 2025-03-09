import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestWithProfile } from '../types/requestWithProfile';

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithProfile>();
    const profile = request.profile;

    if (!profile || profile.type !== 'admin') {
      throw new UnauthorizedException('Access denied: Admins only');
    }
    return true;
  }
}
