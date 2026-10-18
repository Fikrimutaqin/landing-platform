'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2, Layers } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, error, clearError, isLoading, isAuthenticated } = useAuth();

  const [name, setName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [planTier, setPlanTier] = useState<'FREE' | 'STARTER' | 'PRO'>('FREE');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Auto redirect to dashboard if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!name || !organizationName || !email || !password) {
      setLocalError('Harap lengkapi semua kolom formulir.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Kata sandi harus terdiri dari minimal 6 karakter.');
      return;
    }

    const ok = await register({
      name,
      organizationName,
      email,
      password,
      planTier,
    });

    if (ok) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-100/70 dark:bg-[#08090c] text-slate-900 dark:text-neutral-100 font-sans selection:bg-blue-100 dark:selection:bg-neutral-800">
      {/* Top Precision App Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-neutral-900 bg-white/95 dark:bg-[#08090c]/95 backdrop-blur-md px-4 sm:px-6 h-14 shrink-0 flex items-center justify-between select-none">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-bold tracking-tight text-slate-900 dark:text-white">
              Landing Platform
            </span>
            <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
              Funnel Builder
            </span>
          </div>
        </Link>

        <ThemeToggle />
      </header>

      {/* Main Centered Auth Form */}
      <main className="w-full max-w-sm mx-auto my-auto px-4 py-8">
        <Card className="shadow-sm dark:shadow-[0_1px_3px_0_rgba(0,0,0,0.4)] border-slate-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-950/90">
          <CardHeader className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-neutral-900 text-center sm:text-left">
            <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Buat Akun Merchant
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
              Daftarkan toko online Anda untuk mulai membuat funnel penjualan.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 space-y-4">
            {/* Error Message */}
            {(error || localError) && (
              <div className="p-3 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 text-xs">
                {localError || error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Budi Santoso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 text-xs sm:text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="orgName" className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
                  Nama Toko / Bisnis
                </Label>
                <Input
                  id="orgName"
                  type="text"
                  placeholder="Toko Berkah Alami"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="h-9 text-xs sm:text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
                  Email Bisnis
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="budi@tokoberkah.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 text-xs sm:text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
                    Kata Sandi
                  </Label>
                  <span className="text-[11px] text-slate-400">Min. 6 karakter</span>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-9 text-xs sm:text-sm pr-9"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Plan Tier Selection */}
              <div className="space-y-1.5 pt-1">
                <Label className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
                  Pilihan Paket
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'FREE', name: 'Free', price: 'Rp 0' },
                    { id: 'STARTER', name: 'Starter', price: 'Rp 99k' },
                    { id: 'PRO', name: 'Business', price: 'Rp 299k' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setPlanTier(tier.id as any)}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        planTier === tier.id
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500'
                          : 'border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-900 text-slate-700 dark:text-neutral-300'
                      }`}
                    >
                      <div className="text-xs font-semibold">{tier.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-neutral-400 font-mono mt-0.5">
                        {tier.price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-9 text-xs sm:text-sm font-semibold mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    Mendaftarkan Akun...
                  </>
                ) : (
                  'Daftar Akun Merchant'
                )}
              </Button>
            </form>

            {/* Switch to Login */}
            <div className="text-center text-xs text-slate-500 dark:text-neutral-400 pt-2 border-t border-slate-100 dark:border-neutral-900">
              Sudah memiliki akun merchant?{' '}
              <Link
                href="/"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Masuk di sini
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-neutral-900 py-4 px-4 text-center text-[11px] text-slate-400 dark:text-neutral-500 font-mono">
        Landing Platform • Merchant Funnel & Page Builder
      </footer>
    </div>
  );
}
