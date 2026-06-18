import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { ErrorText } from '../components/ui/ErrorText';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { loginSchema, type LoginValues } from '../lib/schemas';
import { useAuthStore } from '../features/auth/store/authStore';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, loading, token, clearError } = useAuthStore();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/home';

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '', rememberMe: true },
    mode: 'onChange',
  });

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (token) navigate(redirectTo, { replace: true });
  }, [navigate, redirectTo, token]);

  const onSubmit = async (values: LoginValues) => {
    const ok = await login(values);
    if (ok) navigate(redirectTo, { replace: true });
  };

  return (
    <section className="page">
      <div className="container grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <Card variant="soft" className="overflow-hidden border-white/40">
          <CardContent className="flex min-h-140 flex-col justify-between gap-8 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.65),transparent_25%),linear-gradient(135deg,#0f4856_0%,#1b6f78_55%,#f2a65a_100%)] text-white">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              <Sparkles className="h-3.5 w-3.5" />
              Otentikasi
            </div>
            <div className="max-w-xl space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem] lg:leading-[1.02]">
                Masuk dan lanjutkan eksplorasi travel article Anda.
              </h1>
              <p className="text-sm leading-7 text-white/85 sm:text-base">
                Login untuk menyimpan sesi pengguna, menulis komentar, mengelola artikel, dan membuka pengalaman eksplorasi travel yang lebih personal.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                <ShieldCheck className="h-5 w-5" />
                <p className="mt-3 text-lg font-semibold">Sesi aman</p>
                <p className="mt-2 text-sm leading-6 text-white/80">Akses akun tetap nyaman dipakai dari layar mobile sampai desktop.</p>
              </div>
              <div className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                <ArrowRight className="h-5 w-5" />
                <p className="mt-3 text-lg font-semibold">Lanjutkan cepat</p>
                <p className="mt-2 text-sm leading-6 text-white/80">Masuk, kembali ke artikel, lalu lanjutkan baca atau menulis tanpa terasa berat.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/88">
          <CardHeader className="space-y-3">
            <div className="inline-flex w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-900">
              Halaman Login
            </div>
            <CardTitle className="text-2xl sm:text-[2rem]">Selamat datang kembali</CardTitle>
            <CardDescription>
              Masuk ke akun Anda untuk melanjutkan eksplorasi, mengelola artikel, dan berinteraksi lewat komentar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-3">
                <Label htmlFor="identifier">Email atau Username</Label>
                <Input id="identifier" {...form.register('identifier')} placeholder="Masukkan email atau username" />
                {form.formState.errors.identifier?.message ? <span className="text-sm text-rose-600">{form.formState.errors.identifier.message}</span> : null}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...form.register('password')} placeholder="Masukkan password" />
                {form.formState.errors.password?.message ? <span className="text-sm text-rose-600">{form.formState.errors.password.message}</span> : null}
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/90 px-5 py-4 text-sm text-slate-700 transition hover:bg-slate-50">
                <input type="checkbox" className="size-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600" {...form.register('rememberMe')} />
                <span>Simpan sesi login di perangkat ini</span>
              </label>

              <ErrorText message={error} />

              <Button type="submit" disabled={loading} className="w-full rounded-2xl">
                {loading ? 'Memproses login...' : 'Masuk'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Belum punya akun?{' '}
              <Link to="/register" className="font-semibold text-teal-900 hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
