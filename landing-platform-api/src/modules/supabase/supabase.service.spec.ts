import { describe, it, expect, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from './supabase.service.js';

describe('SupabaseService', () => {
  let service: SupabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupabaseService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              const mockEnv: Record<string, string> = {
                SUPABASE_URL: 'https://xgsdyoqxwlhkvnjpatwp.supabase.co',
                SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test',
                SUPABASE_SECRET_KEY: 'sb_secret_test',
                SUPABASE_JWKS_URL: 'https://xgsdyoqxwlhkvnjpatwp.supabase.co/auth/v1/.well-known/jwks.json',
              };
              return mockEnv[key];
            },
          },
        },
      ],
    }).compile();

    service = module.get<SupabaseService>(SupabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize admin and public clients', () => {
    expect(service.getAdminClient()).toBeDefined();
    expect(service.getClient()).toBeDefined();
  });

  it('should create scoped client for given user token', () => {
    const scoped = service.createScopedClient('mock-user-jwt');
    expect(scoped).toBeDefined();
  });
});
