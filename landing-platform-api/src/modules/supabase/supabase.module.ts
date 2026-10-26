import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service.js';
import { SupabaseController } from './supabase.controller.js';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard.js';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [SupabaseController],
  providers: [SupabaseService, SupabaseAuthGuard],
  exports: [SupabaseService, SupabaseAuthGuard],
})
export class SupabaseModule {}
