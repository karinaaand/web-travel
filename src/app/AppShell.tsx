import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/ui/Navbar';
import { PageLoader } from '../components/ui/PageLoader';

export function AppShell() {
  return (
    <div className="surface-grid min-h-screen text-slate-900">
      <div className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,126,133,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(242,166,90,0.16),transparent_24%),linear-gradient(180deg,#fbf7f0_0%,#f6f1e8_55%,#efe8dc_100%)]">
        <Navbar />
        <main className="relative z-10 pb-4">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
