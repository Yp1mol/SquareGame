import {
  Injectable,
  UnauthorizedException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';

interface JwtPayload {
  id?: string | number;
  sub?: string | number;
  username?: string;
  [key: string]: any;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }
    const token = authHeader.split(' ')[1];

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      const rawId = payload.id ?? payload.sub;

      if (!rawId) {
        throw new UnauthorizedException(
          'Invalid token payload: missing user ID',
        );
      }

      request['user'] = {
        id: Number(rawId),
        username: payload.username,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
