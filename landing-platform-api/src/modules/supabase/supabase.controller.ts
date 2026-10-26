import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseService } from './supabase.service.js';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard.js';
import { Public } from './decorators/public.decorator.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import type { AuthenticatedUser } from './decorators/current-user.decorator.js';

@ApiTags('Supabase')
@Controller('api/v1/supabase')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Public()
  @Get('status')
  @ApiOperation({
    summary: 'Check Supabase Connection Status',
    description:
      'Performs an end-to-end cryptographic and API check against the configured Supabase project.',
  })
  @ApiResponse({
    status: 200,
    description: 'Supabase connectivity and JWKS health report.',
  })
  async getStatus() {
    const health = await this.supabaseService.healthCheck();
    return {
      success: health.status === 'connected',
      data: health,
    };
  }

  @UseGuards(SupabaseAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Authenticated User Profile from Supabase Token',
    description:
      'Validates incoming Bearer JWT via Supabase JWKS / Auth API and returns user claims.',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user profile details.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized / invalid or expired Supabase token.',
  })
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return {
      success: true,
      data: user,
    };
  }
}
