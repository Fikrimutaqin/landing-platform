import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import * as crypto from 'crypto';
import { LoginDto, RegisterDto, UpdateProfileDto, AuthResponse, AuthUser, Organization } from './dto/auth.dto.js';

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
  // In-memory repositories (hydrated with persistent default demo account)
  private users: Map<string, InternalUser> = new Map();
  private organizations: Map<string, Organization> = new Map();
  private sessions: Map<string, { userId: string; expiresAt: number }> = new Map();

  constructor() {
    this.seedDefaultData();
  }

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

  private seedDefaultData() {
    const defaultOrgId = 'org_default_merchant';
    const defaultOrg: Organization = {
      id: defaultOrgId,
      name: 'OrderOnline Pro Store',
      slug: 'orderonline-pro',
      planTier: 'BUSINESS',
      createdAt: new Date().toISOString(),
    };
    this.organizations.set(defaultOrgId, defaultOrg);

    const demoUserId = 'usr_demo_steven';
    const demoUser: InternalUser = {
      id: demoUserId,
      email: 'merchant@orderonline.id',
      name: 'Steven Mutaqin',
      role: 'OWNER',
      organizationId: defaultOrgId,
      passwordHash: this.hashPassword('Password123!'),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };
    this.users.set(demoUser.email.toLowerCase(), demoUser);
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
    if (this.users.has(emailNorm)) {
      throw new ConflictException('Email sudah terdaftar. Silakan gunakan email lain atau login.');
    }

    const orgId = `org_${Date.now()}`;
    const orgSlug = dto.organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `org-${Date.now()}`;

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
    const user = this.users.get(emailNorm);

    if (!user) {
      throw new UnauthorizedException('Email atau kata sandi tidak valid.');
    }

    const isMatch = this.verifyPassword(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Email atau kata sandi tidak valid.');
    }

    const token = this.createSession(user.id, dto.rememberMe !== false);
    const org = this.organizations.get(user.organizationId);

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
      organizationName: org?.name,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
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

    if (!session || session.expiresAt < Date.now()) {
      if (session) this.sessions.delete(token);
      throw new UnauthorizedException('Sesi telah kedaluwarsa. Silakan masuk kembali.');
    }

    let foundUser: InternalUser | undefined;
    for (const u of this.users.values()) {
      if (u.id === session.userId) {
        foundUser = u;
        break;
      }
    }

    if (!foundUser) {
      throw new UnauthorizedException('Pengguna tidak ditemukan.');
    }

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

  async updateProfile(authHeader: string | undefined, dto: UpdateProfileDto): Promise<AuthResponse> {
    const current = await this.getCurrentUser(authHeader);
    const user = Array.from(this.users.values()).find((u) => u.id === current.user?.id);
    if (!user) throw new BadRequestException('User tidak ditemukan.');

    if (dto.name) user.name = dto.name.trim();

    if (dto.newPassword) {
      if (!dto.currentPassword || !this.verifyPassword(dto.currentPassword, user.passwordHash)) {
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

  async logout(authHeader?: string): Promise<{ success: boolean; message: string }> {
    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      this.sessions.delete(token);
    }
    return { success: true, message: 'Berhasil keluar.' };
  }
}
