'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthUser, Organization, LoginDto, RegisterDto, AuthResponse, UserProfileUpdateDto } from '../../../shared/types';

interface AuthContextType {
  user: AuthUser | null;
  organization: Organization | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginDto) => Promise<boolean>;
  register: (payload: RegisterDto) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (payload: UserProfileUpdateDto) => Promise<boolean>;
  clearError: () => void;
}

const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  return envUrl.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');
};

const API_BASE_URL = getApiBaseUrl();
const TOKEN_KEY = 'platform_auth_token';
const USER_KEY = 'platform_auth_user';
const ORG_KEY = 'platform_auth_org';

const formatErrorMessage = (data: any, fallback: string): string => {
  if (!data) return fallback;
  if (Array.isArray(data.message)) {
    return data.message.join(', ');
  }
  if (typeof data.message === 'string' && data.message.trim()) {
    return data.message;
  }
  if (typeof data.error === 'string' && data.error.trim()) {
    return data.error;
  }
  return fallback;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const saveAuthSession = (authToken: string, authUser: AuthUser, authOrg: Organization) => {
    setToken(authToken);
    setUser(authUser);
    setOrganization(authOrg);
    try {
      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem(USER_KEY, JSON.stringify(authUser));
      localStorage.setItem(ORG_KEY, JSON.stringify(authOrg));
    } catch {
      // ignore storage errors
    }
  };

  const clearAuthSession = () => {
    setToken(null);
    setUser(null);
    setOrganization(null);
    if (typeof window !== 'undefined') {
      try {
        const theme = localStorage.getItem('platform_theme');
        localStorage.clear();
        if (theme) {
          localStorage.setItem('platform_theme', theme);
        }
      } catch {
        // ignore storage errors
      }
    }
  };

  // Rehydrate on page load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);
        const storedOrg = localStorage.getItem(ORG_KEY);

        if (storedToken && storedUser) {
          try {
            const parsedUser: AuthUser = JSON.parse(storedUser);
            setUser(parsedUser);
            if (storedOrg) setOrganization(JSON.parse(storedOrg));
            setToken(storedToken);

            // Attempt to verify with NestJS backend
            const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
              headers: { Authorization: `Bearer ${storedToken}` },
            });
            if (res.ok) {
              const data: AuthResponse = await res.json();
              if (data.user) {
                const resolvedOrg: Organization = data.organization || (storedOrg ? JSON.parse(storedOrg) : {
                  id: data.user.organizationId || 'org_merchant',
                  name: data.user.organizationName || 'Toko Merchant',
                  slug: 'toko-merchant',
                  planTier: 'FREE',
                  createdAt: new Date().toISOString(),
                });
                saveAuthSession(storedToken, data.user, resolvedOrg);
              }
            }
          } catch {
            // Keep stored cached user if server is temporarily unreachable
          }
        }
      } catch {
        // LocalStorage blocked
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginDto): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        setError(formatErrorMessage(data, 'Email atau kata sandi tidak sesuai.'));
        setIsLoading(false);
        return false;
      }

      if (data.token && data.user) {
        const resolvedOrg: Organization = data.organization || {
          id: data.user.organizationId || 'org_default',
          name: data.user.organizationName || 'Toko Online',
          slug: 'toko-online',
          planTier: 'FREE',
          createdAt: new Date().toISOString(),
        };
        saveAuthSession(data.token, data.user, resolvedOrg);
      }
      setIsLoading(false);
      return true;
    } catch {
      setError('Gagal menghubungi server NestJS (http://localhost:4000). Pastikan backend sedang berjalan.');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (payload: RegisterDto): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        setError(formatErrorMessage(data, 'Registrasi gagal. Silakan coba dengan email lain.'));
        setIsLoading(false);
        return false;
      }

      if (data.token && data.user) {
        const resolvedOrg: Organization = data.organization || {
          id: data.user.organizationId || 'org_default',
          name: payload.organizationName,
          slug: 'org-store',
          planTier: payload.planTier || 'FREE',
          createdAt: new Date().toISOString(),
        };
        saveAuthSession(data.token, data.user, resolvedOrg);
      }
      setIsLoading(false);
      return true;
    } catch {
      setError('Koneksi terputus ke server NestJS. Mohon periksa koneksi Anda.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      clearAuthSession();
    }
  };

  const updateProfile = async (payload: UserProfileUpdateDto): Promise<boolean> => {
    if (!token) return false;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        setError(formatErrorMessage(data, 'Gagal memperbarui profil.'));
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        const currentOrg: Organization = data.organization || organization || {
          id: data.user.organizationId || 'org_merchant',
          name: data.user.organizationName || 'Toko Merchant',
          slug: 'toko-merchant',
          planTier: 'FREE',
          createdAt: new Date().toISOString(),
        };
        saveAuthSession(token, data.user, currentOrg);
      }
      setIsLoading(false);
      return true;
    } catch {
      setError('Koneksi gagal saat update profil.');
      setIsLoading(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        token,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
