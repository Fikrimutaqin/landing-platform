import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role?: string;
  organizationId?: string;
  appMetadata?: Record<string, any>;
  userMetadata?: Record<string, any>;
  jwtPayload?: Record<string, any>;
}

export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser | undefined;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
