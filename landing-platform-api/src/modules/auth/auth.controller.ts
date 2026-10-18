import { Controller, Post, Get, Put, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto, RegisterDto, UpdateProfileDto, AuthResponse } from './dto/auth.dto.js';

@ApiTags('Authentication & Identity')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new merchant account & organization' })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  async register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in with email & password' })
  @ApiResponse({ status: 200, description: 'Logged in successfully' })
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile & organization' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  async getMe(@Headers('authorization') authHeader?: string): Promise<AuthResponse> {
    return this.authService.getCurrentUser(authHeader);
  }

  @Put('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile or password' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async updateProfile(
    @Headers('authorization') authHeader: string | undefined,
    @Body() dto: UpdateProfileDto,
  ): Promise<AuthResponse> {
    return this.authService.updateProfile(authHeader, dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invalidate current session token' })
  @ApiResponse({ status: 200, description: 'Session terminated' })
  async logout(@Headers('authorization') authHeader?: string): Promise<{ success: boolean; message: string }> {
    return this.authService.logout(authHeader);
  }
}
