import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
  };
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number | undefined => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user.id;
  },
);
