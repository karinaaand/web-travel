import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';
import { PageLoader } from './ui/PageLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute wrapper untuk mengamankan routes yang memerlukan autentikasi
 * - Jika user belum login, redirect ke login page
 * - Jika user belum ready (masih loading), tampilkan loader
 * - Jika user sudah login, tampilkan component
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, ready } = useAuthStore();

  // Masih loading/bootstrap auth
  if (!ready) {
    return <PageLoader />;
  }

  // Tidak ada token (tidak login)
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // User sudah login dan ready
  return <>{children}</>;
}
