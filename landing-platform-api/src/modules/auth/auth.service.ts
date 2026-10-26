import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service.js';
import * as schema from '../../database/schema.js';
import { SupabaseService } from '../supabase/supabase.service.js';
import {
  LoginDto,
  RegisterDto,
  UpdateProfileDto,
  AuthResponse,
  AuthUser,
  Organization,
} from './dto/auth.dto.js';

interface InternalUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  organizationId: string;
  avatarUrl?: string;
  createdAt: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  // In-memory repositories (for caching & offline fallback)
  private users: Map<string, InternalUser> = new Map();
  private organizations: Map<string, Organization> = new Map();
  private sessions: Map<string, { userId: string; expiresAt: number }> = new Map();

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly supabaseService: SupabaseService,
  ) {}

  private hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${hash}:${salt}`;
  }

  private verifyPassword(password: string, storedHash: string): boolean {
    const [hash, salt] = storedHash.split(':');
    if (!hash || !salt) return false;
    const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(testHash, 'hex'));
  }

  private createSession(userId: string, rememberMe = true): string {
    const token = `token_${crypto.randomBytes(32).toString('hex')}`;
    const ttlMs = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    this.sessions.set(token, {
      userId,
      expiresAt: Date.now() + ttlMs,
    });
    return token;
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const emailNorm = dto.email.trim().toLowerCase();
    const db = this.databaseService.getDb();

    const orgSlug =
      dto.organizationName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || `org-${Date.now()}`;

    // 1. Supabase PostgreSQL Persistence via Drizzle
    if (db) {
      try {
        const [existing] = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, emailNorm));

        if (existing) {
          throw new ConflictException(
            'Email sudah terdaftar. Silakan gunakan email lain atau login.',
          );
        }

        // Insert Organization in Supabase
        const [newOrg] = await db
          .insert(schema.organizations)
          .values({
            name: dto.organizationName.trim(),
            slug: `${orgSlug}-${Date.now().toString().slice(-4)}`,
            planTier: dto.planTier || 'FREE',
          })
          .returning();

        // Insert User in Supabase
        const passwordHash = this.hashPassword(dto.password);
        const [newUser] = await db
          .insert(schema.users)
          .values({
            organizationId: newOrg.id,
            email: emailNorm,
            passwordHash,
            name: dto.name.trim(),
            role: 'OWNER',
          })
          .returning();

        // Sync with Supabase Auth service
        try {
          await this.supabaseService.getAdminClient().auth.admin.createUser({
            email: emailNorm,
            password: dto.password,
            email_confirm: true,
            user_metadata: {
              name: dto.name.trim(),
              organization_id: newOrg.id,
              organization_name: newOrg.name,
            },
          });
        } catch (supaErr: any) {
          this.logger.debug(
            `Supabase Auth admin sync notice: ${supaErr?.message || supaErr}`,
          );
        }

        const token = this.createSession(newUser.id, true);

        // Cache in memory for fast lookup
        const org: Organization = {
          id: newOrg.id,
          name: newOrg.name,
          slug: newOrg.slug,
          planTier: newOrg.planTier,
          createdAt: newOrg.createdAt.toISOString(),
        };
        this.organizations.set(newOrg.id, org);

        const authUser: AuthUser = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role as 'OWNER' | 'ADMIN' | 'MEMBER',
          organizationId: newOrg.id,
          organizationName: newOrg.name,
          createdAt: newUser.createdAt.toISOString(),
        };

        return {
          success: true,
          token,
          user: authUser,
          organization: org,
          message: 'Registrasi berhasil. Selamat datang di Landing Platform!',
        };
      } catch (err: any) {
        if (err instanceof ConflictException) throw err;
        this.logger.warn(
          `PostgreSQL registration fallback triggered: ${err?.message || err}`,
        );
      }
    }

    // 2. In-Memory fallback if DB is temporarily unreachable
    if (this.users.has(emailNorm)) {
      throw new ConflictException(
        'Email sudah terdaftar. Silakan gunakan email lain atau login.',
      );
    }

    const orgId = `org_${Date.now()}`;
    const newOrg: Organization = {
      id: orgId,
      name: dto.organizationName.trim(),
      slug: orgSlug,
      planTier: dto.planTier || 'FREE',
      createdAt: new Date().toISOString(),
    };
    this.organizations.set(orgId, newOrg);

    const userId = `usr_${Date.now()}`;
    const newUser: InternalUser = {
      id: userId,
      email: emailNorm,
      name: dto.name.trim(),
      role: 'OWNER',
      organizationId: orgId,
      passwordHash: this.hashPassword(dto.password),
      createdAt: new Date().toISOString(),
    };
    this.users.set(emailNorm, newUser);

    const token = this.createSession(userId, true);

    const authUser: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      organizationId: newUser.organizationId,
      organizationName: newOrg.name,
      createdAt: newUser.createdAt,
    };

    return {
      success: true,
      token,
      user: authUser,
      organization: newOrg,
      message: 'Registrasi berhasil. Selamat datang di Landing Platform!',
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const emailNorm = dto.email.trim().toLowerCase();
    const db = this.databaseService.getDb();

    // 1. Try Supabase PostgreSQL lookup
    if (db) {
      try {
        const [userRecord] = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, emailNorm));

        if (userRecord) {
          const isMatch = this.verifyPassword(
            dto.password,
            userRecord.passwordHash,
          );
          if (!isMatch) {
            throw new UnauthorizedException('Email atau kata sandi tidak valid.');
          }

          const [orgRecord] = await db
            .select()
            .from(schema.organizations)
            .where(eq(schema.organizations.id, userRecord.organizationId));

          const org: Organization = orgRecord
            ? {
                id: orgRecord.id,
                name: orgRecord.name,
                slug: orgRecord.slug,
                planTier: orgRecord.planTier,
                createdAt: orgRecord.createdAt.toISOString(),
              }
            : {
                id: userRecord.organizationId,
                name: 'Default Store',
                slug: 'default-store',
                planTier: 'FREE',
                createdAt: new Date().toISOString(),
              };

          let token = this.createSession(userRecord.id, dto.rememberMe !== false);

          // Attempt to retrieve Supabase JWT if account exists in Supabase Auth
          try {
            const { data: supaAuth } =
              await this.supabaseService
                .getClient()
                .auth.signInWithPassword({
                  email: emailNorm,
                  password: dto.password,
                });
            if (supaAuth?.session?.access_token) {
              token = supaAuth.session.access_token;
              this.sessions.set(token, {
                userId: userRecord.id,
                expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
              });
            }
          } catch {
            // Keep server-generated token
          }

          const authUser: AuthUser = {
            id: userRecord.id,
            email: userRecord.email,
            name: userRecord.name,
            role: userRecord.role as 'OWNER' | 'ADMIN' | 'MEMBER',
            organizationId: userRecord.organizationId,
            organizationName: org.name,
            createdAt: userRecord.createdAt.toISOString(),
          };

          return {
            success: true,
            token,
            user: authUser,
            organization: org,
            message: 'Berhasil masuk.',
          };
        }
      } catch (err: any) {
        if (err instanceof UnauthorizedException) throw err;
        this.logger.warn(`Database login lookup fallback: ${err?.message || err}`);
      }
    }

    // 2. Check In-Memory fallback (e.g. demo merchant)
    const memUser = this.users.get(emailNorm);
    if (!memUser) {
      throw new UnauthorizedException('Email atau kata sandi tidak valid.');
    }

    const isMatch = this.verifyPassword(dto.password, memUser.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Email atau kata sandi tidak valid.');
    }

    const token = this.createSession(memUser.id, dto.rememberMe !== false);
    const org = this.organizations.get(memUser.organizationId);

    const authUser: AuthUser = {
      id: memUser.id,
      email: memUser.email,
      name: memUser.name,
      role: memUser.role,
      organizationId: memUser.organizationId,
      organizationName: org?.name,
      avatarUrl: memUser.avatarUrl,
      createdAt: memUser.createdAt,
    };

    return {
      success: true,
      token,
      user: authUser,
      organization: org,
      message: 'Berhasil masuk.',
    };
  }

  async getCurrentUser(authHeader?: string): Promise<AuthResponse> {
    if (!authHeader) {
      throw new UnauthorizedException('Sesi tidak ditemukan.');
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const session = this.sessions.get(token);
    const db = this.databaseService.getDb();

    // 1. Check local session
    if (session && session.expiresAt > Date.now()) {
      if (db) {
        try {
          const [userRecord] = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.id, session.userId));

          if (userRecord) {
            const [orgRecord] = await db
              .select()
              .from(schema.organizations)
              .where(eq(schema.organizations.id, userRecord.organizationId));

            const org: Organization | undefined = orgRecord
              ? {
                  id: orgRecord.id,
                  name: orgRecord.name,
                  slug: orgRecord.slug,
                  planTier: orgRecord.planTier,
                  createdAt: orgRecord.createdAt.toISOString(),
                }
              : undefined;

            return {
              success: true,
              token,
              user: {
                id: userRecord.id,
                email: userRecord.email,
                name: userRecord.name,
                role: userRecord.role as 'OWNER' | 'ADMIN' | 'MEMBER',
                organizationId: userRecord.organizationId,
                organizationName: org?.name,
                createdAt: userRecord.createdAt.toISOString(),
              },
              organization: org,
            };
          }
        } catch {
          // fallback to memory
        }
      }

      // Memory lookup
      let foundUser: InternalUser | undefined;
      for (const u of this.users.values()) {
        if (u.id === session.userId) {
          foundUser = u;
          break;
        }
      }

      if (foundUser) {
        const org = this.organizations.get(foundUser.organizationId);
        return {
          success: true,
          token,
          user: {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
            role: foundUser.role,
            organizationId: foundUser.organizationId,
            organizationName: org?.name,
            avatarUrl: foundUser.avatarUrl,
            createdAt: foundUser.createdAt,
          },
          organization: org,
        };
      }
    }

    // 2. Check Supabase JWKS verification
    try {
      const verified = await this.supabaseService.verifyTokenWithJwks(token);
      if (verified && verified.sub) {
        return {
          success: true,
          token,
          user: {
            id: verified.sub,
            email: verified.email || '',
            name: verified.userMetadata?.name || verified.email || 'User',
            role: (verified.role as any) || 'OWNER',
            organizationId: verified.organizationId || 'org_default',
            organizationName:
              verified.userMetadata?.organization_name || 'My Store',
          },
        };
      }
    } catch {
      // not a Supabase JWT
    }

    if (session) this.sessions.delete(token);
    throw new UnauthorizedException(
      'Sesi telah kedaluwarsa. Silakan masuk kembali.',
    );
  }

  async updateProfile(
    authHeader: string | undefined,
    dto: UpdateProfileDto,
  ): Promise<AuthResponse> {
    const current = await this.getCurrentUser(authHeader);
    const user = Array.from(this.users.values()).find(
      (u) => u.id === current.user?.id,
    );
    if (!user) throw new BadRequestException('User tidak ditemukan.');

    if (dto.name) user.name = dto.name.trim();

    if (dto.newPassword) {
      if (
        !dto.currentPassword ||
        !this.verifyPassword(dto.currentPassword, user.passwordHash)
      ) {
        throw new BadRequestException('Kata sandi saat ini salah.');
      }
      user.passwordHash = this.hashPassword(dto.newPassword);
    }

    const org = this.organizations.get(user.organizationId);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId,
        organizationName: org?.name,
        avatarUrl: user.avatarUrl,
      },
      organization: org,
      message: 'Profil berhasil diperbarui.',
    };
  }

  async logout(
    authHeader?: string,
  ): Promise<{ success: boolean; message: string }> {
    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      this.sessions.delete(token);
    }
    return { success: true, message: 'Berhasil keluar.' };
  }
}
