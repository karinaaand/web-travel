import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Sparkles, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { ErrorText } from '../components/ui/ErrorText';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { registerSchema, type RegisterValues } from '../lib/schemas';
import { useAuthStore } from '../features/auth/store/authStore';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, error, loading, token, clearError } = useAuthStore();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '' },
  });

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (token) navigate('/home', { replace: true });
  }, [navigate, token]);

  const onSubmit = async (values: RegisterValues) => {
    const ok = await registerUser(values);
    if (ok) navigate('/login', { replace: true });
  };

  return (
    <section className="page">
      <div className="container grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <Card variant="warm" className="overflow-hidden border-white/40">
          <CardContent className="flex min-h-140 flex-col justify-between gap-8 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.6),transparent_22%),linear-gradient(135deg,#f1d3ab_0%,#f4a261_40%,#0f4856_100%)] text-white">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              <Sparkles className="h-3.5 w-3.5" />
              Register
            </div>
            <div className="max-w-xl space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem] lg:leading-[1.02]">
                Bangun akun dan mulai berbagi cerita perjalanan.
              </h1>
              <p className="text-sm leading-7 text-white/85 sm:text-base">
                Form registrasi ini dirancang untuk onboarding yang lebih bersih, jelas, dan nyaman. Setelah berhasil, pengguna langsung diarahkan kembali ke halaman login.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                <UserPlus className="h-5 w-5" />
                <p className="mt-3 text-lg font-semibold">Onboarding cepat</p>
                <p className="mt-2 text-sm leading-6 text-white/80">Semua field utama disusun sederhana agar pengguna tidak bingung saat pertama masuk.</p>
              </div>
              <div className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                <Compass className="h-5 w-5" />
                <p className="mt-3 text-lg font-semibold">Siap eksplorasi</p>
                <p className="mt-2 text-sm leading-6 text-white/80">Setelah daftar, pengguna bisa lanjut login dan masuk ke katalog travel yang sudah dibenahi tampilannya.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/88">
          <CardHeader className="space-y-3">
            <div className="inline-flex w-fit rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-900">
              Register Page
            </div>
            <CardTitle className="text-2xl sm:text-[2rem]">Buat akun baru</CardTitle>
            <CardDescription>
              Lengkapi data dasar untuk membuat akun dan mulai menggunakan Web Travel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input id="username" {...form.register('username')} placeholder="Pilih username" />
                {form.formState.errors.username?.message ? <span className="text-sm text-rose-600">{form.formState.errors.username.message}</span> : null}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register('email')} placeholder="Masukkan email aktif" />
                {form.formState.errors.email?.message ? <span className="text-sm text-rose-600">{form.formState.errors.email.message}</span> : null}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...form.register('password')} placeholder="Minimal 6 karakter" />
                {form.formState.errors.password?.message ? <span className="text-sm text-rose-600">{form.formState.errors.password.message}</span> : null}
              </div>

              <ErrorText message={error} />

              <Button type="submit" disabled={loading} className="w-full rounded-2xl">
                {loading ? 'Mendaftarkan akun...' : 'Daftar'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Sudah punya akun?{' '}
              <Link to="/login" className="font-semibold text-teal-900 hover:underline">
                Masuk di sini
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

