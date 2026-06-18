import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore';
import { Card, CardContent } from './Card';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, ready } = useAuthStore();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-8">
        <Card>
          <CardContent className="p-6 text-sm text-slate-500">Memuat sesi pengguna...</CardContent>
        </Card>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
