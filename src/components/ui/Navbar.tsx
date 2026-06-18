import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { User } from 'lucide-react';
import { useAuthStore } from '../../features/auth/store/authStore';
import { Button } from './Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu';

export function Navbar() {
  const navigate = useNavigate();
  const { user, token, logout, bootstrap, ready } = useAuthStore();

  useEffect(() => {
    if (!ready) void bootstrap();
  }, [bootstrap, ready]);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-white text-teal-700 shadow-[0_10px_24px_rgba(15,72,86,0.15)]'
        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <header className="sticky top-0 z-50 py-3 sm:py-4">
      <div className="container">
        <div className="flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/84 px-4 py-4 shadow-[0_20px_50px_rgba(31,42,46,0.12)] backdrop-blur-xl sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-3">
            <Link to={token ? '/home' : '/'} className="inline-flex items-center gap-3 text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f4856_0%,#1b6f78_55%,#f2a65a_100%)] text-sm font-bold text-white shadow-[0_14px_28px_rgba(15,72,86,0.2)]">
                TA
              </span>
              <span className="leading-tight">Travel Article App</span>
            </Link>
          </div>

          {!token ? (
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
              <nav className="flex flex-wrap items-center gap-2">
                <NavLink to="/" className={navClass}>Landing</NavLink>
                <NavLink to="/home" className={navClass}>Home</NavLink>
                <NavLink to="/explore" className={navClass}>Explore</NavLink>
                <NavLink to="/login" className={navClass}>Login</NavLink>
              </nav>
              <Button asChild className="rounded-full px-5 !text-white hover:!text-white">
                <Link to="/register" className="!text-white hover:!text-white">Register</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
              <nav className="flex flex-wrap items-center gap-2">
                <NavLink to="/home" className={navClass}>Home</NavLink>
                <NavLink to="/explore" className={navClass}>Explore</NavLink>
              </nav>

              <div className="flex items-center gap-3 self-start lg:self-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-teal-100 to-orange-100 text-slate-900 shadow-sm transition hover:scale-[1.02]">
                      {user?.username?.[0]?.toUpperCase() ?? <User className="h-4 w-4" />}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900">{user?.username}</p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-rose-600 focus:bg-rose-50 focus:text-rose-700"
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                    >
                      Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
