import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SupabaseService } from '../supabase.service.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(SupabaseAuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly supabaseService: SupabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException('Authorization header is required');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException(
        'Invalid Authorization header format. Expected Bearer <token>',
      );
    }

    try {
      // 1. Verify token cryptographically via Supabase JWKS (ES256/RS256)
      const verified = await this.supabaseService.verifyTokenWithJwks(token);

      // 2. Attach user payload and user-scoped Supabase client to request
      request.user = {
        id: verified.sub,
        email: verified.email,
        role: verified.role,
        organizationId: verified.organizationId,
        appMetadata: verified.appMetadata,
        userMetadata: verified.userMetadata,
      };

      // 3. Attach scoped Supabase client respecting Row Level Security
      request.supabase = this.supabaseService.createScopedClient(token);

      return true;
    } catch (err: any) {
      // Fallback: If JWKS verification encountered an error, attempt auth.getUser check
      try {
        const user = await this.supabaseService.validateUserToken(token);
        request.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          organizationId:
            user.user_metadata?.organization_id ||
            user.app_metadata?.organization_id,
          appMetadata: user.app_metadata,
          userMetadata: user.user_metadata,
        };
        request.supabase = this.supabaseService.createScopedClient(token);
        return true;
      } catch (fallbackErr: any) {
        this.logger.warn(
          `Token verification failed: ${err?.message || fallbackErr?.message}`,
        );
        throw new UnauthorizedException(
          'Invalid, expired, or revoked Supabase authentication token',
        );
      }
    }
  }
}
