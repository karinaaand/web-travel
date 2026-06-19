import { Camera, Mail, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const quickLinks = [
  { label: 'Home', to: '/home' },
  { label: 'Explore', to: '/explore' },
  { label: 'Login', to: '/login' },
  { label: 'Register', to: '/register' },
];

const legalLinks = [
  { label: 'Privacy Policy', to: '/home' },
  { label: 'Terms of Service', to: '/explore' },
  { label: 'Usage Policy', to: '/home' },
];

const socials = [
  { label: 'X', href: 'https://x.com', icon: Send },
  { label: 'Instagram', href: 'https://instagram.com', icon: Camera },
  { label: 'Email', href: 'mailto:webtravel@example.com', icon: Mail },
];

export function Footer() {
  return (
    <footer className="relative z-10 mt-10 border-t border-slate-800/40 bg-[#030b1c] text-slate-200">
      <div className="container py-12 sm:py-14 lg:py-16">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3 text-lg font-extrabold tracking-tight text-white">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f4856_0%,#1b6f78_55%,#f2a65a_100%)] text-sm font-bold text-white shadow-[0_14px_28px_rgba(15,72,86,0.25)]">
                WT
              </span>
              <span>Web Travel</span>
            </div>
            <p className="max-w-sm text-base leading-8 text-slate-300/90">
              Menyajikan cerita perjalanan, inspirasi destinasi, dan pengalaman eksplorasi yang terasa hangat, modern, dan mudah dinikmati di berbagai perangkat.
            </p>
          </div>

          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="grid gap-3 text-base text-slate-300/90">
              {quickLinks.map((item) => (
                <Link key={item.label} to={item.to} className="transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white">Legal</h3>
            <div className="grid gap-3 text-base text-slate-300/90">
              {legalLinks.map((item) => (
                <Link key={item.label} to={item.to} className="transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white">Stay Inspired</h3>
            <p className="text-base leading-8 text-slate-300/90">
              Temukan ide perjalanan baru, artikel unggulan, dan sudut pandang menarik dari berbagai destinasi yang layak masuk daftar perjalananmu.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-slate-800/60 pt-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-slate-400">Copyright 2026 Web Travel. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            {socials.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="rounded-full p-2 transition hover:bg-white/5 hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
