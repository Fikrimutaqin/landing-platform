import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createRemoteJWKSet, jwtVerify, JWTVerifyResult } from 'jose';

export interface SupabaseHealthStatus {
  status: 'connected' | 'degraded' | 'disconnected';
  projectRef: string;
  supabaseUrl: string;
  jwksUrl: string;
  jwksHealthy: boolean;
  authApiHealthy: boolean;
  latencyMs: number;
  timestamp: string;
}

export interface VerifiedTokenPayload {
  sub: string;
  email?: string;
  role?: string;
  organizationId?: string;
  appMetadata: Record<string, any>;
  userMetadata: Record<string, any>;
  raw: Record<string, any>;
}

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);

  private adminClient: SupabaseClient;
  private publicClient: SupabaseClient;
  private jwks: ReturnType<typeof createRemoteJWKSet>;

  private readonly supabaseUrl: string;
  private readonly publishableKey: string;
  private readonly secretKey: string;
  private readonly jwksUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.supabaseUrl =
      this.configService.get<string>('SUPABASE_URL') ||
      process.env.SUPABASE_URL ||
      '';
    this.publishableKey =
      this.configService.get<string>('SUPABASE_PUBLISHABLE_KEY') ||
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      '';
    this.secretKey =
      this.configService.get<string>('SUPABASE_SECRET_KEY') ||
      process.env.SUPABASE_SECRET_KEY ||
      '';
    this.jwksUrl =
      this.configService.get<string>('SUPABASE_JWKS_URL') ||
      process.env.SUPABASE_JWKS_URL ||
      '';

    if (!this.supabaseUrl || !this.secretKey) {
      this.logger.error(
        'Missing SUPABASE_URL or SUPABASE_SECRET_KEY in environment variables.',
      );
      throw new Error('Supabase configuration incomplete');
    }

    // Initialize Admin Client (isolated, no session caching in server processes)
    this.adminClient = createClient(this.supabaseUrl, this.secretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    // Initialize Public Client (scoped with publishable key)
    this.publicClient = createClient(
      this.supabaseUrl,
      this.publishableKey || this.secretKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    );

    // Initialize JWKS remote key set for cryptographic JWT verification
    if (this.jwksUrl) {
      this.jwks = createRemoteJWKSet(new URL(this.jwksUrl), {
        cacheMaxAge: 10 * 60 * 1000, // 10 minutes cache
        cooldownDuration: 30 * 1000, // 30 seconds cooldown
      });
    }
  }

  async onModuleInit() {
    this.logger.log('Initializing Supabase integration...');
    try {
      const health = await this.healthCheck();
      if (health.status === 'connected') {
        this.logger.log(
          `✅ Supabase connected successfully to project [${health.projectRef}] (${health.latencyMs}ms)`,
        );
      } else {
        this.logger.warn(
          `⚠️ Supabase connection status: ${health.status} (${health.latencyMs}ms)`,
        );
      }
    } catch (error: any) {
      this.logger.error(
        `❌ Supabase initialization failed: ${error?.message || error}`,
      );
    }
  }

  /**
   * Returns the privileged Admin Supabase client.
   * Use this for backend-only operations (e.g. background jobs, migrations, administrative user management).
   * WARNING: Never expose this client or its secret key to client/frontend bundles.
   */
  getAdminClient(): SupabaseClient {
    return this.adminClient;
  }

  /**
   * Returns the Public Supabase client (using publishable key).
   */
  getClient(): SupabaseClient {
    return this.publicClient;
  }

  /**
   * Creates an isolated Supabase client scoped to a user's Bearer JWT.
   * Any database queries or storage operations executed with this client
   * will run under the user's role and adhere to Supabase Row Level Security (RLS) policies.
   */
  createScopedClient(accessToken: string): SupabaseClient {
    return createClient(this.supabaseUrl, this.publishableKey || this.secretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
  }

  /**
   * Cryptographically verifies an incoming JWT against Supabase's JWKS endpoint.
   * Validates ES256/RS256 signature, expiry, and payload claims.
   */
  async verifyTokenWithJwks(token: string): Promise<VerifiedTokenPayload> {
    if (!this.jwks) {
      throw new Error('JWKS endpoint not configured');
    }

    const { payload }: JWTVerifyResult = await jwtVerify(token, this.jwks);

    const appMetadata = (payload.app_metadata as Record<string, any>) || {};
    const userMetadata = (payload.user_metadata as Record<string, any>) || {};

    // In multi-tenant environments, organization_id can be in user_metadata or app_metadata
    const organizationId =
      userMetadata.organization_id ||
      appMetadata.organization_id ||
      userMetadata.org_id ||
      appMetadata.org_id;

    return {
      sub: payload.sub as string,
      email: payload.email as string | undefined,
      role: (payload.role as string) || (payload.aud as string),
      organizationId,
      appMetadata,
      userMetadata,
      raw: payload as Record<string, any>,
    };
  }

  /**
   * Validates token via Supabase Auth API (`auth.getUser`).
   * Provides authoritative state check from Supabase Auth service.
   */
  async validateUserToken(token: string) {
    const { data, error } = await this.adminClient.auth.getUser(token);
    if (error || !data.user) {
      throw new Error(error?.message || 'Invalid user token');
    }
    return data.user;
  }

  /**
   * Health check method to test Supabase Auth and JWKS availability.
   * Returns sanitized diagnostic info without leaking secret keys.
   */
  async healthCheck(): Promise<SupabaseHealthStatus> {
    const start = Date.now();
    let authApiHealthy = false;
    let jwksHealthy = false;

    // 1. Check Auth / REST API
    try {
      const { data, error } = await this.adminClient.auth.admin.listUsers({
        page: 1,
        perPage: 1,
      });
      authApiHealthy = !error && !!data;
    } catch {
      authApiHealthy = false;
    }

    // 2. Check JWKS endpoint if configured
    if (this.jwksUrl) {
      try {
        const response = await fetch(this.jwksUrl, { method: 'GET' });
        jwksHealthy = response.ok;
      } catch {
        jwksHealthy = false;
      }
    } else {
      jwksHealthy = false;
    }

    const latencyMs = Date.now() - start;

    let status: 'connected' | 'degraded' | 'disconnected' = 'disconnected';
    if (authApiHealthy && jwksHealthy) {
      status = 'connected';
    } else if (authApiHealthy || jwksHealthy) {
      status = 'degraded';
    }

    const projectRef = this.extractProjectRef(this.supabaseUrl);

    return {
      status,
      projectRef,
      supabaseUrl: this.sanitizeUrl(this.supabaseUrl),
      jwksUrl: this.sanitizeUrl(this.jwksUrl),
      jwksHealthy,
      authApiHealthy,
      latencyMs,
      timestamp: new Date().toISOString(),
    };
  }

  private extractProjectRef(url: string): string {
    try {
      const parsed = new URL(url);
      const hostParts = parsed.hostname.split('.');
      return hostParts[0] || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  private sanitizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      return `${parsed.protocol}//${parsed.host}${parsed.pathname}`;
    } catch {
      return url;
    }
  }
}
